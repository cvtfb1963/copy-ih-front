import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IHLogo from "../../assets/logo/logo-corto.png";
import { getAxiosInstance } from "../../services/AxiosService";
import { getSubscriptionPlanDetailsById } from "../../services/BillingService";
import { getUser } from "../../services/UsersService";
import { setToken, setUser } from "../../store/datosSlice";
import { getBillingFrequencyCaption, getName } from "../../utils/utils";
import "./fireInTheHole.css";

const steps = ["Identificarte", "Suscribirte", "Comenzar a Aprender"];

export const FireInTheHolePage = () => {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    user: authUser,
    error,
    loginWithRedirect,
  } = useAuth0();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.datos);
  const [stepLoading, setStepLoading] = useState();
  const navigate = useNavigate();
  const params = useParams();
  const [planData, setPlanData] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    console.log("authUser: ", authUser);
    console.log("isAuthenticated: ", isAuthenticated);
    console.log("isLoading: ", isLoading);
  }, [authUser, isAuthenticated, isLoading]);

  const pushToken = async () => {
    setLoading(true);

    if (error) {
      localStorage.setItem("AUTH_ERROR", true);
      return (window.location.href = "/");
    }

    const accessToken = await getAccessTokenSilently();

    getAxiosInstance().interceptors.request.use((config) => {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      return config;
    });

    dispatch(setToken(accessToken));

    const { data } = await getUser();

    dispatch(setUser(data));

    setLoading(false);
  };

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

  const init = async () => {
    if (isAuthenticated) {
      await pushToken();
      setActiveStep(1);
      fetchPlan();
    } else {
      setActiveStep(0);
    }
  };

  useEffect(() => {
    init();
  }, [isLoading, isAuthenticated]);

  const fetchPlan = async () => {
    try {
      setStepLoading(true);
      const { data } = await getSubscriptionPlanDetailsById(params?.plan_id);
      setPlanData(data);
    } catch (e) {
      console.log(e);
      toast("Lo sentimos, ocurrió un error.", {
        type: "error",
      });
    } finally {
      setStepLoading(false);
    }
  };

  const handleSubscription = async () => {
    window.location.href = `${window.location.origin}/payment/${params?.plan_id}`;
  };

  const handleIdentification = () => {
    localStorage.setItem("FROM_FITH", params?.plan_id);
    return loginWithRedirect();
  };

  useEffect(() => {
    authorize();
  }, [user]);

  if (isLoading || loading)
    return (
      <div className="fire-loading-container">
        <p className="poppins-regular">Estamos preparando todo para ti...</p>
        <CircularProgress />
      </div>
    );

  return (
    <>
      <div className="fire-main-container">
        <p className="fire-title">
          {user?.name
            ? `¡Hola, ${getName(user?.name)}👋!`
            : `¡Hola 👋, bienvenido!`}
        </p>
        <p className="fire-subtitle">
          Te encuentras a tan solo {activeStep == 0 ? "3" : "2"} minutos de
          comenzar a aprender inglés
        </p>
        <Box className="fire-stepper-container">
          <Stepper
            activeStep={activeStep}
            orientation={isMobile ? "vertical" : "horizontal"}
          >
            {steps.map((label) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
        {stepLoading && (
          <div className="fire-step-loading">
            <CircularProgress />
          </div>
        )}
        {activeStep === 0 && !stepLoading && (
          <div className="fire-step-content">
            <p className="poppins-medium">
              Necesitamos que crees tu cuenta o inicies sesión si ya la has
              creado antes.
            </p>
            <div>
              <Button
                variant="contained"
                className="fire-button"
                onClick={() => handleIdentification()}
              >
                INGRESAR
              </Button>
            </div>
          </div>
        )}
        {activeStep === 1 && !stepLoading && (
          <div className="fire-step-content">
            {stepLoading ? (
              <div className="fire-step-loading">
                <CircularProgress />
              </div>
            ) : (
              <>
                <p className="fire-plan-description">
                  Tenemos para ti un plan especial. Tan solo{" "}
                  <span className="poppins-medium">{planData.currency} </span>
                  <span className="poppins-bold">${planData.price}</span>{" "}
                  <span className="poppins-semibold">
                    {getBillingFrequencyCaption(planData.billing_frequency)}
                  </span>
                  .
                </p>
                {planData.hasFreeTrial && (
                  <p className="fire-plan-feature fire-plan-trial">
                    ¡Este plan incluye 7 días de prueba gratis!
                  </p>
                )}
                {planData.totalCycles && (
                  <p className="fire-plan-feature fire-plan-cycles">
                    Plan limitado a {planData.totalCycles} ciclos de facturación
                  </p>
                )}
                <p className="fire-payment-info">
                  ¡Te redirigemos a nuestra página de pagos para que puedas
                  realizar tu pago de manera segura!
                </p>
                <div>
                  <Button
                    variant="contained"
                    className="fire-button"
                    onClick={handleSubscription}
                  >
                    SIGUIENTE
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <img src={IHLogo} className="fire-logo" alt="IH Inglés" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="fire-wave-svg"
      >
        <path
          fill="#0099ff"
          fillOpacity="0.8"
          d="M0,32L30,48C60,64,120,96,180,96C240,96,300,64,360,48C420,32,480,32,540,58.7C600,85,660,139,720,176C780,213,840,235,900,208C960,181,1020,107,1080,112C1140,117,1200,203,1260,229.3C1320,256,1380,224,1410,208L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>
    </>
  );
};
