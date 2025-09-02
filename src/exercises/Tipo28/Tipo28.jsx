import HelpIcon from "@mui/icons-material/Help";
import { Checkbox, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import { ExerciseControl } from "../../components/ExerciseControl/ExerciseControl";
import { FloatingVideo } from "../../components/FloatingVideo/FloatingVideo";
import {
  EXERCISE_SKILLS,
  EXPLANATION_VIDEOS,
} from "../../constants/ejerciciosData";
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer } from "../../utils/exercises.utils";
import "./tipo28.css";

const TIEMPO_ACCIONES = {
  pasado: "Pasada",
  presente: "Presente",
  futuro: "Futura",
};

export const ejemploTipo28 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 28,
  number: 428,
  unidad: 7,
  title: "Hallar tiempo verbal",
  description:
    "Identifica a qué tiempo verbal pertenece la oración respondiendo a las preguntas que has aprendido en esta unidad para encontrar dicha solución",
  explanation: "Esta es la explicación!",
  sentence: "Acaban de llegar del campo a la ciudad",
  answer: "Present simple",
};

export const EjercicioTipo28 = ({ ejercicio }) => {
  const [verified, setVerified] = useState(false);
  const [llevaVerbo, setLlevaVerbo] = useState(null);
  const [llevaGerundio, setLlevaGerundio] = useState(null);
  const [tiempoAccion, setTiempoAccion] = useState(null);
  const [selected, setSelected] = useState();
  const [result, setResult] = useState();

  const dispatch = useDispatch();

  const showExplanation = () =>
    dispatch(
      setCurrent({ explanation: ejercicio.explanation, explanationOpen: true })
    );

  const showAndSaveGrade = (grade) => {
    dispatch(setCurrent({ grade, gradeOpen: true, binaria: true }));
  };

  const handleVerify = () => {
    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const result = checkAnswer(selected, ejercicio.answer, 28);
    localStorage.removeItem("is_vocabulary_exercise");
    setResult(result);
    setVerified(true);
    showAndSaveGrade(result ? 1 : 0);
  };

  const handleReset = () => {
    setLlevaVerbo(null);
    setLlevaGerundio(null);
    setTiempoAccion(null);
    setResult();
    setSelected();
    setVerified(false);
  };

  useEffect(() => {
    setLlevaGerundio(null);
  }, [llevaVerbo]);

  useEffect(() => {
    setTiempoAccion(null);
  }, [llevaGerundio]);

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <div className="et28-container">
          <p className="et28-sentence">
            {`"`}
            {ejercicio.sentence}
            {`"  `}
            {verified && (
              <IconButton onClick={showExplanation}>
                <HelpIcon />
              </IconButton>
            )}
          </p>
          <div className="et28-pregunta">
            <div>
              ¿Lleva el verbo <b>acabar de</b>/<b>haber</b>/<b>llevar</b>?
            </div>
            <SiNoForm
              setValue={setLlevaVerbo}
              value={llevaVerbo}
              verified={verified}
            />
          </div>
          {llevaVerbo !== null && (
            <div className="et28-pregunta">
              <div>¿Lleva gerundio?</div>
              <SiNoForm
                setValue={setLlevaGerundio}
                value={llevaGerundio}
                verified={verified}
              />
            </div>
          )}
          {llevaGerundio !== null && (
            <div className="et28-pregunta">
              <div>
                ¿La acción es <b>pasada</b>, <b>presente</b> o <b>futura</b>?
              </div>
              <form>
                {Object.values(TIEMPO_ACCIONES).map((tiempo) => (
                  <>
                    <Checkbox
                      value={true}
                      checked={tiempoAccion === tiempo}
                      onChange={({ target: { checked } }) =>
                        setTiempoAccion(checked ? tiempo : null)
                      }
                      disabled={verified}
                    />
                    {tiempo}
                  </>
                ))}
              </form>
            </div>
          )}
          <div className="et28-tiempos">
            {llevaVerbo !== true && (
              <>
                {llevaGerundio !== true && (
                  <>
                    {(tiempoAccion === TIEMPO_ACCIONES.pasado ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Past Simple
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.presente ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Present Simple
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.futuro ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Future Simple
                      </TV>
                    )}
                  </>
                )}
                {llevaGerundio !== false && (
                  <>
                    {(tiempoAccion === TIEMPO_ACCIONES.pasado ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Past Continuous
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.presente ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Present Continuous
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.futuro ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Future Continuous
                      </TV>
                    )}
                  </>
                )}
              </>
            )}
            {llevaVerbo !== false && (
              <>
                {llevaGerundio !== true && (
                  <>
                    {(tiempoAccion === TIEMPO_ACCIONES.pasado ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Past Perfect Simple
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.presente ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Present Perfect Simple
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.futuro ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Future Perfect Simple
                      </TV>
                    )}
                  </>
                )}
                {llevaGerundio !== false && (
                  <>
                    {(tiempoAccion === TIEMPO_ACCIONES.pasado ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Past Perfect Continuous
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.presente ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Present Perfect Continuous
                      </TV>
                    )}
                    {(tiempoAccion === TIEMPO_ACCIONES.futuro ||
                      !tiempoAccion) && (
                      <TV
                        c={result}
                        s={selected}
                        ss={setSelected}
                        ve={verified}
                      >
                        Future Perfect Continuous
                      </TV>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <ExerciseControl
          handleReset={handleReset}
          handleVerify={handleVerify}
          verified={verified}
        />
      </div>
    </div>
  );
};

const SiNoForm = ({ value, setValue, verified }) => {
  return (
    <form>
      <Checkbox
        value={true}
        checked={value === true}
        onChange={({ target: { checked } }) => setValue(checked ? true : null)}
        disabled={verified}
      />
      Si
      <Checkbox
        value={true}
        checked={value === false}
        onChange={({ target: { checked } }) => setValue(checked ? false : null)}
        disabled={verified}
      />
      No
    </form>
  );
};

const TV = ({ ve, ss, s, children, c }) => {
  const verified = ve;
  const setSelected = ss;
  const selected = s;
  const value = children;

  let style = {};

  if (selected === value)
    style = {
      border: "green 2px dashed",
      transform: "scale(1.1)",
      backgroundColor: "white",
      color: "var(--quaternary-color)",
    };

  if (selected === value && verified && !c) style.border = "red 2px dashed";

  return (
    <button
      disabled={verified}
      onClick={() => setSelected(value)}
      style={style}
    >
      {value}
    </button>
  );
};
