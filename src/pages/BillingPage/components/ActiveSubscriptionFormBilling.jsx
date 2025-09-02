import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import moment from "moment-timezone";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ConfirmDialogModal } from "../../../components/ConfirmDialogModal/ConfirmDialogModal";
import { requestExtraUnits } from "../../../services/UsersService";
import { getBillingFrequencyCaption } from "../../../utils/utils";
import "./styles.css";

export const ActiveSubscriptionFormBilling = ({
  handleStopSubscription,
  loading,
  userBillingData,
  isMobile,
}) => {
  const { user } = useSelector((state) => state.datos);
  const [premioLoading, setPremioLoading] = useState(false);
  const [showStopSubscriptionModal, setShowStopSubscriptionModal] =
    useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleRequestExtraUnits = async () => {
    setPremioLoading(true);
    try {
      await requestExtraUnits();
      localStorage.setItem("EXTRA_UNITS_REQUESTED", true);
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      const { message } = error.response.data;
      toast(`No se pudo reclamar las unidades de premio: ${message}`, {
        type: "error",
        autoClose: 7000,
      });
    } finally {
      setPremioLoading(false);
    }
  };

  return (
    <>
      <div className="active-subscription-container">
        <p className="active-subscription-text">
          ¡Tienes una subscripción activa!
        </p>
        
        {/* Profile Access Information */}
        {userBillingData?.profile === undefined ? (
          <div style={{ margin: "10px 0", textAlign: "center" }}>
            <p style={{ color: "green", fontWeight: "bold", fontSize: "0.9rem", margin: "5px 0" }}>
              ✅ Acceso al Curso Completo
            </p>
          </div>
        ) : (
          <div style={{ margin: "10px 0", textAlign: "center" }}>
            <button
              onClick={() => setShowProfileModal(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px",
                borderRadius: "4px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              <p style={{ color: "#1976d2", fontWeight: "bold", fontSize: "0.9rem", margin: "5px 0" }}>
                📚 Acceso Limitado
              </p>
              <p style={{ color: "#666", fontSize: "0.8rem", margin: "2px 0" }}>
                {userBillingData.profile.units?.length > 0 && `${userBillingData.profile.units.length} unidades`}
                {userBillingData.profile.units?.length > 0 && userBillingData.profile.skills?.length > 0 && " • "}
                {userBillingData.profile.skills?.length > 0 && `${userBillingData.profile.skills.length} habilidades`}
              </p>
              <p style={{ color: "#999", fontSize: "0.7rem", margin: "2px 0", fontStyle: "italic" }}>
                Clic para ver detalles
              </p>
            </button>
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
            Detalles de tu Acceso Actual
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Perfil: {userBillingData?.profile?.nombre}
              </Typography>
              
              {userBillingData?.profile?.units && userBillingData.profile.units.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Unidades Incluidas:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {userBillingData.profile.units.map((unit, index) => (
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
              
              {userBillingData?.profile?.skills && userBillingData.profile.skills.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Habilidades Incluidas:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {userBillingData.profile.skills.map((skill, index) => (
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

        {userBillingData && (
          <div className="active-billing-item">
            <div className="active-billing-detail">
              <p className="poppins-regular">ID de Subscripción</p>
              <p className="poppins-bold subscription-id">
                {user?.subscriptionID}
              </p>
            </div>
            <div className="active-billing-detail">
              <p className="poppins-regular">Frecuencia</p>
              <p className="poppins-bold">
                {getBillingFrequencyCaption(userBillingData?.billing_frequency)}
              </p>
            </div>
            <div className="active-billing-detail">
              <p className="poppins-regular">Monto</p>
              <p className="poppins-bold">
                {userBillingData?.currency} ${userBillingData?.price}
              </p>
            </div>
            <div className="active-billing-detail">
              <p className="poppins-regular">Próximo Cobro</p>
              <p className="poppins-bold">
                {moment(userBillingData?.nextBillingTime).format("DD/MM/YYYY")}
              </p>
            </div>
            {userBillingData?.totalCycles && (
              <div className="active-billing-detail">
                <p className="poppins-regular">Ciclos</p>
                <p className="poppins-bold">
                  {userBillingData?.currentCycle || 1} de{" "}
                  {userBillingData?.totalCycles}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bonus-units-container">
        <div className="bonus-icon-container">
          <CardGiftcardIcon style={{ color: "#FFF" }} fontSize="large" />
        </div>
        <div className="bonus-content-container">
          <p className="bonus-title">Unidades de premio</p>
          <p className="bonus-description">
            {user.extraUnitsRequested === 5
              ? "Ya reclamaste todas tus unidades de premio de este mes."
              : "Premiamos a nuestros mejores alumnos con unidades extra cada mes. Para recibir unidades de premio, debes alcanzar un promedio mayor igual al 60% entre las unidades del mes (de facturación) corriente. Obtendrás 1 unidad de premio. Luego, podrás pedir hasta 5 por mes corriente a medida que vayas superando el 60% en cada una."}
          </p>

          {premioLoading ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={() => handleRequestExtraUnits()}
              className="bonus-button"
              variant="contained"
              disabled={user.extraUnitsRequested === 5}
            >
              SOLICITAR UNIDADES DE PREMIO
            </Button>
          )}
        </div>
      </div>
      <div className="cancel-subscription-container">
        <Button
          color="error"
          onClick={() => setShowStopSubscriptionModal(true)}
          fullWidth
        >
          Quiero cancelar mi subscripción
        </Button>
      </div>
      <ConfirmDialogModal
        color={"error"}
        loading={loading}
        message={
          "¿Deseas cancelar tu subscripción de nuestro servicio premium?"
        }
        onClose={() => setShowStopSubscriptionModal(false)}
        onConfirm={handleStopSubscription}
        open={showStopSubscriptionModal}
      />
    </>
  );
};
