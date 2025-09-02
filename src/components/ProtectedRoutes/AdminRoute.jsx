import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../Navbar/NavBar";

export const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.datos);

  const checkPermissions = () => {
    if (!user?.isInstitution && !user?.isAdmin) return navigate("/");
    if (!user?.isAdmin) return navigate("/own-home");
    setLoading(false);
  };

  useEffect(() => {
    if (user) checkPermissions();
  }, [user]);

  return (
    <div className="admin-content">
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
