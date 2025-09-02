import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "beautiful-react-diagrams/styles.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { AdminRoute } from "./components/ProtectedRoutes/AdminRoute";
import { AnyRoleRoute } from "./components/ProtectedRoutes/AnyRoleRoute";
import { InstitutionRoute } from "./components/ProtectedRoutes/InstitutionRoute";
import { ProtectedRoute } from "./components/ProtectedRoutes/ProtectedRoute";
import { BillingPage } from "./pages/BillingPage/BillingPage";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import { EjerciciosPage } from "./pages/EjerciciosPage/EjerciciosPage";
import { GetHomePage } from "./pages/GetHomePage/GetHomePage";
import { InstitutionHomePage } from "./pages/InstitutionHomePage/InstitutionHomePage";
import { InstitutionPage } from "./pages/InstitutionPage/InstitutionPage";
import { InstitutionUsers } from "./pages/InstitutionUsers/InstitutionUsers";
import { MyProgressPage } from "./pages/MyProgressPage/MyProgressPage";
import { PrivacyPoliciePage } from "./pages/PrivacyPoliciePage/PrivacyPoliciePage";
import { StatisticsPage } from "./pages/StatisticsPage/StatisticsPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage/TermsOfServicePage";
import { TestPage } from "./pages/TestPage/TestPage";
import { UnidadPage } from "./pages/UnidadPage/UnidadPage";
import { UsersPage } from "./pages/UsersPage/UsersPage";
import { getAxiosInstance } from "./services/AxiosService";
import { getUser } from "./services/UsersService";
import { setToken, setUser } from "./store/datosSlice";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { FireInTheHolePage } from "./pages/FireInTheHolePage/FireInTheHolePage";
import { FundadorPage } from "./pages/FundadorPage/FundadorPage";
import { LibraryPage } from "./pages/LibraryPage/LibraryPage";
import { PaymentPage } from "./pages/PaymentPage/PaymentPage";
import { SubscriptionsPage } from "./pages/SubscriptionsPage/SubscriptionsPage";
import { VocabularyPage } from "./pages/VocabularyPage/VocabularyPage";

const firebaseConfig = {
  apiKey: "AIzaSyDdMffrQqMPR843R7iP2Y7hOUwMKjfNZsM",
  authDomain: "iph-ingles.firebaseapp.com",
  projectId: "iph-ingles",
  storageBucket: "iph-ingles.appspot.com",
  messagingSenderId: "703902260699",
  appId: "1:703902260699:web:cf5ddf74357042cf1c5bfe",
  measurementId: "G-TQFSRJ1H8N",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);

export const replaceSymbols = () => {
  replaceAmpersandsRecursive(document.body);
  replaceDelsRecursive(document.body);
  replaceSubsRecursive(document.body);
  replaceUnderlinesRecursive(document.body);
  replaceColorRojo(document.body);
  replaceColorVerde(document.body);
  replaceColorAzul(document.body);
  replaceColorGris(document.body);
  replaceColorAmarillo(document.body);
  replaceColorRosa(document.body);
  replaceColorVioleta(document.body);
  replaceColorMarron(document.body);
  replaceCursiva(document.body);
};

const replaceAmpersandsRecursive = (node) =>
  replaceRecursiveNodes(node, "&", "b");

const replaceDelsRecursive = (node) => replaceRecursiveNodes(node, "~", "del");

const replaceSubsRecursive = (node) =>
  replaceRecursiveNodes(node, "_sub_", "sub");

const replaceUnderlinesRecursive = (node) =>
  replaceRecursiveNodes(node, "_u_", "u");

const replaceColorRojo = (node) =>
  replaceRecursiveNodes(node, "color::rojo", "span", "red");

const replaceColorVerde = (node) =>
  replaceRecursiveNodes(node, "color::verde", "span", "green");

const replaceColorAzul = (node) =>
  replaceRecursiveNodes(node, "color::azul", "span", "blue");

const replaceColorGris = (node) =>
  replaceRecursiveNodes(node, "color::gris", "span", "#AAA3A1");

const replaceColorAmarillo = (node) =>
  replaceRecursiveNodes(node, "color::amarillo", "span", "#bdb324");

