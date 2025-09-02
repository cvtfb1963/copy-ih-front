import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import { ProtectedRoute } from "../../components/ProtectedRoutes/ProtectedRoute";
import { HomePage } from "../HomePage/HomePage";
import { LandingPage } from "../LandingPage/LandingPage";

export const GetHomePage = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading)
    return (
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
    );

  return isAuthenticated ? (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  ) : (
    <LandingPage />
  );
};
