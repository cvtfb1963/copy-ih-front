import AffirmativeIcon from "@mui/icons-material/CheckBox";
import NegativeIcon from "@mui/icons-material/DisabledByDefault";
import InterrogativeIcon from "@mui/icons-material/HelpCenterRounded";
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
import "./ejercicioTipo3.css";

export const ejemploTipo3 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 3,
  number: 1,
  unidad: 10,
  title: "Present Continuous",
  description:
    'Completa las FÓRMULAS GENERALES y las TRES PALABRAS CLAVE que has letra::cursiva aprendido letra::cursiva en la unidad y que vienen detalladas al principio de los videos de "Construcción de fórmulas". Lo que identifiques aquí aparecerá en el siguiente Ejercicio 3. Lo tendrás que usar como referencia para construir las tres FÓRMULAS ESPECÍFICAS del tiempo verbal aquí presentado. Por ello, te recomiendo que si tienes fallos al verificar este ejercicio, lo rehagas hasta que esté totalmente correcto. Todo esto siguiendo lo que has aprendido en el video de esta unidad',
  formulas: [
    {
      name: "AFF",
      textoAuxiliar: "Este es un texto de ayuda.",
      options: [
        "Auxiliar",
        "Complemento",
        "Complemento?",
        "Not",
        "Sujeto",
        "Verbo (restante)",
        "Verbo (total)",
        "(Wh_)",
      ],
      answers: [
        {
          value: "Auxiliar",
          answer2: "otra respuesta correcta",
          answer3: "esta tambien",
          explanation: "Esta es la explicación para la respuesta Auxiliar",
          parentesis: true,
        },
        {
          value: "Complemento",
          shown: true,
          color: "blue",
          parentesis: true,
        },
        {
          value: "Complemento / no",
          shown: true,
          color: "orange",
          black: "/",
          asterisco: true,
        },
        {
          value: "Not",
          shown: false,
          asterisco: true,
        },
      ],
    },
    {
      name: "NEG",
      options: [
        "Auxiliar",
        "Complemento",
        "Complemento?",
        "Not",
        "Sujeto",
        "Verbo (restante)",
        "Verbo (total)",
        "(Wh_)",
      ],
      answers: [
        {
          value: "Auxiliar",
          shown: false,
        },
        {
          value: "Complemento",
          shown: true,
        },
        {
          value: "Complemento?",
          shown: false,
        },
        {
          value: "Not",
          shown: true,
        },
      ],
    },
    {
      name: "¿?",
      options: [
        "Auxiliar",
        "Complemento",
        "Complemento?",
        "Not",
        "Sujeto",
        "Verbo (restante)",
        "Verbo (total)",
        "(Wh_)",
      ],
      answers: [
        {
          value: "Auxiliar",
          shown: false,
        },
        {
          value: "Complemento",
          shown: false,
        },
        {
          value: "Complemento?",
          shown: false,
        },
        {
          value: "Not",
          shown: false,
        },
        {
          value: "Sujeto",
          shown: false,
        },
      ],
    },
  ],
};