const replaceColorRosa = (node) =>
  replaceRecursiveNodes(node, "color::rosa", "span", "pink");

const replaceColorVioleta = (node) =>
  replaceRecursiveNodes(node, "color::violeta", "span", "purple");

const replaceColorMarron = (node) =>
  replaceRecursiveNodes(node, "color::marron", "span", "brown");

const replaceCursiva = (node) =>
  replaceRecursiveNodes(node, "letra::cursiva", "span", "cursiva");

const replaceRecursiveNodes = (node, key, html, color) => {
  if (
    node.nodeType === Node.TEXT_NODE &&
    node.nodeValue &&
    node.nodeValue.includes(key)
  ) {
    const parts = node.nodeValue.split(key);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < parts.length; i++) {
      if (i < parts.length - 1 && i % 2 !== 0) {
        const htmlElement = document.createElement(html);

        if (color && color !== "cursiva") htmlElement.style.color = color;
        if (color === "cursiva")
          htmlElement.style.fontFamily = `"Cedarville Cursive", cursive`;

        htmlElement.appendChild(document.createTextNode(parts[i]));
        fragment.appendChild(htmlElement);
      } else {
        fragment.appendChild(document.createTextNode(parts[i]));
      }
    }

    node.parentNode.replaceChild(fragment, node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const children = Array.from(node.childNodes);
    children.forEach((child) => replaceRecursiveNodes(child, key, html, color));
  }
};

const NOT_LOGIN_REQUIRED_ROUTES = [
  "privacy-policie",
  "terms-of-service",
  "fith",
  "founder",
];

const MANDATORY_FREE_ROUTES = ["login"];

const shouldGetToken = !NOT_LOGIN_REQUIRED_ROUTES.some((path) =>
  window.location.pathname.includes(path)
);

