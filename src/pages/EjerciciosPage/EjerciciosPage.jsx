import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getOneByUnidadSkillNumber,
  postExercise,
  putExercise,
  removeExercise,
} from "../../services/ExercisesService";
import "./ejerciciosPage.css";

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const EjerciciosPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="CARGAR EJERCICIO" {...a11yProps(0)} />
          <Tab label="EDITAR EJERCICIO" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <SaveExerciseView current={value} />
      <UpdateExerciseView current={value} />
    </Box>
  );
};

const SaveExerciseView = ({ current }) => {
  const [exercise, setExercise] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [peso, setPeso] = useState();

  const saveExercise = async () => {
    setError(null);
    if (Number(peso) > 1)
      return toast("El peso no puede ser mayor a 1", { type: "error" });
    if (Number(peso) < 0)
      return toast("El peso no puede ser menor a 0", { type: "error" });
    try {
      setLoading(true);
      await postExercise({ ...JSON.parse(exercise), peso: Number(peso) });
      setExercise();
      toast("El ejercicio se guardó correctamente!", { type: "success" });
    } catch (e) {
      if (e?.response?.data?.message?.includes("already exist"))
        return setError(
          "Ya existe un ejercicio con la misma unidad, skill y number. Utilice la pestaña de edición para modificarlo o eliminarlo."
        );
      console.log(e);
      setError("Ocurrió un error. No se pudo guardar el ejercicio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomTabPanel value={current} index={0}>
      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography>
            Por favor, pruebe el ejercicio en el{" "}
            <Link to={"/test"} target="_blank">
              tester
            </Link>{" "}
            antes de guardarlo.
          </Typography>
          <textarea
            onChange={({ target: { value } }) => setExercise(value)}
            value={exercise}
            style={{
              margin: "20px 20px 0 20px",
              height: "300px",
              fontSize: "20px",
              padding: "5px",
            }}
            placeholder="Insertar ejercicio aquí"
          />
          <TextField
            label="Peso"
            value={peso}
            onChange={({ target: { value } }) => setPeso(value)}
            sx={{ alignSelf: "flex-start", margin: "10px" }}
          />
          {error && <p style={{ margin: "20px", color: "red" }}>{error}</p>}
          <div style={{ margin: "10px 20px 20px 20px" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={saveExercise}
              disabled={!exercise}
            >
              GUARDAR EJERCICIO
            </Button>
          </div>
        </div>
      )}
    </CustomTabPanel>
  );
};

const UpdateExerciseView = ({ current }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const initialSearch = { unidad: "", skill: "", number: "" };
  const [search, setSearch] = useState(initialSearch);
  const [exercise, setExercise] = useState();
  const [showDeleteExercise, setShowDeleteExercise] = useState();
  const [peso, setPeso] = useState();
  const [id, setId] = useState();

  const handleSearch = async () => {
    setLoading(true);
    setExercise();
    setError(null);
    try {
      const { data } = await getOneByUnidadSkillNumber(
        search.unidad,
        search.skill,
        search.number
      );
      const { peso, _id, __v, ...rest } = data;
      setPeso(peso ?? "");
      setId(_id);
      setExercise(JSON.stringify(rest, null, 2));
    } catch (e) {
      if (e?.response?.data?.statusCode === 404)
        return toast("No se encontró el ejercicio.", { type: "error" });
      toast("Ocurrió un error.", { type: "error" });
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const updateExercise = async () => {
    setError(null);
    if (Number(peso) > 1)
      return toast("El peso no puede ser mayor a 1", { type: "error" });
    if (Number(peso) < 0)
      return toast("El peso no puede ser menor a 0", { type: "error" });
    setLoading(true);
    try {
      await putExercise({
        ...JSON.parse(exercise),
        peso: Number(peso),
        _id: id,
      });
      toast("Los cambios se guardaron correctamente!", { type: "success" });
    } catch (e) {
      if (e?.response?.data?.statusCode === 404)
        return setError(
          "El ejercicio que quieres editar no existe. Creelo en la pestaña de carga."
        );
      console.log(e);
      setError("Ocurrió un error. No se pudo guardar el ejercicio.");
    } finally {
      setLoading(false);
    }
  };

  const deleteExercise = async () => {
    setShowDeleteExercise(false);
    setLoading(true);
    try {
      await removeExercise(id);
      setExercise();
      setSearch(initialSearch);
      toast("Se eliminó el ejercicio", { type: "success" });
    } catch (e) {
      toast("Ocurrió un error. No se pudo eliminar el ejercicio", {
        type: "error",
      });
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const divStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px",
  };

  const onChange = ({ target: { value, name } }) =>
    setSearch((old) => ({ ...old, [name]: value }));

  return (
    <CustomTabPanel value={current} index={1}>
      {loading ? (
        <CircularProgress />
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...divStyle,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              padding: "10px",
              height: "fit-content",
            }}
          >
            <TextField
              onChange={onChange}
              name="unidad"
              label="Unidad"
              type="number"
              fullWidth
              value={search?.unidad}
            />
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Skill</InputLabel>
              <Select
                value={search?.skill}
                label="Age"
                name="skill"
                onChange={onChange}
              >
                <MenuItem value={"Grammar"}>Grammar</MenuItem>
                <MenuItem value={"Listening"}>Listening</MenuItem>
                <MenuItem value={"Pronunciation"}>Pronunciation</MenuItem>
                <MenuItem value={"Speaking"}>Speaking</MenuItem>
                <MenuItem value={"Reading"}>Reading</MenuItem>
                <MenuItem value={"Writing"}>Writing</MenuItem>
                <MenuItem value={"Vocabulary"}>Vocabulary</MenuItem>
              </Select>
            </FormControl>
            <TextField
              onChange={onChange}
              name="number"
              label="Número de ejercicio"
              type="number"
              fullWidth
              value={search?.number}
              sx={{ m: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleSearch}
            >
              BUSCAR
            </Button>
          </div>
          <div style={{ ...divStyle, flex: 1 }}>
            <Typography>
              Por favor, pruebe el ejercicio en el{" "}
              <Link to={"/test"} target="_blank">
                tester
              </Link>{" "}
              antes de guardarlo.
            </Typography>
            <textarea
              onChange={({ target: { value } }) => setExercise(value)}
              value={exercise}
              style={{
                margin: "20px 20px 0 20px",
                height: "300px",
                fontSize: "20px",
                padding: "5px",
                width: "100%",
              }}
            />
            <TextField
              label="Peso"
              value={peso}
              onChange={({ target: { value } }) => setPeso(value)}
              sx={{ alignSelf: "flex-start", margin: "10px" }}
            />
            {error && <p style={{ margin: "10px", color: "red" }}>{error}</p>}
            <div style={{ margin: "10px 20px 0 20px", width: "100%" }}>
              <Button
                fullWidth
                onClick={() => setShowDeleteExercise(true)}
                disabled={!exercise}
                color="error"
              >
                ELIMINAR EJERCICIO
              </Button>
            </div>
            <div style={{ margin: "0 20px 20px 20px", width: "100%" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={updateExercise}
                disabled={!exercise}
              >
                GUARDAR CAMBIOS
              </Button>
            </div>
          </div>
        </div>
      )}
      <Modal
        open={showDeleteExercise}
        onClose={() => setShowDeleteExercise(false)}
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
              ¿Deseas eliminar este ejercicio? Esta acción es irreversible.
            </Typography>
            <div style={{ margin: "10px 0" }}>
              <Button fullWidth onClick={() => setShowDeleteExercise(false)}>
                CANCELAR
              </Button>
            </div>
            <div style={{ margin: "0 10px" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={deleteExercise}
                color="error"
              >
                CONFIRMAR ELIMINACIÓN
              </Button>
            </div>
          </div>
        </Paper>
      </Modal>
    </CustomTabPanel>
  );
};
