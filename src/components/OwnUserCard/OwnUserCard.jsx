import BarChartIcon from "@mui/icons-material/BarChart";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PALETTE } from "../../common/palette";
import { unidades } from "../../pages/HomePage/HomePage";
import { UserProgressModal } from "../../pages/UserProgressModal/UserProgressModal";
import {
  unlinkFromInstitution,
  updateOwnUserUnidades,
} from "../../services/UsersService";
import { getAvatarName } from "../../utils/utils";
import { ConfirmDialogModal } from "../ConfirmDialogModal/ConfirmDialogModal";
import "./ownUserCard.css";

export const OwnUserCard = ({ user, onRemove, onUpdate }) => {
  const [modulosLoading, setModulosLoading] = useState();
  const [unlinkUserModal, setUnlinkUserModal] = useState();
  const [boughtUpTo, setBoughtUpTo] = useState(user.boughtUpTo);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);

  useEffect(() => {
    setSaveEnabled(Number(boughtUpTo) !== Number(user.boughtUpTo));
  }, [boughtUpTo]);

  const confirmUnlinkUser = async () => {
    setModulosLoading(true);
    try {
      await unlinkFromInstitution(user._id);
      onRemove({ ...user });
      setModulosLoading(false);
      toast("El usuario se desvinculó de la institución correctamente.", {
        type: "success",
        toastId: "unlink-institution",
      });
    } catch (e) {
      console.log(e);
      toast(
        "No se pudo desvincular al alumno de la institución. Intente nuevamente.",
        {
          type: "error",
          toastId: "unlink-institution",
        }
      );
      setModulosLoading(false);
    }
  };

  const handleModulosChange = async () => {
    setModulosLoading(true);
    try {
      const max = unidades.length;
      const min = 0;

      if (Number(boughtUpTo) > max || Number(boughtUpTo) < min) {
        setModulosLoading(false);
        return toast(
          `El número de unidades debe ser un valor entre ${min} y ${max}`,
          { type: "error" }
        );
      }

      await updateOwnUserUnidades(user._id, Number(boughtUpTo));
      onUpdate({ ...user, boughtUpTo: Number(boughtUpTo) });
      setModulosLoading(false);
      setSaveEnabled(false);
      toast("El usuario se actualizó correctamente.", {
        type: "success",
        toastId: "update-own-user",
      });
    } catch (e) {
      console.log(e);
      toast("No se pudo actualizar el alumno. Intente nuevamente.", {
        type: "error",
        toastId: "update-own-user",
      });
      setModulosLoading(false);
    }
  };

  return (
    <div className="own-user-card">
      <div className="own-user-card-line">
        <h3
          style={{
            margin: "10px",
            flex: 1,
            textAlign: "start",
            lineHeight: 1,
            height: "50px",
          }}
        >
          {user.name}
        </h3>
        <Avatar sx={{ bgcolor: PALETTE.quaternaryColor, margin: "10px" }}>
          {getAvatarName(user?.name)}
        </Avatar>
      </div>
      <p>Email</p>
      <h5>{user.email}</h5>
      <div>
        {modulosLoading === true ? (
          <CircularProgress
            color="secondary"
            size="25px"
            sx={{ marginLeft: "15px" }}
          />
        ) : (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{ width: "100%", display: "flex", alignItems: "center" }}
            >
              <div style={{ padding: "10px", flex: 1 }}>
                <TextField
                  variant="outlined"
                  label="Unidades concedidas"
                  fullWidth
                  type="number"
                  value={boughtUpTo}
                  onChange={({ target: { value } }) => setBoughtUpTo(value)}
                />
              </div>
              <IconButton disabled={!saveEnabled} onClick={handleModulosChange}>
                <SaveIcon color={saveEnabled ? "success" : "disabled"} />
              </IconButton>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 10px 0 10px",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => setProgressModalOpen(true)}
                startIcon={<BarChartIcon />}
                size="small"
                sx={{
                  fontSize: "11px",
                }}
              >
                VER ESTADÍSTICAS
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => setUnlinkUserModal(true)}
                size="small"
              >
                DESVINCULAR
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialogModal
        loading={modulosLoading}
        message={`¿Deseas desvincular al almuno ${user.name} de su
          institución?`}
        open={unlinkUserModal}
        onClose={() => setUnlinkUserModal(false)}
        onConfirm={() => confirmUnlinkUser()}
      />

      <UserProgressModal
        open={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        userId={user._id}
        username={user.name}
        inInstitution={true}
      />
    </div>
  );
};
