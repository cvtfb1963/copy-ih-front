import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PALETTE } from "../../common/palette";
import { convertAlumno, updateInstitution } from "../../services/UsersService";
import { getAvatarName } from "../../utils/utils";
import "./institutionCard.css";

export const InstitutionCard = ({ user, onUpdate, onRemove }) => {
  const [modulosLoading, setModulosLoading] = useState();
  const [convertAlumnoModal, setConvertAlumnoModal] = useState();
  const [capacicy, setCapacity] = useState(user.institutionCapacity);
  const [licenseDate, setLicenseDate] = useState(
    moment(user.institutionLicenseDate)
  );
  const [saveChangesEndabled, setSaveChangesEnabled] = useState(false);

  const confirmConvertInstitution = async () => {
    setModulosLoading(true);
    try {
      await convertAlumno(user._id);
      onRemove({ ...user });
      toast("La institución se convirtió en un alumno correctamente.", {
        type: "success",
        toastId: "convert-institution",
      });
    } catch (e) {
      if (e?.response?.data?.statusCode === 406)
        return toast(
          "La institución no puede ser convertida en alumno porque aún tiene estudiantes vinculados.",
          {
            type: "error",
            toastId: "convert-institution",
          }
        );
      setConvertAlumnoModal(false);
      console.log(e);
      toast("No se pudo convertir a alumno. Intente nuevamente.", {
        type: "error",
        toastId: "convert-institution",
      });
    } finally {
      setModulosLoading(false);
    }
  };

  const saveChanges = async () => {
    setModulosLoading(true);
    try {
      await updateInstitution(user._id, Number(capacicy), licenseDate);
      onUpdate({
        ...user,
        institutionCapacity: capacicy,
        institutionLicenseDate: licenseDate.toISOString(),
      });
      setModulosLoading(false);
      toast("¡Institución actualizada correctamente!", {
        type: "success",
        toastId: "ins-upd",
      });
      setSaveChangesEnabled(false);
      setModulosLoading(false);
      setConvertAlumnoModal(false);
    } catch (e) {
      console.log(e);
      setModulosLoading(false);
      toast("Ocurrió un error. Intente nuevamente", {
        type: "error",
        toastId: "ins-upd",
      });
    }
  };

  const updateSaveEnabled = () => {
    const canSave =
      Number(capacicy) !== Number(user.institutionCapacity) ||
      licenseDate.toISOString() !==
        moment(user.institutionLicenseDate).toISOString();
    setSaveChangesEnabled(canSave);
  };

  useEffect(() => {
    updateSaveEnabled();
  }, [capacicy, licenseDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="institution-card">
        <div className="institution-card-line">
          <h3 style={{ margin: "10px", flex: 1, textAlign: "start" }}>
            {user.name}
          </h3>
          <Avatar sx={{ bgcolor: PALETTE.quaternaryColor, margin: "10px" }}>
            {getAvatarName(user?.name)}
          </Avatar>
        </div>
        <p>Email</p>
        <h5>{user.email}</h5>
        {onUpdate && (
          <div>
            {typeof modulosLoading === "string" && (
              <p style={{ fontSize: "12px", color: "red", marginLeft: "15px" }}>
                No se pudo actualizar
              </p>
            )}{" "}
            {modulosLoading === true ? (
              <CircularProgress
                color="secondary"
                size="25px"
                sx={{ marginLeft: "15px" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 5,
                }}
              >
                <div style={{ padding: "10px", width: "100%" }}>
                  <TextField
                    variant="outlined"
                    label="Capacidad de alumnos"
                    fullWidth
                    type="number"
                    value={capacicy}
                    onChange={({ target: { value } }) => setCapacity(value)}
                  />
                </div>
                <DatePicker
                  sx={{
                    margin: "5px 10px 10px 10px",
                  }}
                  label="Licencia válida hasta"
                  onChange={(value) => setLicenseDate(value)}
                  value={licenseDate}
                  format="DD/MM/YYYY"
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0 10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!saveChangesEndabled}
                    fullWidth
                    onClick={saveChanges}
                  >
                    GUARDAR CAMBIOS
                  </Button>
                  <IconButton onClick={() => setConvertAlumnoModal(true)}>
                    <SchoolIcon />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        )}

        <Modal
          open={convertAlumnoModal}
          onClose={() => setConvertAlumnoModal(false)}
        >
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography>
                ¿Deseas convertir en alumno a la institución <b>{user.name}</b>?
              </Typography>
              {modulosLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <div style={{ width: "100%" }}>
                    <Button
                      fullWidth
                      onClick={() => setConvertAlumnoModal(false)}
                    >
                      CANCELAR
                    </Button>
                  </div>
                  <div style={{ width: "100%" }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={confirmConvertInstitution}
                      color="success"
                    >
                      CONVERTIR
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Paper>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};
