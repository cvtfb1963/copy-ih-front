import React, { useState } from "react";
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
import {
  TIPO7_BLUE,
  TIPO7_GREEN,
  TIPO7_RED,
} from "../Tipo7/formulasPage/Tipo7FormulasPage";
import "./tipo4.css";

export const ejemploTipo4 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 4,
  number: 1651,
  unidad: 49,
  title: "Prefer",
  Description:
    "Selecciona la mejor alternativa para la fórmula siguiente AFIRMATIVAS con la que dirías algo como 'Prefiero comer sano a hacer ejercicio'. Es decir, preferir UNA ACCIÓN (un VERBO) a OTRA ACCIÓN (otro Verbo)",
  Description2:
    "OBSERVACIÓN: No hemos pedido que hagáis la fórmula general negativa porque veremos más adelante que la fórmula es ligeramente distinta",
  left: [
    {
      answer: "Sujeto",
      shown: true,
      color: "azul",
    },
    {
      answer: "Prefer",
      color: "azul",
      options: [
        "Auxiliar",
        "Noun",
        "Prefer",
        "Rather",
        "Sujeto",
        "Than",
        "To",
        "Verbo (Infinitivo)",
        "Verbo (Gerundio)",
        "Would",
      ],
    },
    {
      answer: "To",
      shown: true,
      color: "azul",
    },
    {
      answer: "Verbo (Infinitivo)",
      color: "azul",
      options: [
        "Auxiliar",
        "Noun",
        "Prefer",
        "Rather",
        "Sujeto",
        "Than",
        "To",
        "Verbo (Infinitivo)",
        "Verbo (Gerundio)",
        "Would",
      ],
    },
    {
      answer: "Complemento",
      shown: true,
      color: "azul",
    },
  ],
  right: [
    [
      {
        answer: "Rather",
        options: [
          "Auxiliar",
          "Auxiliar",
          "Noun",
          "Prefer",
          "Rather",
          "Sujeto",
          "Than",
          "To",
          "Verbo (Infinitivo)",
          "Verbo (Gerundio)",
          "Would",
        ],
        color: "azul",
      },
      {
        answer: "Than",
        options: [
          "Auxiliar",
          "Noun",
          "Prefer",
          "Rather",
          "Sujeto",
          "Than",
          "To",
          "Verbo (Infinitivo)",
          "Verbo (Gerundio)",
          "Would",
        ],
        color: "azul",
      },
      {
        answer: "To",
        shown: true,
        color: "azul",
        tachado: true,
      },
      {
        answer: "Verbo (Infinitivo)",
        color: "azul",
        options: [
          "Auxiliar",
          "Noun",
          "Prefer",
          "Rather",
          "Sujeto",
          "Than",
          "To",
          "Verbo (Infinitivo)",
          "Verbo (Gerundio)",
          "Would",
        ],
      },
      {
        answer: "Complemento",
        shown: true,
        color: "azul",
        tachado: false,
      },
    ],
  ],
};

const colors = {
  rojo: TIPO7_RED,
  azul: TIPO7_BLUE,
  verde: TIPO7_GREEN,
};

