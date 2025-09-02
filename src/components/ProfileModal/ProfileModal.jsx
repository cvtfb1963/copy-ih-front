import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EXERCISE_SKILLS } from "../../constants/ejerciciosData";
import {
  createProfile,
  deleteProfile,
  updateProfile,
} from "../../services/BillingService";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Available skills - you can modify this list based on your needs
const AVAILABLE_SKILLS = Object.values(EXERCISE_SKILLS).map(skill => skill.toLowerCase());

export const ProfileModal = ({ open, onClose, profile, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [units, setUnits] = useState([]);
  const [skills, setSkills] = useState([]);
  const [unitInput, setUnitInput] = useState("");

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || "");
      setUnits(profile.units || []);
      setSkills(profile.skills || []);
    } else {
      setNombre("");
      setUnits([]);
      setSkills([]);
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let result;
      if (profile) {
        // Update existing profile
        result = await updateProfile(profile._id, nombre, units, skills);
      } else {
        // Create new profile
        result = await createProfile(nombre, units, skills);
      }

      toast(
        profile
          ? "Perfil actualizado correctamente"
          : "Perfil creado correctamente",
        { type: "success" }
      );

      onSave(result.data);
      handleClose();
    } catch (error) {
      console.error(error);
      toast("Error al guardar el perfil", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      await deleteProfile(profile._id);
      toast("Perfil eliminado correctamente", { type: "success" });
      onSave({ ...profile, deleted: true });
      handleClose();
    } catch (error) {
      console.error(error);
      toast("Error al eliminar el perfil: " + error?.response?.data?.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombre("");
    setUnits([]);
    setSkills([]);
    setUnitInput("");
    onClose();
  };

  const handleAddUnit = () => {
    const unitNumber = parseInt(unitInput);
    if (unitNumber && !units.includes(unitNumber)) {
      setUnits([...units, unitNumber].sort((a, b) => a - b));
      setUnitInput("");
    }
  };

  const handleRemoveUnit = (unitToRemove) => {
    setUnits(units.filter((unit) => unit !== unitToRemove));
  };

  const handleSkillsChange = (event) => {
    const value = event.target.value;
    setSkills(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {profile ? "Editar Perfil" : "Crear Nuevo Perfil"}
      </DialogTitle>
      <DialogContent>
        <div style={{ marginTop: "16px" }}>
          {/* Name Section */}
          <div style={{ marginBottom: "24px" }}>
            <TextField
              label="Nombre del Perfil"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              fullWidth
              required
              variant="outlined"
              helperText="Nombre descriptivo para identificar el perfil"
            />
          </div>

          {/* Units Section */}
          <div style={{ marginBottom: "24px" }}>
            <h4>Unidades Permitidas</h4>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <TextField
                label="Número de Unidad"
                type="number"
                value={unitInput}
                onChange={(e) => setUnitInput(e.target.value)}
                size="small"
                style={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleAddUnit}
                disabled={!unitInput}
              >
                Agregar
              </Button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {units.map((unit) => (
                <Chip
                  key={unit}
                  label={`Unidad ${unit}`}
                  onDelete={() => handleRemoveUnit(unit)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <FormControl fullWidth>
              <InputLabel>Habilidades Permitidas</InputLabel>
              <Select
                multiple
                value={skills}
                onChange={handleSkillsChange}
                input={<OutlinedInput label="Habilidades Permitidas" />}
                renderValue={(selected) => (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                  >
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {AVAILABLE_SKILLS.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        {profile && (
          <Button
            onClick={handleDelete}
            color="error"
            disabled={loading}
            style={{ marginRight: "auto" }}
          >
            Eliminar
          </Button>
        )}
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !nombre.trim()}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {profile ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
