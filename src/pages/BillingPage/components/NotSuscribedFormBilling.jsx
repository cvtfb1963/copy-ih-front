import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPublishedSubscriptionPlans } from "../../../services/BillingService";
import { formatNumber, getBillingFrequencyCaption } from "../../../utils/utils";

export const NotSuscribedFormBilling = ({
  planSelected,
  setPlanSelected,
  handleSubscription,
}) => {
  const [loading, setLoading] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);
  const { user } = useSelector((state) => state.datos);

  const fetchData = async () => {
    setLoading(true);
    try {
      let { data: availablePlansData } = await getPublishedSubscriptionPlans();

      if (user?.freeTrialUsed)
        availablePlansData = availablePlansData.filter(
          (plan) => !plan.hasFreeTrial
        );

      setAvailablePlans(availablePlansData);
    } catch (e) {
      console.log(e);
      toast("No se pudieron cargar los planes disponibles.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p
        className="poppins-regular"
        style={{
          color: "#4D4D4D",
          fontSize: "1rem",
          margin: "0 20px 20px 20px",
        }}
      >
        No estás subscripto a nuestro servicio, pero puedes empezar a disfrutar
        de los contenidos premium en cualquier momento. ¡Tenemos planes
        diseñados justo para ti!.
      </p>
      <p
        className="poppins-regular"
        style={{
          color: "#4D4D4D",
          fontSize: "0.8rem",
          margin: "0 20px 20px 20px",
        }}
      >
        Al hacer click en {'"'}Quiero Suscribirme{'"'}, te redigiremos a nuetra
        página de pagos para que concretes tu subscripción de manera segura. En
        la página de pagos podrás optar por pagar en tu moneda local si el plan
        lo permite.
      </p>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ margin: 10, display: "flex", flexWrap: "wrap" }}>
            {availablePlans?.map((plan, i) => (
              <div
                key={`s-u-${i + 1}`}
                style={{
                  margin: 5,
                  border: "1px solid #4D4D4D",
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor:
                    planSelected === plan.id ? "#E0E0E0" : "white",
                  cursor: "pointer",
                }}
                onClick={() => setPlanSelected(plan.id)}
              >
                <span className="poppins-semibold">
                  ${formatNumber(plan.price)}{" "}
                </span>
                <b>{plan.currency}</b> /{" "}
                <span className="poppins-regular">
                  {getBillingFrequencyCaption(plan.billing_frequency)}
                  {plan.hasFreeTrial && (
                    <div
                      className="poppins-regular"
                      style={{
                        background: "green",
                        color: "white",
                        borderRadius: "10px",
                        border: "1px solid black",
                        padding: "3px",
                        margin: "auto 5px",
                        fontSize: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      7 DÍAS DE PRUEBA GRATIS
                    </div>
                  )}
                  {plan.totalCycles && (
                    <div
                      className="poppins-regular"
                      style={{
                        background: "blue",
                        color: "white",
                        borderRadius: "10px",
                        border: "1px solid black",
                        padding: "3px",
                        margin: "5px auto",
                        fontSize: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      PLAN DE {plan.totalCycles} CICLOS
                    </div>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div style={{ margin: 10 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubscription}
              disabled={!planSelected}
              sx={{ minWidth: 250 }}
            >
              Quiero suscribirme
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