export const EjercicioTipo3 = ({ ejercicio }) => {
  const initialStates = [];
  ejercicio.formulas.forEach((formula) =>
    formula.answers.forEach(() => initialStates.push(null))
  );

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const [selectState, setSelectState] = useState(initialStates);
  const [responses, setResponses] = useState({});
  const [verified, setVerified] = useState(false);

  const handleSelectChange = (index, value) => {
    setResponses((old) => ({ ...old, [index]: value }));
  };

  const handleReset = () => {
    setSelectState(initialStates);
    setResponses({});
    setVerified(false);
  };

  const isShown = (generalIndex) => {
    let current = 0;

    for (const formula of ejercicio.formulas) {
      for (const answer of formula.answers) {
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
    ejercicio.formulas.forEach((formula, iFormula) =>
      formula.answers.forEach((answer, i) => {
        if (answer.shown) return results.push(true);
        const selectedAnswer = responses[getIndex(iFormula, i)];
        results.push(
          checkAnswer(
            selectedAnswer,
            answer.value,
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
            3
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

  const getIndex = (iFormula, i) => {
    const sizes = [];
    ejercicio.formulas
      .slice(0, iFormula)
      .forEach((formula) => sizes.push(formula.answers.length));
    return sizes.reduce((a, b) => a + b, 0) + i;
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        {ejercicio.formulas.map((formula, iFormula) => (
          <div key={formula.name} style={{ margin: 10 }}>
            <fieldset className="et3-fs">
              <legend style={{ display: "flex", backgroundColor: "white" }}>
                {formula.name === "AFF" && (
                  <AffirmativeIcon style={{ color: "037bfc" }} />
                )}
                {formula.name === "NEG" && (
                  <NegativeIcon style={{ color: "fc0398" }} />
                )}
                {formula.name === "¿?" && (
                  <InterrogativeIcon style={{ color: "c203fc" }} />
                )}
                <h4
                  style={{
                    color:
                      formula.name === "AFF"
                        ? "#037bfc"
                        : formula.name === "NEG"
                        ? "#fc0398"
                        : formula.name === "¿?"
                        ? "#c203fc"
                        : "",
                  }}
                >
                  {formula.name}
                </h4>
              </legend>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  className="gramatica-formula"
                  style={{ paddingBottom: formula.textoAuxiliar && 0 }}
                >
                  {formula.answers.map(
                    (
                      {
                        value,
                        shown,
                        color,
                        black,
                        explanation,
                        parentesis,
                        asterisco,
                      },
                      i
                    ) => (
                      <>
                        {shown ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {parentesis && (
                              <p
                                style={{
                                  marginLeft: 6,
                                }}
                              >
                                (
                              </p>
                            )}
                            <div className="et3-value-container">
                              <div
                                style={{
                                  margin: `0 ${parentesis ? "3px" : "5px"}`,
                                  color: color ?? "",
                                }}
                              >
                                {!black
                                  ? value
                                  : value.split(black).map((part, ip, arr) => (
                                      <Fragment key={`fp-${ip}`}>
                                        {part}
                                        <div
                                          style={{
                                            color: "black",
                                            display: "inline",
                                          }}
                                        >
                                          {ip + 1 !== arr.length && black}
                                        </div>
                                      </Fragment>
                                    ))}
                              </div>
                              {shouldShowAnswer() && (
                                <p className="et1-column-answer"></p>
                              )}
                            </div>
                            {parentesis && (
                              <p
                                style={{
                                  marginRight: 6,
                                }}
                              >
                                )
                              </p>
                            )}
                            {asterisco && (
                              <sup
                                style={{
                                  marginRight: 5,
                                  position: "relative",
                                  top: -4,
                                  fontWeight: 800,
                                  alignSelf: "flex-start",
                                }}
                              >
                                *
                              </sup>
                            )}
                          </div>
                        ) : (
                          <div className="et3-value-container">
                            <div style={{ display: "flex" }}>
                              {parentesis && (
                                <p
                                  style={{
                                    alignSelf: "center",
                                    fontSize: 24,
                                    marginLeft: 6,
                                  }}
                                >
                                  (
                                </p>
                              )}
                              <select
                                disabled={verified}
                                style={{
                                  border: `3px solid ${
                                    selectState[getIndex(iFormula, i)] === null
                                      ? "gray"
                                      : !selectState[getIndex(iFormula, i)]
                                      ? "red"
                                      : "green"
                                  }`,
                                  marginLeft: parentesis && 3,
                                  marginRight: parentesis && 3,
                                }}
                                onChange={({ target: { value } }) =>
                                  handleSelectChange(
                                    getIndex(iFormula, i),
                                    value
                                  )
                                }
                                value={responses[getIndex(iFormula, i)]}
                              >
                                <option selected>Seleccionar</option>
                                {formula.options.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              {parentesis && (
                                <p
                                  style={{
                                    alignSelf: "center",
                                    fontSize: 24,
                                    marginRight: 6,
                                  }}
                                >
                                  )
                                </p>
                              )}
                              {asterisco && (
                                <sup
                                  style={{
                                    marginTop: 6,
                                    marginRight: 5,
                                    fontWeight: 800,
                                  }}
                                >
                                  *
                                </sup>
                              )}
                            </div>
                            {shouldShowAnswer() && (
                              <p
                                className="et1-column-answer"
                                style={{
                                  color: selectState[getIndex(iFormula, i)]
                                    ? "green"
                                    : "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => showExplanation(explanation)}
                              >
                                {getPlainValue(value)}
                              </p>
                            )}
                          </div>
                        )}
                        {i < formula.answers.length - 1 && (
                          <span
                            style={{
                              marginTop: shouldShowAnswer() ? "-15px" : "0",
                            }}
                          >
                            +
                          </span>
                        )}
                      </>
                    )
                  )}
                </div>
                {formula.textoAuxiliar && (
                  <p style={{ margin: "0 10px 5px 10px", fontSize: "0.8em" }}>
                    <sup style={{ fontSize: "0.8em" }}>* </sup>
                    {formula.textoAuxiliar}
                  </p>
                )}
              </div>
            </fieldset>
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
