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
import { useScreenSize } from "../../hooks/useScreenSize";
import { setCurrent } from "../../store/datosSlice";
import { dividirArray } from "../../utils/arrays.utils";
import { checkAnswer } from "../../utils/exercises.utils";
import "./ejercicioTipo21.css";

export const ejemploTipo21 = {
  skill: EXERCISE_SKILLS.PRONUNCIATION,
  type: 21,
  number: 99,
  unidad: 3,
  maxColumns: 4,
  title: "Ejercicio de pronunciación",
  description:
    "Escucha con atención el dictado de palabras. Luego, escribelas en órden en los campos inferiores.",
  audio: "1.1",
  words: ["Color", "Cat", "Dog", "Blue", "Plain", "Goal"],
  words2: [
    "alternativa1",
    "alternativa2",
    "alternativa3",
    "alternativa4",
    "alternativa5",
    "alternativa6",
  ],
};

export const EjercicioTipo21 = ({ ejercicio }) => {
  const initialStates = ejercicio.words.map(() => "");

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);
  const { width } = useScreenSize();

  let columns = Math.floor(width / 300);
  if (columns === 0) columns = 1;
  if (columns > ejercicio.maxColumns) columns = ejercicio.maxColumns;
  const wordGroups = dividirArray(ejercicio.words, columns * 3);

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
    const answers = [...ejercicio.words];
    const responsesCheck = [];
    answers.forEach((answer, iAns) => {
      const posibleResponses = [answer];

      if (ejercicio.words2) posibleResponses.push(ejercicio.words2[iAns]);
      if (ejercicio.words3) posibleResponses.push(ejercicio.words3[iAns]);
      if (ejercicio.words4) posibleResponses.push(ejercicio.words4[iAns]);
      if (ejercicio.words5) posibleResponses.push(ejercicio.words5[iAns]);
      if (ejercicio.words6) posibleResponses.push(ejercicio.words6[iAns]);
      if (ejercicio.words7) posibleResponses.push(ejercicio.words7[iAns]);
      if (ejercicio.words8) posibleResponses.push(ejercicio.words8[iAns]);
      if (ejercicio.words9) posibleResponses.push(ejercicio.words9[iAns]);
      if (ejercicio.words10) posibleResponses.push(ejercicio.words10[iAns]);
      if (ejercicio.words11) posibleResponses.push(ejercicio.words11[iAns]);
      if (ejercicio.words12) posibleResponses.push(ejercicio.words12[iAns]);

      responsesCheck.push(
        checkAnswer(userResponses[iAns], ...posibleResponses, 21)
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

  const getIndex = (iGroup, i) => {
    const sizes = [];
    wordGroups.slice(0, iGroup).forEach((group) => sizes.push(group.length));
    return sizes.reduce((a, b) => a + b, 0) + i;
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <div className="et21-container">
          <AudioPlayer audioName={ejercicio.audio} />
          <div className="et21-groups-container">
            {wordGroups.map((group, iGroup) => (
              <div
                key={`group-${iGroup}`}
                className="et21-words-container"
                style={{
                  gridTemplateRows: `1fr 1fr 1fr`,
                  display: "grid",
                  gridAutoFlow: "column",
                }}
              >
                {group.map((word, i) => (
                  <div
                    key={`word-${getIndex(iGroup, i)}`}
                    className="et21-word"
                  >
                    <span>{getIndex(iGroup, i) + 1}</span>
                    <div>
                      <input
                        style={{
                          flex: 1,
                          border: `1px solid ${
                            responses[getIndex(iGroup, i)] === ""
                              ? "gray"
                              : responses[getIndex(iGroup, i)]
                              ? "green"
                              : "red"
                          }`,
                          borderRadius: "10px",
                          height: "25px",
                          padding: "5px",
                          background: "#00000000",
                          marginBottom: verified && 8,
                        }}
                        value={userResponses[getIndex(iGroup, i)]}
                        onChange={({ target: { value } }) =>
                          handleChange(getIndex(iGroup, i), value)
                        }
                      />
                      {verified && (
                        <p
                          style={{
                            fontSize: "12px",
                            color:
                              responses[getIndex(iGroup, i)] === ""
                                ? ""
                                : responses[getIndex(iGroup, i)]
                                ? "green"
                                : "red",
                            lineHeight: 0.5,
                            marginRight: "30px",
                          }}
                        >
                          {word}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
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
