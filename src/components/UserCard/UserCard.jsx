import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BarChartIcon from "@mui/icons-material/BarChart";
import SaveIcon from "@mui/icons-material/Save";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import Switch from "@mui/material/Switch";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { unidades } from "../../pages/HomePage/HomePage";
import { UserProgressModal } from "../../pages/UserProgressModal/UserProgressModal";
import {
  getAnyUserBillingData,
  stopStudentSubscription,
} from "../../services/BillingService";
import {
  convertInstitution,
  deleteUser,
  updateBUT,
  updateFreeNavigation,
  updateSVU,
  updateSubscriptionID,
  updateSuspendState,
} from "../../services/UsersService";
import { getBillingFrequencyCaption } from "../../utils/utils";
import { ConfirmDialogModal } from "../ConfirmDialogModal/ConfirmDialogModal";
import "./userCard.css";

//user props: name email subscriptionID subscriptionActive suspended _id
export const UserCard = ({ user: userReceived, onUpdate, onRemove }) => {
  const [user, setUser] = useState(userReceived);

  useEffect(() => {
    setUser(userReceived);
    setSubscriptionID(userReceived.subscriptionID);
    setBoughtUpTo(userReceived.boughtUpTo);
    setSubscriptionValidUntil(
      userReceived.subscriptionValidUntil
        ? moment(userReceived.subscriptionValidUntil)
        : null
    );
  }, [userReceived]);

  const [loading, setLoading] = useState();
  const [convertInstitutionModal, setConverInstitutionModal] = useState();

  const [progressModalOpen, setProgressModalOpen] = useState(false);

  const [changeSubsIdModalOpen, setChangeSubsIdModalOpen] = useState(false);
  const [cancelSubsModalOpen, setCancelSubsModalOpen] = useState(false);
  const [suspendModalOpen, setSuspenModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  const [subscriptionID, setSubscriptionID] = useState(user.subscriptionID);
  const [saveSIDEnabled, setSaveSIDEnabled] = useState(false);

  const [boughtUpTo, setBoughtUpTo] = useState(user.boughtUpTo);
  const [saveBUTEnabled, setSaveBUTEnabled] = useState(false);

  const [subscriptionValidUntil, setSubscriptionValidUntil] = useState(
    user.subscriptionValidUntil ? moment(user.subscriptionValidUntil) : null
  );
  const [saveSVUEnabled, setSaveSVUEnabled] = useState(false);

  const [userBillingPlanData, setUserBillingPlanData] = useState(undefined);

  useEffect(() => {
    setSaveSIDEnabled(String(subscriptionID) !== String(user.subscriptionID));
    setSaveBUTEnabled(String(boughtUpTo) !== String(user.boughtUpTo));
    setSaveSVUEnabled(
      moment(subscriptionValidUntil).toISOString() !==
        moment(user.subscriptionValidUntil).toISOString()
    );
  }, [subscriptionID, subscriptionValidUntil, boughtUpTo, loading]);

  const fetchUserPlanData = async () => {
    try {
      setLoading(true);
      const { data } = await getAnyUserBillingData(user._id);
      setUserBillingPlanData(data);
    } catch (e) {
      toast(`No se pudieron obtener los datos del plan del usuario.`, {
        type: "error",
      });
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userBillingPlanData && user._id) fetchUserPlanData();
  }, []);

  const confirmConvertInstitution = async () => {
    setLoading(true);
    try {
      await convertInstitution(user._id);
      onRemove({ ...user });
      setLoading(false);
      toast("El usuario se convirtió en una institución correctamente.", {
        type: "success",
      });
      setConverInstitutionModal(false);
    } catch (e) {
      console.log(e);
      toast("No se pudo convertir a institución. Intente nuevamente.", {
        type: "error",
      });
      setLoading(false);
    }
  };

  const confirmChangeSubscriptionID = async () => {
    setLoading(true);
    try {
      const { data } = await updateSubscriptionID(user._id, subscriptionID);
      const updatedPayload = { ...user, ...data };
      onUpdate(updatedPayload);
      setUser(updatedPayload);
      setLoading(false);
      toast("Se actualizó el ID de la subscripción del alumno.", {
        type: "success",
      });
      setChangeSubsIdModalOpen(false);
    } catch (e) {
      console.log(e);
      toast(
        e?.response?.data?.message ??
          "No se pudo actualizar. Intente nuevamente.",
        {
          type: "error",
        }
      );
      setLoading(false);
    }
  };

  const confirmCancelSubscription = async () => {
    setLoading(true);
    try {
      const { data } = await stopStudentSubscription(user._id);
      const updatedPayload = { ...user, ...data };
      onUpdate(updatedPayload);
      setUser(updatedPayload);
      setSubscriptionID(null);
      setLoading(false);
      toast("Se canceló la subscripción del alumno.", {
        type: "success",
      });
      setCancelSubsModalOpen(false);
    } catch (e) {
      console.log(e);
      toast(
        e?.response?.data?.message ??
          "No se pudo cancelar. Intente nuevamente.",
        {
          type: "error",
        }
      );
      setLoading(false);
    }
  };

  const handleSuspendStateChange = async () => {
    setLoading(true);
    try {
      await updateSuspendState(user._id, !user.suspended);
      toast(
        user.suspended
          ? "Se canceló la suspensión del alumno."
          : "El alumno ha sido suspendido correctamente.",
        {
          type: "success",
        }
      );
      const updatedPayload = {
        ...user,
        suspended: !user.suspended,
        subscriptionID: null,
        nextBillingTime: null,
        subscriptionValidUntil: null,
      };
      onUpdate(updatedPayload);
      setUser(updatedPayload);
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast("No se pudo actualizar el estado del alumno. Intente nuevamente.", {
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await deleteUser(user._id);
      toast(
        "El alumno ha sido eliminado correctamente.",
        {
          type: "success",
        }
      );
      onRemove({ ...user });
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast("No se pudo eliminar el alumno. Intente nuevamente.", {
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleFreeNavigationChange = async () => {
    setLoading(true);
    try {
      await updateFreeNavigation(user._id, !user?.freeNavigation);
      toast(
        !user?.freeNavigation
          ? "Se habilitó la navegación libre para el alumno."
          : "Se deshabilitó la navegación libre para el alumno.",
        {
          type: "success",
        }
      );
      onUpdate({
        ...user,
        freeNavigation: !user?.freeNavigation,
      });
      setUser({
        ...user,
        freeNavigation: !user?.freeNavigation,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast("No se pudo actualizar. Intente nuevamente.", {
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleSaveChangeSVU = async () => {
    setLoading(true);
    try {
      await updateSVU(user._id, subscriptionValidUntil);
      onUpdate({ ...user, subscriptionValidUntil });
      setUser({ ...user, subscriptionValidUntil });
      toast("Se actualizó la fecha de expiración de subscripción del alumno.", {
        type: "success",
      });
    } catch (e) {
      console.log(e);
      toast("No se pudo actualizar. Intente nuevamente.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBUT = async () => {
    setLoading(true);
    try {
      const max = unidades.length;
      const min = 0;

      if (Number(boughtUpTo) > max || Number(boughtUpTo) < min) {
        return toast(
          `El número de unidades debe ser un valor entre ${min} y ${max}`,
          { type: "error" }
        );
      }

      await updateBUT(user._id, boughtUpTo);
      onUpdate({ ...user, boughtUpTo });
      setUser({ ...user, boughtUpTo });
      toast("Se actualizó la unidad máxima para el alumno.", {
        type: "success",
      });
    } catch (e) {
      console.log(e);
      toast("No se pudo actualizar. Intente nuevamente.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div
        className="own-user-card"
        style={{
          backgroundColor: "#FFF",
          borderRadius: "10px",
          padding: 0,
        }}
      >
        <div
          style={{
            backgroundColor: user.suspended && "rgb(255, 0, 0, 0.5)",
            border:
              user.subscriptionID &&
              user.nextBillingTime &&
              "5px solid #CFB53B",
            borderRadius: "10px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="user-card-line">
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
            {new Date(user.subscriptionValidUntil).getTime() > Date.now() && (
              <WorkspacePremiumIcon
                style={{ color: "#CFB53B" }}
                fontSize="large"
              />
            )}
          </div>
          <p>Email</p>
          <h5>{user.email}</h5>
          {onUpdate && (
            <div>
              {loading ? (
                <CircularProgress
                  color="secondary"
                  size="25px"
                  sx={{ marginLeft: "15px" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ paddingLeft: "10px", flex: 1 }}>
                      <DatePicker
                        sx={{
                          marginBottom: "10px",
                          fontSize: "10px",
                        }}
                        label="Acceso premium hasta"
                        onChange={(value) => setSubscriptionValidUntil(value)}
                        value={subscriptionValidUntil}
                        format="DD/MM/YYYY"
                        minDate={moment(user.nextBillingTime)}
                        inputProps={{
                          fontSize: "10px",
                        }}
                        size="small"
                      />
                    </div>
                    <IconButton
                      disabled={!saveSVUEnabled}
                      size="small"
                      sx={{ pr: 1 }}
                      onClick={handleSaveChangeSVU}
                    >
                      <SaveIcon
                        color={saveSVUEnabled ? "success" : "disabled"}
                      />
                    </IconButton>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ paddingLeft: "10px", flex: 1 }}>
                      <TextField
                        variant="outlined"
                        label="Máxima unidad"
                        type="number"
                        fullWidth
                        value={boughtUpTo}
                        onChange={({ target: { value } }) =>
                          setBoughtUpTo(value)
                        }
                        sx={{
                          fontSize: "10px",
                          marginBottom: "10px",
                        }}
                        inputProps={{
                          fontSize: "10px",
                        }}
                        size="small"
                      />
                    </div>
                    <IconButton
                      disabled={!saveBUTEnabled}
                      size="small"
                      sx={{ pr: 1 }}
                      onClick={handleSaveBUT}
                    >
                      <SaveIcon
                        color={saveBUTEnabled ? "success" : "disabled"}
                      />
                    </IconButton>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ paddingLeft: "10px", flex: 1 }}>
                      <TextField
                        variant="outlined"
                        label="Subscription ID"
                        fullWidth
                        value={subscriptionID}
                        onChange={({ target: { value } }) =>
                          setSubscriptionID(value)
                        }
                        sx={{
                          fontSize: "10px",
                        }}
                        inputProps={{
                          fontSize: "10px",
                        }}
                        size="small"
                      />
                    </div>
                    <IconButton
                      disabled={!saveSIDEnabled}
                      size="small"
                      sx={{ pr: 1 }}
                      onClick={() => setChangeSubsIdModalOpen(true)}
                    >
                      <SaveIcon
                        color={saveSIDEnabled ? "success" : "disabled"}
                      />
                    </IconButton>
                  </div>
                  {userBillingPlanData &&
                    user.planID &&
                    user.subscriptionID && (
                      <p
                        style={{
                          marginTop: 10,
                          marginLeft: 10,
                          lineHeight: 1.05,
                        }}
                      >
                        Plan <b>{userBillingPlanData.planID}</b> (Paga{" "}
                        <span className="poppins-medium">
                          {userBillingPlanData?.currency}
                        </span>{" "}
                        <span className="poppins-semibold">
                          ${userBillingPlanData?.price}{" "}
                        </span>
                        {getBillingFrequencyCaption(
                          userBillingPlanData?.billing_frequency
                        )}
                        ).
                      </p>
                    )}
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <p
                      className="poppins-medium"
                      style={{ paddingLeft: "10px", flex: 1 }}
                    >
                      Navegación libre
                    </p>
                    <Switch
                      value={user?.freeNavigation}
                      checked={user?.freeNavigation}
                      onChange={handleFreeNavigationChange}
                    />
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

                  {!user?.subscriptionID && (
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
                        onClick={() => setConverInstitutionModal(true)}
                        startIcon={<AccountBalanceIcon />}
                        size="small"
                        sx={{
                          fontSize: "11px",
                        }}
                        color="secondary"
                      >
                        CONVERTIR EN INSTITUCION
                      </Button>
                    </div>
                  )}

                  {user.subscriptionID && (
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
                        color={user?.suspended ? "success" : "error"}
                        fullWidth
                        onClick={() => setCancelSubsModalOpen(true)}
                        size="small"
                        sx={{
                          fontSize: "11px",
                        }}
                      >
                        Cancelar Subscripción
                      </Button>
                    </div>
                  )}

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
                      color={user?.suspended ? "success" : "error"}
                      fullWidth
                      onClick={() =>
                        user.suspended
                          ? handleSuspendStateChange()
                          : setSuspenModalOpen(true)
                      }
                      size="small"
                      sx={{
                        fontSize: "11px",
                      }}
                    >
                      {user?.suspended ? "CANCELAR SUSPENSIÓN" : "SUSPENDER"}
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
                      onClick={() => setDeleteUserModalOpen(true)}
                      size="small"
                      sx={{
                        fontSize: "11px",
                      }}
                    >
                      ELIMINAR USUARIO
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ConfirmDialogModal
          loading={loading}
          preventPropagation
          message={`¿Deseas actualizar el ID de subscripción del alumno ${user.name}?`}
          open={changeSubsIdModalOpen}
          onClose={() => setChangeSubsIdModalOpen(false)}
          onConfirm={() => confirmChangeSubscriptionID()}
        />

        <ConfirmDialogModal
          loading={loading}
          preventPropagation
          message={`¿Deseas cancelar la subscripción del alumno ${user.name}? Esto significa que no se le cobrará más en su método de pago y perderá acceso premium cuando el plazo pagado finalize.`}
          open={cancelSubsModalOpen}
          onClose={() => setCancelSubsModalOpen(false)}
          onConfirm={() => confirmCancelSubscription()}
        />

        <ConfirmDialogModal
          loading={loading}
          preventPropagation
          message={`¿Deseas convertir en institución al alumno ${user.name}?`}
          open={convertInstitutionModal}
          onClose={() => setConverInstitutionModal(false)}
          onConfirm={() => confirmConvertInstitution()}
        />

        <ConfirmDialogModal
          loading={loading}
          preventPropagation
          message={`¿Deseas suspender al alumno ${user.name}? Al suspenderlo, daremos de baja la subscripción del alumno y perderá acceso a la plataforma hasta que canceles su suspensión.`}
          open={suspendModalOpen}
          onClose={() => setSuspenModalOpen(false)}
          onConfirm={() => handleSuspendStateChange()}
        />

        <ConfirmDialogModal

          loading={loading}
          preventPropagation
          message={`¿Deseas eliminar al alumno ${user.name}?`}
          open={deleteUserModalOpen}
          onClose={() => setDeleteUserModalOpen(false)}
          onConfirm={() => handleDeleteUser()}
        />

        <UserProgressModal
          open={progressModalOpen}
          onClose={() => setProgressModalOpen(false)}
          userId={user._id}
          username={user.name}
        />
      </div>
    </LocalizationProvider>
  );
};
