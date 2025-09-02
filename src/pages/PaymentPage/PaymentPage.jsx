import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth0 } from "@auth0/auth0-react";
import CreditCardIcon from "../../assets/icons/credit-card.png";
import {
  createSubscriptionStripe,
  getSubscriptionPlanDetailsById,
  requestSubscriptionLink,
} from "../../services/BillingService";
import { formatNumber, getBillingFrequencyCaption } from "../../utils/utils";
import { StripeFormContainer } from "./StripeForm";
import "./styles.css";

export const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.datos);
  const { isLoading } = useAuth0();
  const navigate = useNavigate();
  const params = useParams();
  const [planData, setPlanData] = useState();
  const [currencyConfirmed, setCurrencyConfirmed] = useState(false);
  const [subscriptionStripeData, setSubscriptionStripeData] = useState();
  const [currencySelectedData, setCurrencySelectedData] = useState(undefined);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const authorize = async () => {
    if (!isLoading) {
      if (user?.isAdmin) return navigate("/users");
      if (user?.isInstitution) return navigate("/own-home");
      console.log("user: ", user);
      if (
        user?.nextBillingTime ||
        (user?.subscriptionValidUntil &&
          new Date(user?.subscriptionValidUntil).getTime() > Date.now())
      )
        return navigate("/");
    }
  };
  useEffect(() => {
    authorize();
  }, [user]);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const { data } = await getSubscriptionPlanDetailsById(params?.plan_id);
      setPlanData(data);
    } catch (e) {
      console.log(e);
      toast("Lo sentimos, ocurrió un error.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaypalSubscription = async () => {
    setLoading(true);
    try {
      const {
        data: { link },
      } = await requestSubscriptionLink(params?.plan_id);
      window.location.href = link;
    } catch (e) {
      console.log(e);
      toast("No se pudo obtener el enlace de subscripción.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSubscription = async () => {
    setLoading(true);
    try {
      if (!planData.hasFreeTrial) {
        const { data } = await createSubscriptionStripe(
          params?.plan_id,
          undefined,
          currencySelectedData
        );
        setSubscriptionStripeData(data);
      } else setSubscriptionStripeData({});
    } catch (e) {
      console.log(e);
      toast("No se pudo crear la subscripción.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          width: "100%",
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p className="poppins-regular">Un momento por favor...</p>
        <CircularProgress />
      </div>
    );

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "75vh",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          className="poppins-semibold"
          style={{ margin: "20px 20px 10px 20px", fontSize: "2rem" }}
        >
          Estas a punto de comenzar a aprender inglés...
        </p>
        {planData?.hasFreeTrial && (
          <p style={{ color: "green" }}>
            <b>¡Incluye 7 días de prueba gratis!</b>
          </p>
        )}
        {planData?.totalCycles && (
          <p style={{ color: "blue" }}>
            <b>{planData.totalCycles} ciclos de facturación totales.</b>
          </p>
        )}
        <p style={{ margin: "0 20px" }}>
          Tu suscripción será de{" "}
          {!currencySelectedData || currencySelectedData == "USD" ? (
            <b>USD ${formatNumber(planData?.price)}</b>
          ) : (
            <b>
              {currencySelectedData} $
              {formatNumber(
                planData?.additional_currencies?.find(
                  (currency) => currency.currency === currencySelectedData
                )?.amount
              )}
            </b>
          )}{" "}
          facturados{" "}
          <b>{getBillingFrequencyCaption(planData?.billing_frequency)}. </b>
        </p>
        
        {/* Profile Access Information */}
        {planData?.profile === undefined ? (
          <p style={{ color: "green", margin: "10px 20px", fontWeight: "bold" }}>
            ✅ Acceso al Curso Completo
          </p>
        ) : (
          <div style={{ margin: "10px 20px", textAlign: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setShowProfileModal(true)}
              style={{ fontSize: "0.8rem" }}
            >
              Ver detalles de acceso
            </Button>
          </div>
        )}

        {/* Profile Details Modal */}
        <Dialog 
          open={showProfileModal} 
          onClose={() => setShowProfileModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Detalles de Acceso a la plataforma con este plan
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Perfil: {planData?.profile?.nombre}
              </Typography>
              
              {planData?.profile?.units && planData.profile.units.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Unidades Incluidas:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {planData.profile.units.map((unit, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontWeight: "500"
                        }}
                      >
                        Unidad {unit}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              
              {planData?.profile?.skills && planData.profile.skills.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Habilidades Incluidas:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {planData.profile.skills.map((skill, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#f3e5f5",
                          color: "#7b1fa2",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontWeight: "500"
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowProfileModal(false)} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {!subscriptionStripeData && !currencyConfirmed ? (
          <div className="paymentpage-container" style={{ zIndex: 100 }}>
            <h2>Elige tu método de pago</h2>
            <button
              className="paymentpage-button paymentpage-credit-card"
              onClick={() => setSubscriptionStripeData({})}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={CreditCardIcon}
                  style={{ width: "20px", marginRight: 8 }}
                />{" "}
                Tarjeta
              </div>
              {planData?.additional_currencies?.length > 0 && (
                <div
                  className="poppins-regular"
                  style={{
                    background: "green",
                    color: "white",
                    borderRadius: "10px",
                    border: "1px solid black",
                    padding: "3px",
                    fontSize: "0.5rem",
                    textAlign: "center",
                    position: "absolute",
                    top: -10,
                    right: -15,
                  }}
                >
                  OTRAS MONEDAS DISPONIBLES
                </div>
              )}
            </button>
            <button
              className="paymentpage-button paymentpage-paypal"
              onClick={handlePaypalSubscription}
            >
              <img
                src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                style={{ width: "20px" }}
              />{" "}
              PayPal
            </button>
          </div>
        ) : !currencyConfirmed ? (
          <div
            className="paymentpage-container"
            style={{
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p>Elige la moneda en la que deseas pagar</p>
            <div style={{ margin: "10px 10px 0 10px", width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={currencySelectedData}
                  label="Moneda"
                  onChange={(e) => {
                    setCurrencySelectedData(e.target.value);
                  }}
                  sx={{ minWidth: 250 }}
                >
                  <MenuItem key={"USD"} value={"USD"}>
                    <span className="poppins-semibold">
                      ${formatNumber(planData?.price)}{" "}
                    </span>
                    <b style={{ marginLeft: 5 }}>USD</b>
                  </MenuItem>
                  {planData?.additional_currencies?.map((currency) => (
                    <MenuItem key={currency.currency} value={currency.currency}>
                      <span className="poppins-semibold">
                        ${formatNumber(currency.amount)}{" "}
                      </span>
                      <b style={{ marginLeft: 5 }}>{currency.currency}</b>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ margin: "10px", width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                disabled={!currencySelectedData}
                onClick={() => {
                  setCurrencyConfirmed(true);
                  handleStripeSubscription();
                }}
              >
                CONTINUAR
              </Button>
            </div>
          </div>
        ) : (
          <StripeFormContainer
            {...subscriptionStripeData}
            planData={planData}
            currencySelected={currencySelectedData}
          />
        )}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        style={{ position: "fixed", bottom: 0 }}
      >
        <path
          style={{ zIndex: -100 }}
          fill="#0099ff"
          fillOpacity="0.8"
          d="M0,32L30,48C60,64,120,96,180,96C240,96,300,64,360,48C420,32,480,32,540,58.7C600,85,660,139,720,176C780,213,840,235,900,208C960,181,1020,107,1080,112C1140,117,1200,203,1260,229.3C1320,256,1380,224,1410,208L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>
    </>
  );
};
