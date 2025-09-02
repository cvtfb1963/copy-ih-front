import { useState } from "react";
import { useDispatch } from "react-redux";
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
import { checkAnswer, getPlainValue } from "../../utils/exercises.utils";
import "./ejercicioTipo27.css";

export const ejemploTipo27 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 27,
  number: 2,
  unidad: 2,
  title: "Present Simple",
  adjustToSize: true,
  reverted: true,
  description:
    "Selecciona en cuáles de las siguientes oraciones usarías el present simple y en cuáles no.",
  imagen: "aircon.jpeg",
  options: ["Si", "No"],
  sentences: [
    {
      sentence:
        "Voy al cine todos los domingos Voy al cine todos los domingos Voy al cine todos los domingos Voy al cine todos los domingos Voy al cine todos los domingos Voy al cine todos los domingos Voy al cine todos los domingos",
      answers: [
        {
          answer: "Si",
          shown: false,
          answer2: "otra respuesta correcta",
          answer3: "esta tambien",
          explanation: "Esta es una explicacion",
        },
        {
          answer: "No",
          shown: false,
          options: ["opcion 1", "no", "opcion 3", "otra opcion 4"],
        },
      ],
    },
    {
      sentence: "Estoy trabajando en Marruecos",
      answers: [
        {
          answer: "No",
          shown: true,
        },
        {
          answer: "No",
          shown: false,
          isText: true,
        },
      ],
    },
    {
      sentence: "Mi padre se fue a vivir a España.",
      answers: [
        {
          answer: "No",
          shown: false,
        },
        {
          answer: "Si",
          shown: true,
          isText: true,
        },
      ],
    },
  ],
};

export const EjercicioTipo27 = ({ ejercicio }) => {
  const initialStates = [];
  const initialResponses = {};
  ejercicio.sentences.forEach((sentence) =>
    sentence.answers.forEach((_, i) => {
      initialStates.push(null);
      initialResponses[i] = "";
    })
  );

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const [selectState, setSelectState] = useState(initialStates); //this are the state of answers (true / false / null)
  const [responses, setResponses] = useState(initialResponses);
  const [verified, setVerified] = useState(false);

  const handleChange = (index, value) => {
    setResponses((old) => ({ ...old, [index]: value }));
  };

  const handleReset = () => {
    setSelectState(initialStates);
    setResponses(initialResponses);
    setVerified(false);
  };

  const isShown = (generalIndex) => {
    let current = 0;

    for (const sentence of ejercicio.sentences) {
      for (const answer of sentence.answers) {
        if (current === generalIndex) return answer.shown;
        else current++;
      }
    }
  };

  const showAndSaveGrade = (results) => {
    const computableResults = results.filter((_, i) => !isShown(i));
    const total = computableResults.length;
    const successes = computableResults.filter((x) => x).length;

    const grade = successes / total;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const handleVerify = () => {
    

    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const results = [];
    ejercicio.sentences.forEach((sentence, iSentence) =>
      sentence.answers.forEach((answer, i) => {
        if (answer.shown) return results.push(true);
        results.push(
          checkAnswer(
            responses[getIndex(iSentence, i)],
            answer.answer,
            answer.answer2,
            answer.answer3,
            answer.answer4,
            answer.answer5,
            answer.answer6,
            answer.answer7,
            answer.answer8,
            answer.answer9,
            answer.answer10,
            answer.answer11,
            answer.answer12,
            27
          )
        );
      })
    );
    localStorage.removeItem("is_vocabulary_exercise");
    setSelectState(results);
    setVerified(true);
    showAndSaveGrade(results);
  };

  const shouldShowAnswer = () =>
    verified && Object.values(selectState).some((x) => !x);

  const getIndex = (iSentence, i) => {
    const sizes = [];
    ejercicio.sentences
      .slice(0, iSentence)
      .forEach((sentence) => sizes.push(sentence.answers.length));
    return sizes.reduce((a, b) => a + b, 0) + i;
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        {ejercicio.audio && (
          <AudioPlayer audioName={ejercicio.audio} justEnglish />
        )}
        {ejercicio.sentences.map((sentence, iSentence) => (
          <div
            className="et27-sentence"
            key={iSentence}
            style={{ flexDirection: ejercicio.reverted && "row-reverse" }}
          >
            <p style={{ flex: 1, minWidth: "200px" }}>{sentence.sentence}</p>
            <div className="et27-sentence-options">
              {sentence.answers.map((answer, i) => (
                <div
                  key={`ans-${getIndex(iSentence, i)}`}
                  style={{ margin: 0 }}
                >
                  {answer.isText ? (
                    answer.shown ? (
                      <p
                        style={{
                          width: "250px",
                          margin: 4,
                          border: "2px solid gray",
                          padding: "4.5px",
                          borderRadius: "5px",
                          borderColor: verified ? "green" : "gray",
                        }}
                      >
                        {answer.answer}
                      </p>
                    ) : (
                      <input
                        key={i}
                        style={{
                          width: "250px",
                          border: `2px solid ${
                            selectState[getIndex(iSentence, i)] === null
                              ? "gray"
                              : !selectState[getIndex(iSentence, i)]
                              ? "red"
                              : "green"
                          }`,
                          borderRadius: "5px",
                          margin: 4,
                          height: "33.5px",
                          paddingLeft: 4,
                        }}
                        value={responses[getIndex(iSentence, i)]}
                        disabled={verified || answer.shown}
                        onChange={({ target: { value } }) =>
                          handleChange(getIndex(iSentence, i), value)
                        }
                      />
                    )
                  ) : (
                    <select
                      disabled={verified || answer.shown}
                      style={{
                        border: `3px solid ${
                          selectState[getIndex(iSentence, i)] === null
                            ? "gray"
                            : !selectState[getIndex(iSentence, i)]
                            ? "red"
                            : "green"
                        }`,
                        margin: 4,
                        width: ejercicio.adjustToSize && "auto",
                      }}
                      onChange={({ target: { value } }) =>
                        handleChange(getIndex(iSentence, i), value)
                      }
                      value={
                        answer.shown
                          ? answer.answer
                          : responses[getIndex(iSentence, i)]
                      }
                    >
                      <option selected>Seleccionar</option>
                      {answer.options
                        ? answer.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))
                        : ejercicio.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  )}
                  {shouldShowAnswer() && (
                    <p
                      className="et1-column-answer"
                      style={{
                        color: selectState[getIndex(iSentence, i)]
                          ? "green"
                          : "red",
                        paddingLeft: ejercicio.options ? "20px" : 0,
                        fontWeight: 600,
                        cursor: "pointer",
                        lineHeight: 1.5,
                      }}
                      onClick={() => showExplanation(answer.explanation)}
                    >
                      {getPlainValue(answer.answer)}
                    </p>
                  )}
                </div>
              ))}
            </div>
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
