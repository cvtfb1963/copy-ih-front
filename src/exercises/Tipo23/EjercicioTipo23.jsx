import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import { DictadoOptimized } from "../../components/Dictado/DictadoOptimized";
import { ExerciseControl } from "../../components/ExerciseControl/ExerciseControl";
import { FloatingVideo } from "../../components/FloatingVideo/FloatingVideo";
import {
  EXERCISE_SKILLS,
  EXPLANATION_VIDEOS,
} from "../../constants/ejerciciosData";
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer } from "../../utils/exercises.utils";
import "./ejercicioTipo23.css";

export const ejemploTipo23 = {
  skill: EXERCISE_SKILLS.PRONUNCIATION,
  type: 23,
  number: 825,
  unidad: 3,
  title: "Ejercicio de pronunciación",
  description: "Lee las siguientes oraciones.",
  answers: [
    "I went to the park with my dog",
    "I like to play football",
    "I hav two brothers and two sisters",
    "I want to be doctor",
  ],
  // answers2: ["hello", "alternativa", "alternativa", "alternativa"],
};

export const EjercicioTipo23 = ({ ejercicio }) => {
  const initialStates = ejercicio.answers.map(() => "");

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);
  const [canRecord, setCanRecord] = useState(true);

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
    const answers = [...ejercicio.answers];
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
        checkAnswer(userResponses[iAns], ...posibleResponses, 23)
      );
    });

    localStorage.removeItem("is_vocabulary_exercise");
    setResponses(responsesCheck);
    setVerified(true);
    showAndSaveGrade(responsesCheck);
  };

  const handleReset = () => {
    setUserResponses(initialStates);
    setVerified(false);
    setResponses(initialStates);
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
        <DescriptionRenderer ejercicio={ejercicio} />
        {ejercicio.answers.map((sentence, i) => (
          <div className="et23-sentence" key={i}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="et23-number">{i + 1}</span>
              <p>{sentence}</p>
            </div>
            <DictadoOptimized
              onChange={(value) => handleChange(i, value)}
              borderColor={responses[i] === "" ? "" : getColor(responses[i])}
              canRecord={canRecord}
              onRecordChange={(state) => setCanRecord(!state)}
            />
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
