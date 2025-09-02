import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Bounce } from "react-reveal";
import { toast } from "react-toastify";
import { StatisticsShower } from "../../components/StatisticsShower/StatisticsShower";
import {
  getInstitutionUserGlobalStatistics,
  getInstitutionUserUnitStatistics,
  getUserGlobalStatistics,
  getUserUnitStatistics,
} from "../../services/StatisticsService";
import { unidades } from "../HomePage/HomePage";
import "./userProgressModal.css";

export const UserProgressModal = ({
  open,
  onClose,
  userId,
  username,
  inInstitution,
}) => {
  const [datos, setDatos] = useState();
  const [loading, setLoading] = useState(false);
  const [unidadSelected, setUnidadSelected] = useState("global");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } =
        unidadSelected === "global"
          ? inInstitution
            ? await getInstitutionUserGlobalStatistics(userId)
            : await getUserGlobalStatistics(userId)
          : inInstitution
          ? await getInstitutionUserUnitStatistics(
              userId,
              Number(unidadSelected)
            )
          : await getUserUnitStatistics(userId, Number(unidadSelected));
      setDatos(data);
    } catch (e) {
      console.log(e);
      toast(
        "No se pudieron obtener los datos del usuario. Intente nuevamente.",
        {
          type: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && open) fetchData();
    if (!open) setUnidadSelected("global");
  }, [open, unidadSelected]);

  return (
    <Modal open={open} onClose={onClose}>
      <Bounce>
        <div className="nsm-container" onClick={onClose}>
          <div
            className="user-progress-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <div>
                <p
                  className="poppins-regular"
                  style={{ height: 9, fontSize: "0.85rem" }}
                >
                  Estadísticas de
                </p>
                <p className="poppins-bold" style={{ fontSize: "1.50rem" }}>
                  {username}
                </p>
              </div>
            </div>
            {loading ? (
              <CircularProgress size={"30px"} />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "70vh",
                  overflowY: "auto",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    id="demo-simple-select"
                    value={unidadSelected}
                    label="Unidad"
                    onChange={(e) => {
                      setUnidadSelected(e.target.value);
                      e.stopPropagation();
                    }}
                  >
                    <MenuItem value={"global"}>
                      <b>Global</b>
                    </MenuItem>
                    {unidades.map((unidad, i) => (
                      <MenuItem key={`s-u-${i + 1}`} value={i + 1}>
                        <b>Unidad {i + 1}</b>: {unidad.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <StatisticsShower statistics={datos} />
              </div>
            )}
            <Button onClick={onClose}>CERRAR</Button>
          </div>
        </div>
      </Bounce>
    </Modal>
  );
};
