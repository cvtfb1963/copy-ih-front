import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ENV } from "../../../env";
import { createSubscriptionStripe } from "../../services/BillingService";
import "./stripe.css";

const stripePromise = loadStripe(ENV.stripe_public_key);

export const StripeFormContainer = (params) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeForm {...params} />
    </Elements>
  );
};

const StripeForm = ({ clientSecret, planData, currencySelected }) => {
  useEffect(() => {
    console.log("clienSecret", clientSecret);
  }, [clientSecret]);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitWithFreeTrial = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      setError("");

      if (!stripe || !elements) {
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        return setError(error.message || "Error en el método de pago");
      }

      await createSubscriptionStripe(
        planData.id,
        paymentMethod.id,
        currencySelected
      );

      window.location.href = "/?billed=true";
    } catch (e) {
      console.log(e);
      toast("Lo sentimos, ocurrió un error.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithPayment = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      setError("");

      if (!stripe || !elements) {
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setError(error.message || "Error en el pago");
      } else if (paymentIntent?.status === "succeeded") {
        window.location.href = "/?billed=true";
      }
    } catch (e) {
      console.log(e);
      toast("Lo sentimos, ocurrió un error.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={
        planData.hasFreeTrial
          ? handleSubmitWithFreeTrial
          : handleSubmitWithPayment
      }
      className="subscription-form"
      style={{ zIndex: 1000 }}
    >
      <div className="card-input">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="submit-button"
      >
        {loading ? "Procesando..." : "Confirmar Suscripción"}
      </button>
    </form>
  );
};
