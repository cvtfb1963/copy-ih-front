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
import { useScreenSize } from "../../hooks/useScreenSize";
import { setCurrent } from "../../store/datosSlice";
import { dividirArray } from "../../utils/arrays.utils";
import { checkAnswer } from "../../utils/exercises.utils";
import "./ejercicioTipo22.css";

export const ejemploTipo22 = {
  skill: EXERCISE_SKILLS.PRONUNCIATION,
  type: 22,
  number: 385,
  unidad: 1,
  title: "Ejercicio de pronunciación",
  description:
    "Presta atención a la pronunciación de las palabras del audio. Luego, pronuncia cada una.",
  words: ["Color", "Cat", "Dog"],
  words2: ["Work"],
};

export const EjercicioTipo22 = ({ ejercicio }) => {
  const initialStates = ejercicio.words.map(() => "");

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);
  const [canRecord, setCanRecord] = useState(true);
  const { width } = useScreenSize();

  let columns = Math.floor(width / 360);
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
        checkAnswer(userResponses[iAns], ...posibleResponses, 22)
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
        <div className="et22-container">
          <div className="et22-groups-container">
            {wordGroups.map((group, iGroup) => (
              <div
                key={`group-${iGroup}`}
                className="et22-words-container"
                style={{
                  gridTemplateRows: `1fr 1fr 1fr`,
                  display: "grid",
                  gridAutoFlow: "column",
                  margin: "10px",
                }}
              >
                {group.map((word, i) => (
                  <div
                    key={`word-${getIndex(iGroup, i)}`}
                    className="et22-word"
                  >
                    <span>{getIndex(iGroup, i) + 1}</span>
                    <p>{word}</p>
                    <div style={{ justifySelf: "end", justifyContent: "end", alignContent: "end", justifyItems: "end", alignItems: "end" }}>
                      <DictadoOptimized
                        onChange={(value) =>
                          handleChange(getIndex(iGroup, i), value)
                        }
                        borderColor={
                          responses[getIndex(iGroup, i)] === ""
                            ? ""
                            : responses[getIndex(iGroup, i)]
                            ? "green"
                            : "red"
                        }
                        inputStyle={{
                          borderRadius: "10px",
                          height: "25px",
                          padding: "5px",
                          width: "110px",
                        }}
                        onRecordChange={(state) => setCanRecord(!state)}
                        canRecord={canRecord}
                        wordFunction={true}
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
