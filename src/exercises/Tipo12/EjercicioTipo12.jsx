import { useState } from "react";
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
import { checkAnswer, getPlainValue } from "../../utils/exercises.utils";
import "./ejercicioTipo12.css";

export const ejemploTipo12 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 12,
  number: 123,
  unidad: 5,
  title: "Titulo del ejercicio",
  description: "descipcion o consigna...",
  calificationSobre: 10,
  fields: [
    {
      answer: "correcta1",
      shown: false,
      explanation: "Esta es la explicación!",
      answer2: "otra respuesta correcta",
      answer3: "esta tambien",
    },
    {
      answer: "correcta2",
      shown: true,
    },
    {
      answer: "correcta3",
      shown: false,
    },
    {
      answer: "correcta4",
      shown: false,
    },
    {
      answer: "correcta5",
      shown: false,
    },
    {
      answer: "correcta6",
      shown: true,
    },
    {
      answer: "correcta7",
      shown: false,
    },
    {
      answer: "correcta8",
      shown: false,
    },
  ],
};

export const EjercicioTipo12 = ({ ejercicio }) => {
  const initialStates = [];
  const initialVerifiedResponses = {};
  ejercicio.fields.forEach((_, i) => {
    initialStates.push("");
    initialVerifiedResponses[i] = "";
  });

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);
  const [verifiedResponses, setVerifiedResponses] = useState(
    initialVerifiedResponses
  );

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const isShown = (generalIndex) => {
    let current = 0;

    for (const field of ejercicio.fields) {
      if (current === generalIndex) return field.shown;
      else current++;
    }
  };

  const showAndSaveGrade = (results) => {
    const computableResults = results.filter((_, i) => !isShown(i));
    const total = ejercicio.calificationSobre ?? computableResults.length;
    const successes = computableResults.filter((x) => x).length;

    let grade = successes / total;
    if (grade > 1) grade = 1;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const handleVerify = () => {
    

    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const fields = [];
    ejercicio.fields.forEach((field) => fields.push(field));
    const responsesCheck = [];
    const verifiedResponsesTemp = {};

    fields.forEach((field, iField) => {
      if (field.shown) {
        verifiedResponsesTemp[iField] = "shown!";
        return responsesCheck.push(true);
      }
      let iRes = -1;

      for (let i = 0; i < userResponses.length; i++) {
        const check = checkAnswer(
          userResponses[i],
          field.answer,
          field.answer2,
          field.answer3,
          field.answer4,
          field.answer5,
          field.answer6,
          field.answer7,
          field.answer8,
          field.answer9,
          field.answer10,
          field.answer11,
          field.answer12,
          12
        );
        if (check) {
          iRes = i;
          break;
        }
      }

      responsesCheck.push(iRes !== -1);
      verifiedResponsesTemp[iField] = iRes !== -1;
    });
    localStorage.removeItem("is_vocabulary_exercise");
    setVerifiedResponses(verifiedResponsesTemp);
    setResponses(responsesCheck);
    setVerified(true);
    showAndSaveGrade(responsesCheck);
  };

  const handleReset = () => {
    setUserResponses(initialStates);
    setVerifiedResponses(initialVerifiedResponses);
    setVerified(false);
    setResponses(initialStates);
  };

  const getIndex = (i) => i;

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      const data = [...old];
      data[i] = value;
      return data;
    });
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <div className="et12-container">
          {verified
            ? Object.keys(verifiedResponses).map((key) => (
                <div
                  key={`et12s-${key}`}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span className="et12-index">{Number(key) + 1}</span>
                  <div className="et12-field">
                    <input
                      disabled
                      style={{
                        border: `1px solid ${
                          verifiedResponses[key] ? "green" : "red"
                        }`,
                      }}
                      value={
                        verifiedResponses[key]
                          ? getPlainValue(ejercicio.fields[key].answer)
                          : ""
                      }
                    />

                    <p
                      className="et1-column-answer"
                      style={{
                        lineHeight: 0,
                        margin: "0 0 0 12px",
                        padding: 0,
                        color: !verifiedResponses[key] ? "red" : "green",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        showExplanation(ejercicio.fields[key].explanation)
                      }
                    >
                      {getPlainValue(ejercicio.fields[key].answer)}
                    </p>
                  </div>
                </div>
              ))
            : ejercicio.fields.map((field, i) => (
                <div
                  key={`f-${i}`}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span className="et12-index">{i + 1}</span>
                  <div className="et12-field">
                    <input
                      disabled={verified || field.shown}
                      style={{
                        border: `1px solid ${
                          responses[getIndex(i)] === ""
                            ? "gray"
                            : !responses[getIndex(i)]
                            ? "red"
                            : "green"
                        }`,
                      }}
                      value={
                        field.shown ? field.answer : userResponses[getIndex(i)]
                      }
                      onChange={({ target: { value } }) =>
                        handleChange(getIndex(i), value)
                      }
                    />

                    {shouldShowAnswer() && (
                      <p
                        className="et1-column-answer"
                        style={{
                          lineHeight: 0,
                          margin: "0 0 0 12px",
                          padding: 0,
                          color: !responses[getIndex(i)] ? "red" : "green",
                          cursor: "pointer",
                        }}
                        onClick={() => showExplanation(field.explanation)}
                      >
                        {getPlainValue(field.answer)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
