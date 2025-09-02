import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import moment from "moment-timezone";
import { useState } from "react";

export const InactiveSubscriptionNotExpiredFormBilling = ({
  subscriptionValidUntil,
  userBillingData,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <p
        className="poppins-regular"
        style={{
          color: "#4D4D4D",
          fontSize: "1rem",
          margin: "0 20px 20px 20px",
        }}
      >
        No tienes una subscripción activa. No efectuaremos ningún cobro en tu
        método de pago. Aún conservas acceso premium hasta el{" "}
        <span className="poppins-semibold">
          {moment(subscriptionValidUntil).format("DD/MM/YYYY")}
        </span>
        . Para volver a suscribirte, debes esperar a perder el acceso premium.
      </p>
      
      {/* Profile Access Information */}
      {userBillingData?.profile === undefined ? (
        <div style={{ margin: "10px 20px", textAlign: "center" }}>
          <p style={{ color: "green", fontWeight: "bold", fontSize: "0.9rem", margin: "5px 0" }}>
            ✅ Acceso al Curso Completo
          </p>
        </div>
      ) : (
        <div style={{ margin: "10px 20px", textAlign: "center" }}>
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
    </div>
  );
};
