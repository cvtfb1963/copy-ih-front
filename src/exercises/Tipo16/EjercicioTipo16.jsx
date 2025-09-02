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
  PRONOUNS,
} from "../../constants/ejerciciosData";
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer, getPlainValue } from "../../utils/exercises.utils";
import "./ejercicioTipo16.css";

export const ejemploTipo16 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 16,
  number: 76,
  unidad: 2,
  title: "Conjuga el verbo DRIVE en afirmativo, negativo e interrogativo",
  description: "c) Conjugación en Present Continuous de DRIVE",
  sectionGroups: [
    {
      title: "FORMAS SIMPLES",
      sections: [
        {
          title: "PRETÉRITO IMPERFECTO (2)",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: ["correcta", ["1p", "2p"]],
                  explanation: "Esta es la explicación de esta respuesta",
                  answer2: "otra",
                  answer3: "alternativa",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
        {
          title: "PRETÉRICO PLUSCUAMPERFECTO (2)",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
        {
          title: "FUTURO IMPERFECTO",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
        {
          title: "FUTURO PERFECTO",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "FORMAS COMPUESTAS",
      sections: [
        {
          title: "PRETÉRITO IMPERFECTO (2)",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
        {
          title: "PRETÉRICO PLUSCUAMPERFECTO (2)",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
        {
          title: "FUTURO IMPERFECTO",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta diferente",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
        {
          title: "FUTURO PERFECTO",
          columns: [
            {
              fields: [
                {
                  shown: true,
                  value: "YO",
                },
                {
                  shown: true,
                  value: "TU",
                },
                {
                  shown: true,
                  value: "El / Ella",
                },
                {
                  shown: true,
                  value: "Nosotros/as",
                },
                {
                  shown: true,
                  value: "Vosotros/as",
                },
                {
                  shown: true,
                  value: "Ellos/as",
                },
              ],
            },
            {
              fields: [
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
                {
                  shown: false,
                  value: "correcta",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
export const EjercicioTipo16 = React.memo(({ ejercicio }) => {
  const initialStates = [];
  ejercicio.sectionGroups.forEach((group) =>
    group.sections.forEach((section) =>
      section.columns.forEach((column) =>
        column.fields.forEach(() => initialStates.push(null))
      )
    )
  );

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);

  const shouldShowColumnTitle = (section) =>
    section.columns.some((column) => column.title);

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const isShown = (generalIndex) => {
    let current = 0;

    for (const group of ejercicio.sectionGroups) {
      for (const section of group.sections) {
        for (const column of section.columns) {
          for (const field of column.fields) {
            if (current === generalIndex) return field.shown;
            else current++;
          }
        }
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
    const answers = [];
    ejercicio.sectionGroups.forEach((group) =>
      group.sections.forEach((section) =>
        section.columns.forEach((column) =>
          column.fields.forEach((field) => answers.push(field))
        )
      )
    );

    const responsesCheck = [];
    answers.forEach((answer, iAns) => {
      if (answer.shown) return responsesCheck.push(true);
      responsesCheck.push(
        checkAnswer(
          userResponses[iAns],
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
          16
        )
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

  const getIndex = (iGroup, iSection, iColumn, i) => {
    const sizes = [];
    ejercicio.sectionGroups
      .slice(0, iGroup)
      .forEach((group) =>
        group.sections.forEach((sections) =>
          sections.columns.forEach((column) => sizes.push(column.fields.length))
        )
      );
    ejercicio.sectionGroups[iGroup].sections
      .slice(0, iSection)
      .forEach((section) =>
        section.columns.forEach((column) => sizes.push(column.fields.length))
      );
    ejercicio.sectionGroups[iGroup].sections[iSection].columns
      .slice(0, iColumn)
      .forEach((column) => sizes.push(column.fields.length));
    const res = sizes.reduce((a, b) => a + b, 0) + i;
    return res;
  };

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      old[i] = value;
      return old;
    });
  };

  const getFontSize = (length) => {
    if (length < 10) return "16px";
    switch (length) {
      case 11:
        return "15px";
      case 12:
        return "14px";
      default:
        return "13px";
    }
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <div className="et16-container">
          {ejercicio.sectionGroups.map((group, iGroup) => (
            <div key={`group-${iGroup}`}>
              <h1>{group.title}</h1>
              <div>
                {group.sections.map((section, iSection) => (
                  <div key={iSection}>
                    {section.title && (
                      <h4 style={{ textAlign: "center" }}>{section.title}</h4>
                    )}
                    <div>
                      {section.columns.map((column, iColumn) => (
                        <>
                          {section.includePronouns === iColumn && (
                            <div className="et16-column">
                              {shouldShowColumnTitle(section) && (
                                <h5 style={{ textAlign: "center" }}>
                                  Pronombres
                                </h5>
                              )}
                              {PRONOUNS.map((pronoun) => (
                                <>
                                  <p
                                    key={pronoun}
                                    className="et16-column-value"
                                  >
                                    {pronoun}
                                  </p>
                                  {shouldShowAnswer() && (
                                    <p className="et16-column-answer"></p>
                                  )}
                                </>
                              ))}
                            </div>
                          )}
                          {section.includeSeparator === iColumn && (
                            <div className="et16-column">
                              {shouldShowColumnTitle(section) && (
                                <h5 style={{ textAlign: "center" }}></h5>
                              )}
                              {column.fields.map((_, i) => {
                                return (
                                  <>
                                    <p
                                      key={`-/-${i}`}
                                      className="et16-column-value"
                                      style={{ fontWeight: 600 }}
                                    >
                                      /
                                    </p>
                                    {shouldShowAnswer() && (
                                      <p className="et16-column-answer"></p>
                                    )}
                                  </>
                                );
                              })}
                            </div>
                          )}
                          <div className="et16-column">
                            {shouldShowColumnTitle(section) && (
                              <h5 style={{ textAlign: "center" }}>
                                {column.title}
                              </h5>
                            )}
                            {column.fields.map((field, i) => (
                              <>
                                <div
                                  key={`field-${getIndex(
                                    iGroup,
                                    iSection,
                                    iColumn,
                                    i
                                  )}`}
                                  className="et16-column-value"
                                >
                                  {field.shown ? (
                                    <p
                                      key={`p-${getIndex(
                                        iGroup,
                                        iSection,
                                        iColumn,
                                        i
                                      )}`}
                                      style={{
                                        width: "100px",
                                        fontSize: getFontSize(
                                          field.value.length
                                        ),
                                      }}
                                    >
                                      {field.value}
                                    </p>
                                  ) : (
                                    <input
                                      key={getIndex(
                                        iGroup,
                                        iSection,
                                        iColumn,
                                        i
                                      )}
                                      id={`ej1-i-${getIndex(
                                        iGroup,
                                        iSection,
                                        iColumn,
                                        i
                                      )}`}
                                      style={{
                                        width: "100px",
                                        border: `2px solid ${
                                          responses[
                                            getIndex(
                                              iGroup,
                                              iSection,
                                              iColumn,
                                              i
                                            )
                                          ] === null
                                            ? "gray"
                                            : !responses[
                                                getIndex(
                                                  iGroup,
                                                  iSection,
                                                  iColumn,
                                                  i
                                                )
                                              ]
                                            ? "red"
                                            : "green"
                                        }`,
                                        borderRadius: "5px",
                                      }}
                                      value={
                                        userResponses[
                                          getIndex(iGroup, iSection, iColumn, i)
                                        ]
                                      }
                                      disabled={verified}
                                      onChange={({ target: { value } }) =>
                                        handleChange(
                                          getIndex(
                                            iGroup,
                                            iSection,
                                            iColumn,
                                            i
                                          ),
                                          value
                                        )
                                      }
                                    />
                                  )}
                                </div>
                                {shouldShowAnswer() && (
                                  <p
                                    className="et16-column-answer"
                                    style={{
                                      color: responses[
                                        getIndex(iGroup, iSection, iColumn, i)
                                      ]
                                        ? "green"
                                        : "red",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      showExplanation(field.explanation)
                                    }
                                  >
                                    {!field.shown && getPlainValue(field.value)}
                                  </p>
                                )}
                              </>
                            ))}
                          </div>
                          {section.includeQuestionMark &&
                            iColumn + 1 === section.columns.length && (
                              <div className="et16-column">
                                {shouldShowColumnTitle(section) && (
                                  <h5 style={{ textAlign: "center" }}></h5>
                                )}
                                {column.fields.map((_, i) => (
                                  <>
                                    <p
                                      className="et16-column-value"
                                      key={`cv-${getIndex(
                                        iGroup,
                                        iSection,
                                        iColumn,
                                        i
                                      )}`}
                                    >
                                      ?
                                    </p>
                                    {shouldShowAnswer() && (
                                      <p className="et16-column-answer"></p>
                                    )}
                                  </>
                                ))}
                              </div>
                            )}
                        </>
                      ))}
                    </div>
                  </div>
                ))}
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
});
