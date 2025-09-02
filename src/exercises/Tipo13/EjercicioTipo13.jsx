import { Fragment, useState } from "react";
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
import "./ejercicioTipo13.css";

export const ejemploTipo13 = {
  skill: EXERCISE_SKILLS.LISTENING,
  type: 13,
  number: 31,
  unidad: 7,
  title: "Present Perfect Simple",
  description:
    "Escucha el audio y rellena los huecos de las siguientes oraciones con la forma verbal correcta en PRESENT PERFECT SIMPLE",
  audio: "2.1.1",
  sentences: [
    {
      sentence: "Customer: Hi, i'm looking for a pair of jeans",
      answers: [],
    },
    {
      sentence: "Shop asssitant: Sure, what kind of jeans are you looking for?",
      answers: [],
    },
    {
      sentence: "What are the different ___ available",
      answers: ["correcta"],
      explanation: "La explicación es...",
      answers2: ["otra"],
      answers3: ["otra2"],
    },
    {
      sentence: "Shop assistant: We have skinny, stright, and ___ styles",
      answers: ["correcta"],
    },
    {
      sentence: "Customer: I see. resto del dialogo....",
      answers: [],
    },
  ],
};

export const EjercicioTipo13 = ({ ejercicio }) => {
  const initialStates = [];
  ejercicio.sentences.forEach((sentence) =>
    sentence.answers.forEach(() => initialStates.push(""))
  );

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const showAndSaveGrade = (results) => {
    const total = results.length;
    const successes = results.filter((x) => x).length;

    const grade = successes / total;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const handleVerify = () => {
    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const answers = [];
    const answers2 = [];
    const answers3 = [];

    ejercicio.sentences.forEach((sentence) => {
      sentence.answers.forEach((answer, i) => {
        answers.push(answer);
        answers2.push(sentence.answers2?.[i]);
        answers3.push(sentence.answers3?.[i]);
      });
    });

    const responsesCheck = [];
    answers.forEach((answer, iAns) =>
      responsesCheck.push(
        checkAnswer(
          userResponses[iAns],
          answer,
          answers2[iAns],
          answers3[iAns],
          13
        )
      )
    );

    localStorage.removeItem("is_vocabulary_exercise");

    setResponses(responsesCheck);
    setVerified(true);
    showAndSaveGrade(responsesCheck);
  };

  const getAnswer = (i) => {
    const answers = [];
    ejercicio.sentences.forEach((sentence) =>
      sentence.answers.forEach((answer) => answers.push(answer))
    );
    return answers[i];
  };

  const handleReset = () => {
    setUserResponses(initialStates);
    setVerified(false);
    setResponses(initialStates);
  };

  const getIndex = (iSentence, iAnswer) => {
    const sizes = [];
    ejercicio.sentences
      .slice(0, iSentence)
      .forEach((sentence) => sizes.push(sentence.answers.length));
    return sizes.reduce((a, b) => a + b, 0) + iAnswer;
  };

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
        {ejercicio.audio && (
          <AudioPlayer audioName={ejercicio.audio} justEnglish />
        )}
        {ejercicio.sentences.map((sentence, iSentence) => (
          <div className="et13-sentence" key={iSentence}>
            {sentence.sentence.split("___").map((part, index) => (
              <Fragment key={index}>
                {index !== 0 && (
                  <div key={`input-${index}`}>
                    <input
                      style={{
                        border: `1px solid ${
                          responses[getIndex(iSentence, index - 1)] === ""
                            ? "gray"
                            : !responses[getIndex(iSentence, index - 1)]
                            ? "red"
                            : "green"
                        }`,
                      }}
                      value={userResponses[getIndex(iSentence, index - 1)]}
                      onChange={({ target: { value } }) =>
                        handleChange(getIndex(iSentence, index - 1), value)
                      }
                    />
                    {shouldShowAnswer() && (
                      <p
                        style={{
                          fontSize: "12px",
                          lineHeight: 0,
                          color:
                            responses[getIndex(iSentence, index - 1)] === null
                              ? "black"
                              : !responses[getIndex(iSentence, index - 1)]
                              ? "red"
                              : "green",
                          cursor: "pointer",
                        }}
                        onClick={() => showExplanation(sentence.explanation)}
                      >
                        {getPlainValue(
                          getAnswer(getIndex(iSentence, index - 1))
                        )}
                      </p>
                    )}
                  </div>
                )}
                <p key={`p-${index}`}>{part}</p>
              </Fragment>
            ))}
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
