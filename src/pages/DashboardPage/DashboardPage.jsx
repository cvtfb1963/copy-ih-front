import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EXERCISE_SKILLS } from "../../constants/ejerciciosData";
import { getPesoTotalPorUnidadYSkill } from "../../services/ExercisesService";
import {
  cancelMaintenanceWindow,
  createMaintenanceWindow,
  getMaintenanceWindow,
} from "../../services/MaintenanceService";
import {
  executeStatisticsJob,
  getStatisticsLastUpdatedTime,
} from "../../services/StatisticsService";
import { getFormatedDateTime } from "../../utils/utils";
import { unidades } from "../HomePage/HomePage";
import "./dashboardPage.css";

export const DashboardPage = () => {
  const [statisticsLastUpdatedTime, setStatisticsLastUpdatedTime] = useState();
  const [maintenanceWindow, setMaintenanceWindow] = useState();
  const [maintenanceWindowDTO, setMaintenanceWindowDTO] = useState();
  const [scheduleMaintenanceEnabled, setScheduleMaintenanceEnabled] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [unidadSelected, setUnidadSelected] = useState(1);
  const [skillSelected, setSkillSelected] = useState(EXERCISE_SKILLS.GRAMMAR);
  const [peso, setPeso] = useState();
  const [loadingPeso, setLoadingPeso] = useState(false);

  useEffect(() => {
    setScheduleMaintenanceEnabled(
      Boolean(
        maintenanceWindowDTO?.start_date && maintenanceWindowDTO?.end_date
      )
    );
  }, [maintenanceWindowDTO]);

  const fetchLastUpdatedData = async () => {
    try {
      setLoading(true);
      const [{ data: statisticsData }, { data: maintenanceData }] =
        await Promise.all([
          getStatisticsLastUpdatedTime(),
          getMaintenanceWindow(),
        ]);

      setStatisticsLastUpdatedTime(statisticsData.lastUpdatedTime);
      setMaintenanceWindow(maintenanceData);
    } catch (e) {
      console.log("error: fetchData", e);
      toast("Ocurrió un error. Intente nuevamente.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getPesoTotal = async () => {
    try {
      setLoadingPeso(true);
      const {
        data: { pesoTotal },
      } = await getPesoTotalPorUnidadYSkill(unidadSelected, skillSelected);
      setPeso(pesoTotal);
    } catch (e) {
      console.log("error: getPesoTotal", e);
      toast("Ocurrió un error. Intente nuevamente.", { type: "error" });
    } finally {
      setLoadingPeso(false);
    }
  };

  const handleExecuteStatisticsJob = async () => {
    try {
      setLoading(true);
      await executeStatisticsJob();
      const {
        data: { lastUpdatedTime },
      } = await getStatisticsLastUpdatedTime();
      setStatisticsLastUpdatedTime(lastUpdatedTime);
      toast("Estadísticas ejecutadas correctamente!", { type: "success" });
    } catch (e) {
      console.log("error: handleExecuteStatisticsJob", e);
      toast(
        e?.response?.data?.message ?? "Ocurrió un error. Intente nuevamente.",
        { type: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOnCancelVentana = async () => {
    try {
      setLoading(true);
      await cancelMaintenanceWindow();
      toast("Ventana borrada correctamente!", { type: "success" });
      setMaintenanceWindow(null);
    } catch (e) {
      console.log("error: handleOnCancelVentana", e);
      toast(
        e?.response?.data?.message ?? "Ocurrió un error. Intente nuevamente.",
        { type: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOnCreateVentana = async () => {
    try {
      setLoading(true);
      moment();
      await createMaintenanceWindow(maintenanceWindowDTO);
      toast("Ventana creada correctamente!", { type: "success" });
      setMaintenanceWindow({
        start_date: maintenanceWindowDTO.start_date.toISOString(),
        end_date: maintenanceWindowDTO.end_date.toISOString(),
      });
      setMaintenanceWindowDTO(null);
    } catch (e) {
      console.log("error: handleOnCreateVentana", e);
      toast(
        e?.response?.data?.message
          ? Array.isArray(e?.response?.data?.message)
            ? e?.response?.data?.message[0]
            : e?.response?.data?.message
          : "Ocurrió un error. Intente nuevamente.",
        { type: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!statisticsLastUpdatedTime) fetchLastUpdatedData();
  }, []);

  return loading ? (
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
    <div className="dashboard-page">
      <div className="dashboard-box">
        <div className="dashboard-last-updated">
          <p className="poppins-bold" style={{ fontSize: "1.5rem" }}>
            Última actualización
          </p>
          <p className="poppins-regular">
            <span className="poppins-semibold">Fecha: </span>
            {moment(statisticsLastUpdatedTime).format("DD/MM/YYYY")}
          </p>
          <p className="poppins-regular">
            <span className="poppins-semibold">Hora: </span>
            {moment(statisticsLastUpdatedTime)
              .get("hours")
              .toString()
              .padStart(2, "0")}
            :
            {moment(statisticsLastUpdatedTime)
              .get("minute")
              .toString()
              .padStart(2, "0")}
          </p>
          <Button
            variant="contained"
            fullWidth
            onClick={handleExecuteStatisticsJob}
          >
            EJECUTAR ESTADÍSTICAS
          </Button>
        </div>
      </div>
      <div className="dashboard-box">
        {loadingPeso ? (
          <CircularProgress />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <FormControl fullWidth>
              <InputLabel>Unidad</InputLabel>
              <Select
                value={unidadSelected}
                label="Unidad"
                onChange={(e) => {
                  setUnidadSelected(e.target.value);
                  e.stopPropagation();
                }}
              >
                {unidades.map((unidad, i) => (
                  <MenuItem key={`s-u-${i + 1}`} value={i + 1}>
                    <b>Unidad {i + 1}</b>: {unidad.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{ height: 15 }}></div>
            <FormControl fullWidth>
              <InputLabel>Skill</InputLabel>
              <Select
                value={skillSelected}
                label="Skill"
                onChange={(e) => {
                  setSkillSelected(e.target.value);
                  e.stopPropagation();
                }}
              >
                {Object.values(EXERCISE_SKILLS).map((skill, i) => (
                  <MenuItem key={`s-i-${i + 1}`} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => getPesoTotal()}
            >
              VER PESO TOTAL
            </Button>
            {(peso || peso === 0) && (
              <>
                <p className="poppins-bold">Peso total:</p>
                <p className="poppins-regular">{peso}</p>
              </>
            )}
          </div>
        )}
      </div>
      <div className="dashboard-box">
        <div className="dashboard-last-updated">
          <p className="poppins-bold" style={{ fontSize: "1.5rem" }}>
            Ventana de mantenimiento
          </p>
          {maintenanceWindow?.end_date &&
          new Date(maintenanceWindow.end_date).getTime() > Date.now() ? (
            <>
              <p className="poppins-regular">
                <span className="poppins-semibold">Desde: </span>
                {getFormatedDateTime(maintenanceWindow.start_date)}
              </p>
              <p className="poppins-regular">
                <span className="poppins-semibold">Hasta: </span>
                {getFormatedDateTime(maintenanceWindow.end_date)}
              </p>

              <Button
                variant="contained"
                fullWidth
                onClick={handleOnCancelVentana}
                color="warning"
              >
                CANCELAR VENTANA
              </Button>
            </>
          ) : (
            <>
              <p className="poppins-regular">No hay una ventana programada.</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="poppins-semibold" style={{ width: 60 }}>
                  Desde:{" "}
                </span>
                <div style={{ margin: "10px 10px 0 10px" }}>
                  <MobileDateTimePicker
                    value={maintenanceWindowDTO?.start_date}
                    onChange={(value) =>
                      setMaintenanceWindowDTO((old) => ({
                        ...old,
                        start_date: value,
                      }))
                    }
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="poppins-semibold" style={{ width: 60 }}>
                  Hasta:{" "}
                </span>
                <div style={{ margin: 10 }}>
                  <MobileDateTimePicker
                    value={maintenanceWindowDTO?.end_date}
                    onChange={(value) =>
                      setMaintenanceWindowDTO((old) => ({
                        ...old,
                        end_date: value,
                      }))
                    }
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
              </div>
              <Button
                variant="contained"
                fullWidth
                onClick={handleOnCreateVentana}
                disabled={!scheduleMaintenanceEnabled}
              >
                PROGRAMAR VENTANA
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
