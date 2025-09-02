import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getUserBillingData,
  stopSubscription,
} from "../../services/BillingService";
import { subscribeToInstitution } from "../../services/UsersService";
import "./BillingPage.css";
import { ActiveSubscriptionFormBilling } from "./components/ActiveSubscriptionFormBilling";
import { InactiveSubscriptionNotExpiredFormBilling } from "./components/InactiveSubscriptionNotExpiredBilling";
import { NotSuscribedFormBilling } from "./components/NotSuscribedFormBilling";
import { ProcessingSubscription } from "./components/ProcessingSubscription";

export const BillingPage = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [institutionModalOpen, setInstitutionModalOpen] = useState();
  const [inscribiendo, setInscribiendo] = useState();
  const [institutionCode, setInstitutionCode] = useState();
  const [planSelected, setPlanSelected] = useState(undefined);
  const { user } = useSelector((state) => state.datos);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubscription = async () => {
    navigate(`/payment/${planSelected}`);
  };

  const handleStopSubscription = async () => {
    setLoading(true);
    try {
      await stopSubscription();
      localStorage.setItem("SUBSCRIPTION_CANCELLED", true);
      window.location.href = "/";
    } catch (e) {
      console.log(e);
      toast(
        "No se pudo dar de baja la subscripción. Ponte en contacto con nosotros.",
        { type: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: userBillingData } = await getUserBillingData();
      setUserData(userBillingData);
    } catch (e) {
      console.log(e);
      toast("No se pudieron cargar los datos de facturación.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmSubscribeToInstitution = async () => {
    setInscribiendo(true);
    try {
      const {
        data: { institutionName },
      } = await subscribeToInstitution(institutionCode);
      localStorage.setItem("successfully_inscription", institutionName);
      window.location.href = "/";
    } catch (e) {
      const status = e?.response?.data?.statusCode;
      if (status === 400)
        return toast("El código es inválido.", { type: "error" });
      console.log(e);
      toast("Ocurrió un error inesperado.", { type: "error" });
    } finally {
      setInscribiendo(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <div className="billing-loading-container">
      <CircularProgress />
    </div>
  ) : (
    <div className="billing-page">
      {userData?.institutionName ? (
        <div className="billing-institution-info">
          <p>
            Perteneces a la institución <b>{userData.institutionName}</b> y tu
            licencia es válida hasta el{" "}
            <b>{moment(userData.institutionValidTo).format("DD/MM/YYYY")}</b>
          </p>
        </div>
      ) : (
        <>
          {new Date(user?.nextBillingTime || 0).getTime() < Date.now() &&
            userData?.subscriptionID && (
              <div className="billing-institution-button-container">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => setInstitutionModalOpen(true)}
                >
                  Inscribirse en institución
                </Button>
              </div>
            )}
          <div className="billing-subscription-container">
            <div className="billing-subscription">
              <div className="billing-icon-container">
                <WorkspacePremiumIcon
                  style={{ color: "#FFF" }}
                  fontSize="large"
                />
              </div>
              <div className="billing-content-container">
                <p className="billing-title">Mi subscripción</p>
                {user?.processingSubscription ? (
                  <ProcessingSubscription />
                ) : user?.subscriptionID &&
                  user?.nextBillingTime &&
                  new Date(user?.nextBillingTime).getTime() >
                    Date.now() - 1000 * 60 * 60 * 24 * 2 ? (
                  <ActiveSubscriptionFormBilling
                    handleStopSubscription={handleStopSubscription}
                    loading={loading}
                    userBillingData={userData}
                    isMobile={isMobile}
                  />
                ) : user?.subscriptionValidUntil &&
                  new Date(user?.subscriptionValidUntil).getTime() >
                    Date.now() ? (
                  <InactiveSubscriptionNotExpiredFormBilling
                    subscriptionValidUntil={user?.subscriptionValidUntil}
                    userBillingData={userData}
                  />
                ) : (
                  <NotSuscribedFormBilling
                    handleSubscription={handleSubscription}
                    planSelected={planSelected}
                    setPlanSelected={setPlanSelected}
                  />
                )}
              </div>
            </div>
          </div>
          <h3 className="billing-payments-title">Tus pagos</h3>
          <div className="billing-list">
            {userData?.bills?.length === 0 ? (
              <p className="billing-no-payments">
                Aún no tienes pagos realizados en la plataforma.
              </p>
            ) : (
              userData?.bills.map((bill, i) => (
                <div key={`bill-${i}`}>
                  <div className="billing-item">
                    <span className="billing-num">{i + 1}</span>
                    <div className="billing-detail">
                      <p className="poppins-regular">Fecha</p>
                      <p className="poppins-bold">
                        {bill.createdAt.substring(0, 10)}
                      </p>
                    </div>
                    <div className="billing-detail">
                      <p className="poppins-regular">ID de operación</p>
                      <p className="poppins-bold">{bill.operationId}</p>
                    </div>
                    <div className="billing-detail">
                      <p className="poppins-regular">Monto</p>
                      <p className="poppins-bold">
                        {bill.currency} ${bill.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      <Modal
        open={institutionModalOpen}
        onClose={() => setInstitutionModalOpen(false)}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 1,
          }}
        >
          <div className="billing-institution-modal">
            <p>Ingrese el código generado por la institucióon.</p>
            <div className="billing-institution-field">
              <TextField
                variant="outlined"
                label="Código seguro"
                fullWidth
                value={institutionCode}
                onChange={({ target: { value } }) => setInstitutionCode(value)}
              />
            </div>
            {inscribiendo ? (
              <CircularProgress />
            ) : (
              <>
                <div className="billing-institution-button-full">
                  <Button
                    fullWidth
                    onClick={() => setInstitutionModalOpen(false)}
                  >
                    CANCELAR
                  </Button>
                </div>
                <div className="billing-institution-button-full">
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={confirmSubscribeToInstitution}
                    color="success"
                  >
                    INSCRIBIRSE
                  </Button>
                </div>
              </>
            )}
          </div>
        </Paper>
      </Modal>
    </div>
  );
};