export const EjercicioTipo4 = React.memo(({ ejercicio }) => {
  const initialStates = [];
  ejercicio.left.forEach(() => initialStates.push("Elegir"));
  ejercicio.right.forEach((row) =>
    row.forEach(() => initialStates.push("Elegir"))
  );

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);

  const dispatch = useDispatch();

  const handleReset = () => {
    setResponses(initialStates);
    setUserResponses(initialStates);
    setVerified(false);
  };

  const isShown = (generalIndex) => {
    if (generalIndex < ejercicio.left.length)
      return ejercicio.left[generalIndex].shown;

    let current = ejercicio.left.length;

    for (const row of ejercicio.right) {
      for (const part of row) {
        if (current === generalIndex) return part.shown;
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
    const results = [];

    

    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );

    ejercicio.left.forEach((part, i) =>
      results.push(
        part.shown ||
          checkAnswer(userResponses[getIndex(null, i)], part.answer, 4)
      )
    );

    ejercicio.right.forEach((row, iRow) =>
      row.forEach((part, i) =>
        results.push(
          part.shown ||
            checkAnswer(userResponses[getIndex(iRow, i)], part.answer, 4)
        )
      )
    );

    localStorage.removeItem("is_vocabulary_exercise");

    setVerified(true);
    setResponses(results);

    showAndSaveGrade(results);
  };

  const getIndex = (iRow, i) => {
    if (iRow === null || iRow === undefined) return i;
    let acc = 0;
    acc += ejercicio.left.length;
    ejercicio.right.slice(0, iRow).forEach((row) => (acc += row.length));
    acc += i;
    return acc;
  };

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      const data = [...old];
      data[i] = value;
      return data;
    });
  };

  const height = {
    1: "100%",
    2: "130px",
    3: "200px",
    4: "283px",
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <div className="tipo4-container">
          <h2 style={{ color: TIPO7_RED, margin: "10px" }}>Estructura</h2>
          <div className="tipo4-diagrama">
            <div className="tipo4-left" style={{ marginLeft: "15px" }}>
              {ejercicio.left.map((part, i, arr) => (
                <>
                  {part.shown ? (
                    <p
                      key={`left-${getIndex(null, i)}`}
                      className="tipo4-shown"
                      style={{ color: colors[part.color] }}
                    >
                      {part.tachado ? <del>{part.answer}</del> : part.answer}
                    </p>
                  ) : (
                    <select
                      key={`left-${getIndex(null, i)}`}
                      className="tipo4-select"
                      onChange={({ target: { value } }) =>
                        handleChange(getIndex(null, i), value)
                      }
                      value={userResponses[getIndex(null, i)]}
                      style={{
                        color: colors[part.color],
                        border: `${verified ? "2px" : "1px"} solid ${
                          !verified
                            ? "gray"
                            : !responses[getIndex(null, i)]
                            ? "red"
                            : "green"
                        }`,
                        background: !verified
                          ? ""
                          : !responses[getIndex(null, i)]
                          ? "rgb(255, 0, 0, 0.2)"
                          : "rgb(0, 255, 0, 0.2)",
                      }}
                    >
                      <option value="Elegir">Elegir</option>
                      {part.options.map((option, io) => (
                        <option
                          value={option}
                          key={`o-${getIndex(null, i)}-${io}`}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {i + 1 < arr.length && (
                    <div style={{ margin: "1px 5px" }}>+</div>
                  )}
                </>
              ))}
            </div>
            <ArrowRenderer count={ejercicio.right.length} />
            <div
              className="tipo4-right"
              style={{
                marginRight: "15px",
                height: height[ejercicio.right.length],
              }}
            >
              {ejercicio.right.map((row, iRow) => (
                <div key={`right-${iRow}`}>
                  {row.map((part, i, arr) => (
                    <>
                      {part.shown ? (
                        <p
                          key={`right-${getIndex(iRow, i)}`}
                          className="tipo4-shown"
                          style={{ color: colors[part.color] }}
                        >
                          {part.tachado ? (
                            <del>{part.answer}</del>
                          ) : (
                            part.answer
                          )}
                        </p>
                      ) : (
                        <select
                          key={`right-${getIndex(iRow, i)}`}
                          className="tipo4-select"
                          onChange={({ target: { value } }) =>
                            handleChange(getIndex(iRow, i), value)
                          }
                          value={userResponses[getIndex(iRow, i)]}
                          style={{
                            color: colors[part.color],
                            border: `${verified ? "2px" : "1px"} solid ${
                              !verified
                                ? "gray"
                                : !responses[getIndex(iRow, i)]
                                ? "red"
                                : "green"
                            }`,
                            background: !verified
                              ? ""
                              : !responses[getIndex(iRow, i)]
                              ? "rgb(255, 0, 0, 0.2)"
                              : "rgb(0, 255, 0, 0.2)",
                          }}
                        >
                          <option value="Elegir">Elegir</option>
                          {part.options.map((option, io) => (
                            <option
                              value={option}
                              key={`o-${getIndex(iRow, i)}-${io}`}
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      {i + 1 < arr.length && (
                        <div style={{ margin: "1px 5px" }}>+</div>
                      )}
                    </>
                  ))}
                </div>
              ))}
            </div>
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
});

const ArrowRenderer = ({ count }) => {
  const leftHeight = {
    2: "88px",
    3: "168px",
    4: "248px",
  };

  return (
    <div
      style={{
        display: "flex",
        // width: "100%",
        flex: 1,
        margin: "0 30px",
        height: "fit-content",
        alignItems: "center",
      }}
    >
      <div style={{ width: "30px", height: "8px", background: "black" }}></div>
      {count > 1 && (
        <div
          style={{
            height: leftHeight[count],
            width: "8px",
            background: "black",
          }}
        ></div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {Array(count)
          .fill("")
          .map((_, i) => (
            <Arrow key={i} />
          ))}
      </div>
    </div>
  );
};

const Arrow = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        margin: "25px 0",
      }}
    >
      <div style={{ flex: 1, height: "8px", background: "black" }}></div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "30px solid black",
          borderTop: "15px solid transparent",
          borderBottom: "15px solid transparent",
        }}
      ></div>
    </div>
  );
};
