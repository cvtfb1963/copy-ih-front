import { Button, CircularProgress, Modal, Paper } from "@mui/material";
import moment from "moment-timezone";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getInscriptionCode } from "../../services/UsersService";
import "./institutionHomePage.css";

export const InstitutionHomePage = () => {
  const [loadingCode, setLoadingCode] = useState(false);
  const [openModal, setOpenModal] = useState();

  const { user } = useSelector((state) => state.datos);

  const getSecureCode = async () => {
    try {
      setLoadingCode(true);
      const { data } = await getInscriptionCode();
      setOpenModal(data);
    } catch (e) {
      if (e?.response?.data?.statusCode === 406)
        return toast(
          "La institución alcanzó el máximo de alumnos que su licencia permite.",
          { type: "error" }
        );
      console.log(e);
      toast("No se pudo obtener el código, intente nuevamente.", {
        type: "error",
      });
    } finally {
      setLoadingCode(false);
    }
  };

  return (
    <div className="ins-hp-c">
      <div className="ins-hp-part">
        <p>Iniciaste sesión como institución: </p>
        <h2>{user?.email}</h2>
      </div>
      <div className="ins-hp-part">
        <p>Tu licencia es válida hasta</p>
        <h2>{moment(user?.institutionLicenseDate).format("DD/MM/YYYY")}</h2>
      </div>
      <div className="ins-hp-part">
        <p>Cantidad máxima de alumnos</p>
        <h2>{user?.institutionCapacity}</h2>
      </div>
      <div className="ins-hp-part">
        <p>
          Para agregar un alumno a su institución, cree la cuenta del alumno en
          la <a href={`https://${window.location.origin}`}>plataforma</a> desde
          una ventana de incógnito u otro computador o navegador. Luego, dentro
          de la cuenta del usuario, dirijase a "Facturación" y utilice la opción
          "Inscribirse en institución". Se le solicitará un código seguro de 7
          dígitos.
        </p>
        <p>
          Para obtener el código seguro de 7 dígitos, utilice el boton inferior.
          Este código solo <b>será válido</b> durante 5 minutos.
        </p>
        <div style={{ padding: "10px" }}>
          {loadingCode ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" onClick={getSecureCode}>
              OBTENER CÓDIGO SEGURO DE INSCRIPCIÓN DE ALUMNO
            </Button>
          )}
        </div>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal()}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p style={{ padding: "10px" }}>
              Copia el código y utilizalo antes de que expire (5 minutos). De lo
              contrario, tendrás que generar uno nuevo.
            </p>
            <h4 style={{ alignSelf: "center" }}>{openModal}</h4>
            <div style={{ padding: "10px", width: "100%" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenModal()}
              >
                CERRAR
              </Button>
            </div>
          </div>
        </Paper>
      </Modal>
    </div>
  );
};
