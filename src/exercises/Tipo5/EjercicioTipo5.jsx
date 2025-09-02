import { Fragment, useState } from "react";
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
import "./ejercicioTipo5.css";

export const ejemploTipo5 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 5,
  number: 31,
  unidad: 7,
  title: "Present Perfect Simple",
  description:
    "Rellena los huecos de las siguientes oraciones con la forma verbal correcta en PRESENT PERFECT SIMPLE",
  sentences: [
    {
      sentence: "She ___ a new course in Art",
      answers: ["correcta"],
      textToConjugate: "(JUST START)",
    },
    {
      sentence: "___ you ___ this film by Tom Cruise?",
      answers: ["correcta", "correcta"],
      answers2: ["alternativa"],
      explanation:
        "Esta es la explicación de la oración she just started a new course in Art",
      textToConjugate: "(EVER WATCH)",
    },
    {
      sentence: "My little dog ___ to the park ___",
      answers: ["correcta", "correcta"],
      textToConjugate: "(NOT BE YET)",
    },
    {
      sentence: "___ what i was doing",
      answers: [["hola", ["permutable1", "permutable2"]]],
      textToConjugate: "(ALREADY FINISH)",
    },
    {
      sentence: "How much ___ you ___ this book?",
      answers: ["correcta", "correcta"],
      textToConjugate: "(READ)",
    },
    {
      sentence: "___ she ___ in Florida?",
      answers: ["correcta", "correcta"],
      textToConjugate: "(ALWAYS LIVE)",
    },
    {
      sentence: "She ___ in Florida. She ___ in Raleigh.",
      answers: ["correcta", "correcta"],
      explanation: "La explicación es...",
      answers2: [null, "otra"],
      answers3: [null, "otra2"],
      textToConjugate: "(NEVER LIVE / ALWAYS LIVE)",
    },
    {
      sentence: "We ___ a cup of coffee for breakfast.",
      answers: ["correcta"],
      textToConjugate: "(HAVE)",
    },
  ],
};

export const EjercicioTipo5 = ({ ejercicio }) => {
  const initialStates = [];
  ejercicio.sentences.forEach((sentence) =>
    sentence.answers.forEach(() => initialStates.push(""))
  );

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const showAndSaveGrade = (results) => {
    const computableResults = results;
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
    const answers = [];
    const answers2 = [];
    const answers3 = [];
    const answers4 = [];
    const answers5 = [];
    const answers6 = [];
    const answers7 = [];
    const answers8 = [];
    const answers9 = [];
    const answers10 = [];
    const answers11 = [];
    const answers12 = [];

    ejercicio.sentences.forEach((sentence) => {
      sentence.answers.forEach((answer, i) => {
        answers.push(answer);
        answers2.push(sentence.answers2?.[i]);
        answers3.push(sentence.answers3?.[i]);
        answers4.push(sentence.answers4?.[i]);
        answers5.push(sentence.answers5?.[i]);
        answers6.push(sentence.answers6?.[i]);
        answers7.push(sentence.answers7?.[i]);
        answers8.push(sentence.answers8?.[i]);
        answers9.push(sentence.answers9?.[i]);
        answers10.push(sentence.answers10?.[i]);
        answers11.push(sentence.answers11?.[i]);
        answers12.push(sentence.answers12?.[i]);
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
          answers4[iAns],
          answers5[iAns],
          answers6[iAns],
          answers7[iAns],
          answers8[iAns],
          answers9[iAns],
          answers10[iAns],
          answers11[iAns],
          answers12[iAns],
          5
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

        {ejercicio.sentences.map((sentence, iSentence) => (
          <div className="et5-sentence" key={iSentence}>
            <span>{iSentence + 1}</span>
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
            {sentence.textToConjugate && (
              <div className="et5-ttc">{sentence.textToConjugate}</div>
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
