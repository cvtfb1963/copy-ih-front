import { Delete } from "@mui/icons-material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import {
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import copy from "copy-to-clipboard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ExtraSubscriptionCurrencyEnum } from "../../constants/currencies";
import {
  deletePlan,
  getAllProfiles,
  publishSubscriptionPlan,
  unpublishSubscriptionPlan,
  updatePlan,
  updatePlanProfile,
} from "../../services/BillingService";
import { formatNumber, getFireInTheHoleLink } from "../../utils/utils";
import { ConfirmDialogModal } from "../ConfirmDialogModal/ConfirmDialogModal";
import "./planCard.css";

//user props: name email subscriptionID subscriptionActive suspended _id
export const PlanCard = ({ plan: planReceived, onUpdate }) => {
  const [plan, setPlan] = useState(planReceived);
  const [updating, setUpdating] = useState(false);
  const [newPrice, setNewPrice] = useState(planReceived.price);
  const [newName, setNewName] = useState(planReceived.name || "");
  const [newAdditionalCurrencies, setNewAdditionalCurrencies] = useState(
    planReceived.additional_currencies
  );
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(
    planReceived.profile?._id || ""
  );

  useEffect(() => {
    setPlan(planReceived);
    setSelectedProfileId(planReceived.profile?._id || "");
  }, [planReceived]);

  useEffect(() => {
    // Fetch profiles for the dropdown
    const fetchProfiles = async () => {
      try {
        const { data } = await getAllProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const [loading, setLoading] = useState();

  const [changePublishStateModalOpen, setChangePublishStateModalOpen] =
    useState(false);
  const [updatePlanModalOpen, setUpdatePlanModalOpen] = useState(false);
  const [deletePlanModalOpen, setDeletePlanModalOpen] = useState(false);

  const handleChangePublishState = async () => {
    setLoading(true);
    try {
      if (plan.published) await unpublishSubscriptionPlan(plan.id ?? plan._id);
      else await publishSubscriptionPlan(plan.id ?? plan._id);

      const updatedPayload = {
        ...plan,
        published: !plan.published,
      };
      onUpdate(updatedPayload);
      setPlan(updatedPayload);

      toast("Se actualizó el estado del plan", {
        type: "success",
      });
      setChangePublishStateModalOpen(false);
    } catch (e) {
      console.log(e);
      toast("No se pudo actualizar. Intente nuevamente.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async () => {
    setLoading(true);
    try {
      const {
        data: { subscriptionsUpdatedCount },
      } = await updatePlan(
        plan.id ?? plan._id,
        newPrice,
        newAdditionalCurrencies,
        newName
      );

      const updatedPayload = {
        ...plan,
        price: newPrice,
        name: newName,
        additional_currencies: newAdditionalCurrencies,
      };
      onUpdate(updatedPayload);
      setPlan(updatedPayload);

      toast(
        `Se actualizó el plan de suscripción y ${subscriptionsUpdatedCount} suscripciones activas.`,
        {
          type: "success",
        }
      );

      setUpdating(false);
      setUpdatePlanModalOpen(false);
    } catch (e) {
      console.log(e);
      toast("Ocurrió un error. Intente nuevamente.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    setLoading(true);
    try {
      await deletePlan(plan.id ?? plan._id);
      toast("Plan eliminado correctamente", {
        type: "success",
      });
      // Notify parent component to remove this plan from the list
      onUpdate({ ...plan, deleted: true });
      setDeletePlanModalOpen(false);
    } catch (e) {
      console.log(e);
      const errorMessage =
        e.response?.data?.message ||
        "Ocurrió un error al eliminar el plan. Intente nuevamente.";
      toast(errorMessage, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeExtraCurrency = (index, att, val) => {
    const newExtraCurrencies = [...newAdditionalCurrencies];
    newExtraCurrencies[index][att] = val;
    setNewAdditionalCurrencies(newExtraCurrencies);
  };

  const handleRemoveExtraCurrency = (index) => {
    const newExtraCurrencies = [...newAdditionalCurrencies];
    newExtraCurrencies.splice(index, 1);
    setNewAdditionalCurrencies(newExtraCurrencies);
  };

  const handleUpdatePlanProfile = async (profileId) => {
    setLoading(true);
    try {
      await updatePlanProfile(plan.id ?? plan._id, profileId);

      // Find the selected profile
      const selectedProfile = profiles.find((p) => p._id === profileId);

      const updatedPlan = {
        ...plan,
        profile: selectedProfile || null,
      };

      setPlan(updatedPlan);
      onUpdate(updatedPlan);

      toast("Perfil del plan actualizado correctamente", { type: "success" });
    } catch (error) {
      console.error(error);
      toast("Error al actualizar el perfil del plan", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div
        className="splan-card"
        style={{
          backgroundColor: "#FFF",
          borderRadius: "10px",
          padding: 0,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            borderRadius: "10px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="splan-card-line">
            <h3
              style={{
                margin: "10px",
                padding: 0,
                flex: 1,
                textAlign: "start",
                lineHeight: 1,
              }}
            >
              #{plan._id}
            </h3>
          </div>
          <p>Nombre</p>
          <h5>{plan.name || "-"}</h5>
          <p>Precio</p>
          <h5>USD ${formatNumber(plan.price)}</h5>
          <p>Moneda</p>
          <h5>{plan.currency}</h5>
          <p>Frecuencia</p>
          <h5>{plan.billing_frequency}</h5>
          <p>Incluye Free Trial</p>
          <h5>{plan.hasFreeTrial ? "Si" : "No"}</h5>
          <p>Publicado</p>
          <h5>{plan.published ? "Sí" : "No"}</h5>
          <p>Monedas Alternativas</p>
          {plan?.additional_currencies?.length > 0 ? (
            <>
              <div style={{ height: 4 }}></div>
              <ul>
                {plan?.additional_currencies?.map(({ currency, amount }) => (
                  <li
                    key={currency}
                    style={{
                      margin: "0 40px",
                      fontSize: "12px",
                      fontWeight: 800,
                      lineHeight: 1.3,
                    }}
                  >
                    {currency} ${formatNumber(amount)}
                  </li>
                ))}
              </ul>
              <div style={{ height: 10 }}></div>
            </>
          ) : (
            <h5>No</h5>
          )}
          <p>Fire In The Hole</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <h6 style={{ fontSize: 10, margin: 10 }}>
              {getFireInTheHoleLink(plan.id ?? plan._id)}
            </h6>
            <IconButton
              onClick={() => {
                copy(getFireInTheHoleLink(plan.id ?? plan._id));
                toast("¡Enlace copiado!");
              }}
              size="small"
            >
              <CopyAllIcon />
            </IconButton>
          </div>
          <p>Ciclos Totales</p>
          <h5>{plan.totalCycles ? plan.totalCycles : "-"}</h5>

          <p>Perfil Asignado</p>
          {plan.profile ? (
            <div style={{ margin: "10px" }}>
              <h6
                style={{
                  margin: "5px 0",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {plan.profile.nombre}
              </h6>
              <h6 style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>
                ID: {plan.profile._id}
              </h6>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginBottom: "8px",
                }}
              >
                <strong style={{ fontSize: "12px" }}>Unidades:</strong>
                {plan.profile.units?.length > 0 ? (
                  plan.profile.units.map((unit) => (
                    <Chip
                      key={unit}
                      label={`U${unit}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      style={{ fontSize: "10px", height: "20px" }}
                    />
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Sin unidades
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                <strong style={{ fontSize: "12px" }}>Habilidades:</strong>
                {plan.profile.skills?.length > 0 ? (
                  plan.profile.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      style={{ fontSize: "10px", height: "20px" }}
                    />
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    Sin habilidades
                  </span>
                )}
              </div>
            </div>
          ) : (
            <h5>Sin perfil asignado</h5>
          )}

          {onUpdate && (
            <div style={{ marginBottom: "10px" }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Cambiar Perfil</InputLabel>
                <Select
                  value={selectedProfileId}
                  label="Cambiar Perfil"
                  onChange={(e) => {
                    setSelectedProfileId(e.target.value);
                    handleUpdatePlanProfile(e.target.value || null);
                  }}
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Sin perfil</em>
                  </MenuItem>
                  {profiles.map((profile) => (
                    <MenuItem key={profile._id} value={profile._id}>
                      {profile.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setChangePublishStateModalOpen(true)}
                      size="small"
                    >
                      {plan.published ? "Despublicar Plan" : "Publicar Plan"}
                    </Button>
                  </div>
                  {updating && (
                    <>
                      <div
                        style={{
                          margin: "10px 20px 0 20px",
                          flexDirection: "row",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexWrap: "nowrap",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                        key={"name"}
                      >
                        <div style={{ padding: "5px", flex: 1 }}>
                          <TextField
                            variant="outlined"
                            label="Nombre"
                            fullWidth
                            size="small"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          margin: "10px 20px 0 20px",
                          flexDirection: "row",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexWrap: "nowrap",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                        key={"usd"}
                      >
                        <div style={{ padding: "5px", flex: 1 }}>
                          <FormControl size="small" fullWidth>
                            <InputLabel>Moneda</InputLabel>
                            <Select
                              value={"USD"}
                              label="Moneda"
                              disabled={true}
                            >
                              <MenuItem key={"USD"} value={"USD"}>
                                USD
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <div style={{ padding: "5px", flex: 1 }}>
                          <TextField
                            variant="outlined"
                            label="Cantidad"
                            fullWidth
                            type="number"
                            size="small"
                            value={newPrice}
                            onChange={(e) =>
                              setNewPrice(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      {newAdditionalCurrencies?.map((extraCurrency, index) => (
                        <div
                          style={{
                            margin: "10px 20px 0 20px",
                            flexDirection: "row",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexWrap: "nowrap",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                          key={index}
                        >
                          <div style={{ padding: "5px", flex: 1 }}>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Moneda</InputLabel>
                              <Select
                                value={extraCurrency.currency}
                                label="Moneda"
                                onChange={(e) =>
                                  handleChangeExtraCurrency(
                                    index,
                                    "currency",
                                    e.target.value
                                  )
                                }
                                disabled={
                                  planReceived?.additional_currencies?.findIndex(
                                    (c) => c.currency == extraCurrency.currency
                                  ) != -1
                                }
                              >
                                {extraCurrency.currency &&
                                  extraCurrency.currency.length > 0 && (
                                    <MenuItem
                                      key={extraCurrency.currency}
                                      value={extraCurrency.currency}
                                    >
                                      {extraCurrency.currency}
                                    </MenuItem>
                                  )}
                                {Object.values(
                                  ExtraSubscriptionCurrencyEnum
                                ).map((currency) => {
                                  if (
                                    newAdditionalCurrencies?.some(
                                      (c) => c.currency === currency
                                    )
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <MenuItem key={currency} value={currency}>
                                      {currency}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                          <div style={{ padding: "5px", flex: 1 }}>
                            <TextField
                              variant="outlined"
                              label="Cantidad"
                              fullWidth
                              type="number"
                              size="small"
                              value={extraCurrency.amount}
                              onChange={(e) =>
                                handleChangeExtraCurrency(
                                  index,
                                  "amount",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          {planReceived?.additional_currencies?.findIndex(
                            (c) => c.currency == extraCurrency.currency
                          ) == -1 && (
                            <IconButton
                              onClick={() => {
                                handleRemoveExtraCurrency(index);
                              }}
                            >
                              <Delete color="error" />
                            </IconButton>
                          )}
                        </div>
                      ))}
                      <div style={{ margin: "10px" }}>
                        <Button
                          variant="contained"
                          onClick={() =>
                            setNewAdditionalCurrencies([
                              ...newAdditionalCurrencies,
                              { currency: "", amount: 0 },
                            ])
                          }
                        >
                          Agregar moneda
                        </Button>
                      </div>
                    </>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 10px 10px 10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color={"secondary"}
                      fullWidth
                      onClick={() =>
                        updating
                          ? setUpdatePlanModalOpen(true)
                          : setUpdating(true)
                      }
                      size="small"
                      disabled={
                        updating &&
                        newAdditionalCurrencies?.some(
                          (c) => c.amount <= 0 || c.currency.length == 0
                        )
                      }
                    >
                      {updating ? "Guardar Cambios" : "Modificar"}
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 10px 10px 10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      onClick={() => setDeletePlanModalOpen(true)}
                      size="small"
                    >
                      Eliminar Plan
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
          message={
            plan.published
              ? "Al despublicar el plan, los alumnos nuevos no podrán suscribirse a este plan, mientras que aquellos que ya estén suscriptos mantendrán su condición"
              : "Al publicar el plan, los alumnos podrán optar por suscribirse al mismo."
          }
          open={changePublishStateModalOpen}
          onClose={() => setChangePublishStateModalOpen(false)}
          onConfirm={() => handleChangePublishState()}
        />

        <ConfirmDialogModal
          loading={loading}
          preventPropagation
          message={
            "¿Desea modificar el precio de este plan? Esto modificará tanto el precio del plan para nuevas suscripciones como el precio de las subscripciones activas. Si no desea modificar el precio de las suscripciones activas, procure crear un nuevo plan en lugar de editar uno existente. ACLARACIÓN: La actualización sobre suscripciones existentes solo tendrá efecto sobre suscripciones de stripe."
          }
          open={updatePlanModalOpen}
          onClose={() => setUpdatePlanModalOpen(false)}
          onConfirm={() => handleUpdatePlan()}
        />

        <ConfirmDialogModal
          loading={loading}
          preventPropagation
          message={
            "¿Está seguro que desea eliminar este plan? Esta acción no se puede deshacer. Si hay usuarios suscritos a este plan, no se podrá eliminar."
          }
          open={deletePlanModalOpen}
          onClose={() => setDeletePlanModalOpen(false)}
          onConfirm={() => handleDeletePlan()}
        />
      </div>
    </LocalizationProvider>
  );
};
