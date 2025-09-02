import { Delete } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ExtraSubscriptionCurrencyEnum } from "../../constants/currencies";
import {
  createSubscriptionPlan,
  getAllProfiles,
} from "../../services/BillingService";
import { getBillingFrequencyCaption } from "../../utils/utils";

export const CreateSubscriptionPlanModal = ({ open, onClose, onCreate }) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(undefined);
  const [name, setName] = useState("");
  const [billingFrequency, setBillingFrequency] = useState(undefined);
  const [includeFreeTrial, setIncludeFreeTrial] = useState(undefined);
  const [extraCurrencies, setExtraCurrencies] = useState([]);
  const [totalCycles, setTotalCycles] = useState(undefined);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");

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
    if (open) {
      fetchProfiles();
    }
  }, [open]);

  const handleCreatePlan = async () => {
    setLoading(true);
    try {
      const { data } = await createSubscriptionPlan(
        name,
        price,
        billingFrequency,
        includeFreeTrial == "SI",
        extraCurrencies,
        totalCycles,
        selectedProfileId || undefined
      );
      toast("Plan creado exitosamente!", {
        type: "success",
      });
      onClose();
      onCreate(data);
    } catch (e) {
      console.log(e);
      toast("No se pudo crear el plan", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeExtraCurrency = (index, att, val) => {
    const newExtraCurrencies = [...extraCurrencies];
    newExtraCurrencies[index][att] = val;
    setExtraCurrencies(newExtraCurrencies);
  };

  const handleRemoveExtraCurrency = (index) => {
    const newExtraCurrencies = [...extraCurrencies];
    newExtraCurrencies.splice(index, 1);
    setExtraCurrencies(newExtraCurrencies);
  };

  const reset = () => {
    setPrice(undefined);
    setName("");
    setBillingFrequency(undefined);
    setIncludeFreeTrial(undefined);
    setExtraCurrencies([]);
    setTotalCycles(undefined);
    setSelectedProfileId("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} keepMounted={false}>
      <div className="nsm-container" onClick={handleClose}>
        <div
          className="user-progress-modal-container"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: 450, overflowY: "auto", maxHeight: "90vh" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <div>
              <p className="poppins-bold" style={{ fontSize: "1rem" }}>
                Crear Plan de Suscripción
              </p>
            </div>
          </div>
          {loading ? (
            <CircularProgress size={"30px"} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ margin: "10px 10px 0 10px", flex: 1 }}>
                <TextField
                  variant="outlined"
                  label="Nombre del Plan"
                  fullWidth
                  value={name}
                  onChange={({ target: { value } }) => setName(value)}
                  sx={{
                    fontSize: "10px",
                    marginBottom: "10px",
                  }}
                  inputProps={{
                    fontSize: "10px",
                  }}
                />
              </div>
              <div style={{ margin: "10px 10px 0 10px" }}>
                <FormControl fullWidth>
                  <InputLabel>Frecuencia</InputLabel>
                  <Select
                    value={billingFrequency}
                    label="Frecuencia"
                    onChange={(e) => {
                      setBillingFrequency(e.target.value);
                      e.stopPropagation();
                    }}
                  >
                    <MenuItem value={"WEEK"}>
                      {getBillingFrequencyCaption("WEEK")}
                    </MenuItem>
                    <MenuItem value={"MONTH"}>
                      {getBillingFrequencyCaption("MONTH")}
                    </MenuItem>
                    <MenuItem value={"YEAR"}>
                      {getBillingFrequencyCaption("YEAR")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ margin: "10px 10px 0 10px", flex: 1 }}>
                <TextField
                  variant="outlined"
                  label="Precio en USD"
                  type="number"
                  fullWidth
                  value={price}
                  onChange={({ target: { value } }) => setPrice(Number(value))}
                  sx={{
                    fontSize: "10px",
                    marginBottom: "10px",
                  }}
                  inputProps={{
                    fontSize: "10px",
                  }}
                />
              </div>
              <div style={{ margin: "10px 10px 0 10px", flex: 1 }}>
                <TextField
                  variant="outlined"
                  label="Total de Ciclos (opcional)"
                  type="number"
                  fullWidth
                  value={totalCycles}
                  onChange={({ target: { value } }) =>
                    setTotalCycles(value !== "" ? Number(value) : undefined)
                  }
                  sx={{
                    fontSize: "10px",
                    marginBottom: "10px",
                  }}
                  inputProps={{
                    fontSize: "10px",
                    min: 1,
                  }}
                  helperText="Dejar vacío para suscripción sin límite de ciclos"
                />
              </div>
              <div style={{ margin: "0 10px", flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Incluir Free Trial</InputLabel>
                  <Select
                    value={includeFreeTrial}
                    label="Incluir Free Trial"
                    onChange={(e) => {
                      setIncludeFreeTrial(e.target.value);
                      e.stopPropagation();
                    }}
                  >
                    <MenuItem value={"SI"}>SI</MenuItem>
                    <MenuItem value={"NO"}>NO</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ margin: "10px 10px 0 10px" }}>
                <FormControl fullWidth>
                  <InputLabel>Perfil (opcional)</InputLabel>
                  <Select
                    value={selectedProfileId}
                    label="Perfil (opcional)"
                    onChange={(e) => {
                      setSelectedProfileId(e.target.value);
                      e.stopPropagation();
                    }}
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
              {extraCurrencies.map((extraCurrency, index) => (
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
                        {Object.values(ExtraSubscriptionCurrencyEnum).map(
                          (currency) => {
                            if (
                              extraCurrencies.some(
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
                          }
                        )}
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
                  <IconButton
                    onClick={() => {
                      handleRemoveExtraCurrency(index);
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </div>
              ))}
              <div style={{ margin: "10px" }}>
                <Button
                  variant="contained"
                  onClick={() =>
                    setExtraCurrencies([
                      ...extraCurrencies,
                      { currency: "", amount: 0 },
                    ])
                  }
                >
                  Agregar moneda
                </Button>
              </div>
              <div style={{ margin: "10px" }}>
                <Button
                  onClick={handleCreatePlan}
                  variant="contained"
                  color="success"
                  disabled={
                    !billingFrequency ||
                    !price ||
                    includeFreeTrial === undefined ||
                    (extraCurrencies.length > 0 &&
                      extraCurrencies.some(
                        (c) => c.currency === "" || c.amount <= 0
                      )) ||
                    (totalCycles !== undefined && totalCycles <= 0)
                  }
                  fullWidth
                >
                  CREAR PLAN
                </Button>
              </div>
              <Button onClick={handleClose} fullWidth>
                CERRAR
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