function App() {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    logout: auth0logout,
    user: auth0User,
    error,
    loginWithRedirect,
  } = useAuth0();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const pushToken = async () => {
    if (error) {
      localStorage.setItem("AUTH_ERROR", true);
      return (window.location.href = "/");
    }

    if (
      isAuthenticated &&
      MANDATORY_FREE_ROUTES.some((path) =>
        window.location.pathname.includes(path)
      )
    )
      return (window.location.href = "/");
    else if (!isAuthenticated) return;

    const accessToken = await getAccessTokenSilently();

    getAxiosInstance().interceptors.response.use(
      (config) => {
        const value = config.data.Audio;
        if (value) config.data.audio = value;
        return config;
      },
      (error) => {
        const { statusCode, message } = error.response.data;
        const { method, url } = error.config;
        console.log(error.response.data);

        if (statusCode === 409) {
          localStorage.setItem(
            message === "SUSPENDED" ? "SUSPENDED" : "SESSION_IN_USE",
            true
          );
          auth0logout();
          return;
        } else if (
          statusCode === 403 &&
          method === "get" &&
          url.includes("/exercises/")
        ) {
          toast(message, { type: "error", toastId: "forbidden-exercise" });
        } else if (statusCode === 401) {
          localStorage.setItem("SESSION_EXPIRED", true);
          auth0logout();
        }

        return Promise.reject(error);
      }
    );

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
  };

  const showMessages = () => {
    const SESSION_IN_USE = localStorage.getItem("SESSION_IN_USE");
    const SUSPENDED = localStorage.getItem("SUSPENDED");
    const AUTH_ERROR = localStorage.getItem("AUTH_ERROR");
    const SESSION_EXPIRED = localStorage.getItem("SESSION_EXPIRED");
    const EXTRA_UNITS_REQUESTED = localStorage.getItem("EXTRA_UNITS_REQUESTED");
    const SUBSCRIPTION_CANCELLED = localStorage.getItem(
      "SUBSCRIPTION_CANCELLED"
    );

    if (SESSION_IN_USE)
      toast("Se cerró tu sesión porque iniciaste sesión en otro dispositivo.", {
        type: "error",
        toastId: "SESSION_IN_USE",
      });
    if (SUSPENDED)
      toast("Se cerró tu sesión porque hemos suspendido tu cuenta", {
        type: "error",
        toastId: "SUSPENDED",
      });
    if (AUTH_ERROR)
      toast("Ocurrió un error en la autenticación. Intente nuevamente.", {
        type: "error",
        toastId: "AUTH_ERROR",
      });
    if (SESSION_EXPIRED)
      toast("Su sesión expiró. Por seguridad, vuelve a iniciar sesión.", {
        type: "error",
        toastId: "SESSION_EXPIRED",
      });
    if (EXTRA_UNITS_REQUESTED)
      toast("¡Felicitades, recibiste unidades de premio!", {
        type: "success",
        toastId: "EXTRA_UNITS_REQUESTED",
      });
    if (SUBSCRIPTION_CANCELLED)
      toast("Cancelaste tu subscripción correctamente.", {
        type: "success",
        toastId: "SESSION_EXPIRED",
      });

    localStorage.removeItem("SESSION_IN_USE");
    localStorage.removeItem("SUSPENDED");
    localStorage.removeItem("AUTH_ERROR");
    localStorage.removeItem("SESSION_EXPIRED");
    localStorage.removeItem("SUBSCRIPTION_CANCELLED");
    localStorage.removeItem("EXTRA_UNITS_REQUESTED");
  };

  useEffect(() => {
    async function initialize() {
      const FROM_FITH = localStorage.getItem("FROM_FITH");
      if (FROM_FITH) {
        localStorage.removeItem("FROM_FITH");
        return (window.location.pathname = `/fith/${FROM_FITH}`);
      }
      setLoading(true);

      if (!isLoading && shouldGetToken) {
        await pushToken();

        const inscriptoA = localStorage.getItem("successfully_inscription");
        if (inscriptoA) {
          toast(
            `Inscripción exitosa. Ahora perteneces a la institución ${inscriptoA}`,
            { type: "success", toastId: "successfully_inscription" }
          );
          localStorage.removeItem("successfully_inscription");
        }
      }

      setLoading(false);
    }
    if (!isLoading && (auth0User || isAuthenticated)) {
      try {
        initialize();
      } catch (e) {
        console.log(e);
        localStorage.setItem("SESSION_EXPIRED", true);
        auth0logout();
      }
    } else if (!isLoading && !isAuthenticated) {
      if (
        !NOT_LOGIN_REQUIRED_ROUTES.some((path) =>
          window.location.pathname.includes(path)
        ) &&
        window.location.pathname !== "/"
      )
        return loginWithRedirect();
      else setLoading(false);
    }

    if (!isLoading) showMessages();
  }, [isLoading, auth0User, isAuthenticated]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {loading || isLoading ? (
          <div
            style={{
              width: "100%",
              minHeight: "50vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="privacy-policie" element={<PrivacyPoliciePage />} />
              <Route path="founder" element={<FundadorPage />} />
              <Route path="terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/fith/:plan_id" element={<FireInTheHolePage />} />
              <Route path="/" element={<GetHomePage />} />
              <Route
                path="/statistics"
                element={
                  <AnyRoleRoute>
                    <StatisticsPage />
                  </AnyRoleRoute>
                }
              />
              <Route
                path="/unidad"
                element={
                  <ProtectedRoute>
                    <UnidadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <BillingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <UsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/institutions"
                element={
                  <AdminRoute>
                    <InstitutionPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/exercises"
                element={
                  <AdminRoute>
                    <EjerciciosPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/test"
                element={
                  <AdminRoute>
                    <TestPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/test-user"
                element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/subscriptions"
                element={
                  <AdminRoute>
                    <SubscriptionsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/own-home"
                element={
                  <InstitutionRoute>
                    <InstitutionHomePage />
                  </InstitutionRoute>
                }
              />
              <Route
                path="/own-users"
                element={
                  <InstitutionRoute>
                    <InstitutionUsers />
                  </InstitutionRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <MyProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vocabulary"
                element={
                  <ProtectedRoute>
                    <VocabularyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:plan_id"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <h1>404 NOT FOUND</h1>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        )}
      </LocalizationProvider>

      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        position="bottom-right"
      />
    </>
  );
}

export default App;
