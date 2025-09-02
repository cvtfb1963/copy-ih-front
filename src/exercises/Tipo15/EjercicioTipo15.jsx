import { TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { PALETTE } from "../../common/palette";
import { AudioPlayer } from "../../components/AudioPlayer/AudioPlayer";
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
import "./ejercicioTipo15.css";

const defaultDescription = `Reproduce el audio para escuchar las instrucciones. Te indican que oirás cada oración dos veces seguidas. Tienes que poner las comas (,) exclamaciones (!) e interrogaciones (?) cuando el audio te lo indique. Por comodidad para el alumno, no poner los puntos (.) nunca al final de cada oración. Solo cuando lo escuches en el audio  (seguramente entre dos oraciones).`;

export const ejemploTipo15 = {
  skill: EXERCISE_SKILLS.LISTENING,
  type: 15,
  number: 52,
  unidad: 10,
  title: "DICTADO 463",
  audio: "1.1",
  answers: [
    "this the answer number one",
    "this the answer number two",
    "this the answer number three",
    "this the answer number four",
    "this the answer number five",
  ],
  answers2: [
    "respuesta posible de oración 1",
    "respuesta posible de oración 2",
    "respuesta posible de oración 3",
    "respuesta posible de oración 4",
    "respuesta posible de oración 5",
  ],
};

export const EjercicioTipo15 = ({ ejercicio }) => {
  const initialStates = [];
  ejercicio.answers.forEach(() => initialStates.push(""));

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState([...initialStates]);
  const [userResponses, setUserResponses] = useState([...initialStates]);

  const dispatch = useDispatch();

  const showAndSaveGrade = (results) => {
    const total = results.length;

    const grade = results.reduce((a, b) => a + b, 0) / total;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const handleVerify = () => {
    

    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const answers = ejercicio.answers;
    const responsesCheck = [];
    answers.forEach((answer, iAns) => {
      const posibleResponses = [answer];

      if (ejercicio.answers2) posibleResponses.push(ejercicio.answers2[iAns]);
      if (ejercicio.answers3) posibleResponses.push(ejercicio.answers3[iAns]);
      if (ejercicio.answers4) posibleResponses.push(ejercicio.answers4[iAns]);
      if (ejercicio.answers5) posibleResponses.push(ejercicio.answers5[iAns]);
      if (ejercicio.answers6) posibleResponses.push(ejercicio.answers6[iAns]);
      if (ejercicio.answers7) posibleResponses.push(ejercicio.answers7[iAns]);
      if (ejercicio.answers8) posibleResponses.push(ejercicio.answers8[iAns]);
      if (ejercicio.answers9) posibleResponses.push(ejercicio.answers9[iAns]);
      if (ejercicio.answers10) posibleResponses.push(ejercicio.answers10[iAns]);
      if (ejercicio.answers11) posibleResponses.push(ejercicio.answers11[iAns]);
      if (ejercicio.answers12) posibleResponses.push(ejercicio.answers12[iAns]);

      responsesCheck.push(
        checkAnswer(userResponses[iAns], ...posibleResponses, 15)
      );
    });
    localStorage.removeItem("is_vocabulary_exercise");
    setResponses(responsesCheck);
    setVerified(true);
    showAndSaveGrade(responsesCheck);
  };

  const handleReset = () => {
    setUserResponses([...initialStates]);
    setVerified(false);
    setResponses([...initialStates]);
  };

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      const data = [...old];
      data[i] = value;
      return data;
    });
  };

  const getColor = (target) =>
    typeof target === "number"
      ? target > 0.6
        ? "green"
        : "red"
      : target
      ? "green"
      : "red";

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio.description || ejercicio.imagen ? ejercicio : {description: defaultDescription}} />
        <AudioPlayer audioName={ejercicio.audio} justEnglish />
        {ejercicio.answers.map((answer, i) => (
          <div className="et15-sentence" key={i}>
            <span
              style={{
                backgroundColor:
                  responses[i] === ""
                    ? PALETTE.quaternaryColor
                    : getColor(responses[i]),
              }}
            >
              {i + 1}
            </span>
            <TextField
              label={`Ingrese oración ${i + 1}`}
              variant="standard"
              sx={{ margin: "10px" }}
              fullWidth
              error={responses[i] === false}
              helperText={responses[i] === false ? ejercicio.answers[i] : null}
              onChange={({ target: { value } }) => handleChange(i, value)}
              color={
                responses[i] === false
                  ? "error"
                  : responses[i] === ""
                  ? ""
                  : "success"
              }
              value={userResponses[i]}
            />
            {verified && (
              <p
                style={{
                  textAlign: "left",
                  alignSelf: "start",
                  color: getColor(responses[i]),
                  lineHeight: 1,
                  marginBottom: "15px",
                  marginLeft: "10px",
                  width: "100%",
                }}
              >
                {answer}
              </p>
            )}
          </div>
        ))}
        <ExerciseControl
          handleReset={handleReset}
          handleVerify={handleVerify}
          verified={verified}
        />
      </div>
    </div>
  );
};
