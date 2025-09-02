import { Auth0Provider } from "@auth0/auth0-react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ENV } from "../env.js";
import App from "./App.jsx";
import "./common/palette.css";
import "./index.css";
import { store } from "./store/store.js";

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <Auth0Provider
      domain={ENV.okta_domain}
      clientId={ENV.okta_clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: ENV.okta_audience,
        scope: ENV.okta_scope,
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      cacheLocation="localstorage"
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  );
} catch (e) {
  window.location.href = "/";
}
