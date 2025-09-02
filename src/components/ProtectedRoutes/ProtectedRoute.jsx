import { DotLottiePlayer } from "@dotlottie/react-player";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getExercisesPorUnidad } from "../../services/ExercisesService";
import { getMaintenanceWindow } from "../../services/MaintenanceService";
import {
  setBoughtUpTo,
  setPosicionPorUnidad,
  setUnidadesData,
} from "../../store/datosSlice";
import { getFormatedDateTime } from "../../utils/utils";
import NavBar from "../Navbar/NavBar";

export const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [maintenanceWindow, setMaintenanceWindow] = useState();

  const { user, posicionPorUnidad, unidadesData, boughtUpTo } = useSelector(
    (state) => state.datos
  );

  const checkPermissions = () => {
    if (user?.isAdmin) return navigate("/users");
    if (user?.isInstitution) return navigate("/own-home");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: exercisesPorUnidad }, { data: maintenanceWindow }] =
        await Promise.all([getExercisesPorUnidad(), getMaintenanceWindow()]);

      setMaintenanceWindow(maintenanceWindow);

      dispatch(setUnidadesData(exercisesPorUnidad.unidades));
      dispatch(setBoughtUpTo(exercisesPorUnidad.boughtUpTo));
      dispatch(setPosicionPorUnidad(exercisesPorUnidad.position));

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading("error");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (user && (!posicionPorUnidad || !unidadesData || !boughtUpTo)) {
        checkPermissions();
        fetchData();
      } else setLoading(false);
    };
    init();
  }, [user]);

  return (
    <div>
      {maintenanceWindow &&
      new Date(maintenanceWindow.start_date).getTime() <= Date.now() &&
      new Date(maintenanceWindow.end_date).getTime() > Date.now() ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <p
            className="poppins-regular"
            style={{ padding: 20, textAlign: "center", fontSize: "1.3rem" }}
          >
            ¡Estamos implementando actualizaciones para mejorar tu experiencia!
            Podrás volver a utilizar la plataforma luego de la finalización de
            la ventana de mantenimiento.
          </p>
          <p
            className="poppins-semibold"
            style={{ padding: 20, textAlign: "center", fontSize: "1.3rem" }}
          >
            Finaliza el {getFormatedDateTime(maintenanceWindow.end_date)}
          </p>
          <DotLottiePlayer
            src={"animations/maintenance.lottie"}
            autoplay
            loop
            style={{ height: "300px" }}
          />
        </div>
      ) : (
        <>
          <NavBar />
          <div className="main-content-area">
            <div style={{ width: "100%", padding: "0 20px" }}>
              {maintenanceWindow?.start_date &&
                new Date(maintenanceWindow.start_date).getTime() > Date.now() && (
                  <div
                    style={{
                      background: "#ffdedb",
                      border: "1px solid #ff8d82",
                      borderRadius: "10px",
                      padding: "15px",
                    }}
                  >
                    <p>
                      Ventana de mantenimiento programada entre el{" "}
                      {getFormatedDateTime(maintenanceWindow.start_date)} y el{" "}
                      {getFormatedDateTime(maintenanceWindow.end_date)}. Durante
                      la ventana de mantenimiento, no podrás utilizar la
                      plataforma. El objetivo de la ventana de mantenimiendo, ¡Es
                      instalar actualizaciones para mejorar tu experiencia
                      constantemente!
                    </p>
                  </div>
                )}
            </div>
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
              <div>{children}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
