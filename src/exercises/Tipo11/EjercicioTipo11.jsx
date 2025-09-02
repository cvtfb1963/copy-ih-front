import HelpIcon from "@mui/icons-material/Help";
import { Checkbox, IconButton } from "@mui/material";
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
import { checkAnswer } from "../../utils/exercises.utils";
import "./ejercicioTipo11.css";

const abcd = "abcdefghijklmnopqrstuvwxyz";

export const ejemploTipo11 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 11,
  number: 261,
  unidad: 5,
  audio: "1.1",
  title: "Titulo del ejercicio",
  description: "descipcion o consigna...",
  sentences: [
    {
      sentence: "La respuesta de esta oración es TRUE",
      answer: true,
      explanation: "Esto explica la respuesta de la primera oración",
    },
    {
      sentence: "La respuesta de esta oración es FALSE",
      answer: false,
    },
    {
      description: "Esta es una segunda descripción.",
      description2: "Este es el segundo párrafo de esta segunda descripción",
    },
    {
      sentence: "La respuesta de esta oración es TRUE",
      answer: true,
    },
    {
      sentence: "La respuesta de esta oración es TRUE",
      answer: true,
    },
    {
      sentence: "La respuesta de esta oración es FALSE",
      answer: false,
    },
  ],
};

export const EjercicioTipo11 = ({ ejercicio }) => {
  const initialStates = [];
  ejercicio.sentences
    .filter((sentence) => !sentence.description)
    .forEach(() => initialStates.push(""));

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);

  const dispatch = useDispatch();

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
    ejercicio.sentences
      .filter((sentence) => !sentence?.description)
      .forEach((sentence) => answers.push(sentence.answer));
    const responsesCheck = [];
    answers.forEach((answer, iAns) => {
      responsesCheck.push(checkAnswer(userResponses[iAns], answer, 11));
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

  const getIndex = (i) => {
    ejercicio.sentences.slice(0, i).forEach((sentence) => {
      if (sentence.description) i--;
    });
    return i;
  };

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      const data = [...old];
      data[i] = value;
      return data;
    });
  };

  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <div className="et11-container">
          {ejercicio.audio && (
            <AudioPlayer audioName={ejercicio.audio} justEnglish />
          )}
          {ejercicio.sentences.map((sentence, iSentence) =>
            sentence?.description ? (
              <div key={`desc-${iSentence}`} style={{ margin: "20px" }}>
                <DescriptionRenderer ejercicio={sentence} bold ignoreImage />
              </div>
            ) : (
              <div className="et11-sentence" key={`s-${iSentence}`}>
                <p
                  style={{
                    color:
                      responses[getIndex(iSentence)] === ""
                        ? "black"
                        : !responses[getIndex(iSentence)]
                        ? "red"
                        : "green",
                  }}
                >
                  <b>({abcd[getIndex(iSentence)]})</b> {sentence.sentence}
                </p>
                <form>
                  <span>
                  <Checkbox
                    value={true}
                    checked={userResponses[getIndex(iSentence)] === true}
                    onChange={({ target: { checked } }) =>
                      handleChange(getIndex(iSentence), checked ? true : "")
                    }
                    disabled={verified}
                  />
                  True
                  </span>
                  <span>
                  <Checkbox
                    value={true}
                    checked={userResponses[getIndex(iSentence)] === false}
                    onChange={({ target: { checked } }) =>
                      handleChange(getIndex(iSentence), checked ? false : "")
                    }
                    disabled={verified}
                  />
                  False
                  </span>
                  {verified && sentence.explanation && (
                    <IconButton
                      onClick={() => showExplanation(sentence.explanation)}
                    >
                      <HelpIcon />
                    </IconButton>
                  )}
                </form>
              </div>
            )
          )}
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
