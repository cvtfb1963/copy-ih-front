import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../Navbar/NavBar";

export const InstitutionRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.datos);

  const checkPermissions = () => {
    if (!user?.isInstitution && !user?.isAdmin) return navigate("/");
    if (user?.isAdmin) return navigate("/users");
    setLoading(false);
  };

  useEffect(() => {
    if (user) checkPermissions();
  }, [user]);

  return (
    <div className="institution-content">
      <NavBar />
      <div className="main-content-area">
        {loading ? (
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
          <div className="content">{children}</div>
        )}
      </div>
    </div>
  );
};
