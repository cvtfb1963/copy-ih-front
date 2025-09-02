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
import "./ejercicioTipo1.css";

const COMMON_SELECT_OPTIONS = [
  "Adjetivo",
  "Adverbio",
  "Artículo",
  "Conjunción",
  "Preposición",
  "Pronombre",
  "Sustantivo",
  "Verbo",
];

export const ejemploTipo1 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 1,
  number: 5,
  unidad: 0.1,
  title: "Conocimientos Elementales",
  description:
    "Completa la tabla de conjugación de BE en Inglés y su equivalente SER y ESTAR en Castellano en presente en ambos casos",
  sections: [
    {
      includeSeparator: 4,
      columns: [
        {
          title: "SUJETO",
          fields: [
            {
              shown: true,
              value: "I",
            },
            {
              shown: false,
              value: "You",
            },
            {
              shown: true,
              value: "He",
            },
            {
              shown: true,
              value: "She",
            },
            {
              shown: false,
              value: "It",
            },
            {
              shown: true,
              value: "We",
            },
            {
              shown: false,
              value: "You",
            },
            {
              shown: false,
              value: "They",
            },
          ],
        },
        {
          title: "BE",
          fields: [
            {
              shown: true,
              value: "am",
            },
            {
              shown: false,
              value: "are",
            },
            {
              shown: true,
              value: "is",
            },
            {
              shown: false,
              value: "is",
            },
            {
              shown: true,
              value: "is",
            },
            {
              shown: false,
              value: "are",
            },
            {
              shown: true,
              value: "are",
            },
            {
              shown: false,
              value: "are",
            },
          ],
        },
        {
          title: "SUJETO",
          fields: [
            {
              shown: true,
              value: "Yo",
            },
            {
              shown: true,
              value: "Tú",
            },
            {
              shown: true,
              value: "Él",
            },
            {
              shown: false,
              value: "Ella",
            },
            {
              shown: true,
              value: "Ello",
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
          title: "SER",
          fields: [
            {
              shown: true,
              value: "soy",
            },
            {
              shown: false,
              value: "eres",
            },
            {
              shown: false,
              value: "es",
            },
            {
              shown: false,
              value: "es",
            },
            {
              shown: false,
              value: "es",
            },
            {
              shown: false,
              value: "somos",
            },
            {
              shown: true,
              value: "sois",
            },
            {
              shown: false,
              value: "son",
            },
          ],
        },
        {
          title: "ESTAR",
          fields: [
            {
              shown: true,
              value: "estoy",
            },
            {
              shown: false,
              value: "estás",
            },
            {
              shown: false,
              value: "está",
            },
            {
              shown: false,
              value: "está",
            },
            {
              shown: false,
              value: "está",
            },
            {
              shown: false,
              value: "estamos",
            },
            {
              shown: true,
              value: "estáis",
            },
            {
              shown: false,
              value: "están",
            },
          ],
        },
      ],
    },
  ],
};
export const EjercicioTipo1 = React.memo(({ ejercicio }) => {
  const initialStates = [];
  ejercicio.sections.forEach((section) =>
    section.columns.forEach((column) =>
      column.fields.forEach(() => initialStates.push(""))
    )
  );
  const totalFields = initialStates.length;

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState([...initialStates]);
  const [userResponses, setUserResponses] = useState([...initialStates]);
  const shouldShowColumnTitle = (section) =>
    section.columns.some((column) => column.title);

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const isShown = (generalIndex) => getFieldByIndex(generalIndex).shown;

  const getFieldByIndex = (generalIndex) => {
    let current = 0;

    for (const section of ejercicio.sections) {
      for (const column of section.columns) {
        for (const field of column.fields) {
          if (current === generalIndex) return field;
          else current++;
        }
      }
    }
  };

  const getFieldAndColumnByIndex = (generalIndex) => {
    let current = 0;

    for (const section of ejercicio.sections) {
      for (let iColumn = 0; iColumn < section.columns.length; iColumn++) {
        const column = section.columns[iColumn];
        for (let iField = 0; iField < column.fields.length; iField++) {
          const field = column.fields[iField];

          const hasPreviousColumn = iColumn - 1 >= 0;
          const hasNextColumn = iColumn + 1 < section.columns.length;
          const columnLength = column.fields.length;
          const sectionColumnsCount = section.columns.length;

          if (current === generalIndex)
            return {
              field,
              column,
              hasNextColumn,
              columnLength,
              hasPreviousColumn,
              sectionColumnsCount,
            };
          else current++;
        }
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key !== "Tab" || !e.target.id.includes("ej1-i-")) return;

    e.preventDefault();

    const i = Number(e.target.id.substring(6));

    const nextFocusableIndex = getNextFocusableIndex(i, e.shiftKey);

    if (nextFocusableIndex !== null) focusByIndex(nextFocusableIndex);
  };

  const getNextFocusableIndex = (i, goingBack) => {
    while (i < totalFields) {
      const {
        field,
        column,
        columnLength,
        hasNextColumn,
        hasPreviousColumn,
        sectionColumnsCount,
      } = getFieldAndColumnByIndex(i);
      const positionInColumn = column.fields.indexOf(field);

      const params = {
        i,
        columnLength,
        positionInColumn,
        hasNextColumn,
        hasPreviousColumn,
        sectionColumnsCount,
      };

      let nextIndex = !goingBack
        ? getNextOrderIndex(params)
        : getPreviousOrderIndex(params);

      if (!isShown(nextIndex)) return nextIndex;
      i = nextIndex;
    }
    return null;
  };

  const getPreviousOrderIndex = ({
    i,
    columnLength,
    positionInColumn,
    hasNextColumn,
    hasPreviousColumn,
    sectionColumnsCount,
  }) => {
    let nextIndex = 0;

    if (hasPreviousColumn) nextIndex = i - columnLength;
    else if (positionInColumn === 0 && !hasPreviousColumn) nextIndex = i - 1;
    else if (!hasPreviousColumn && hasNextColumn)
      nextIndex = i + columnLength * (sectionColumnsCount - 1) - 1;
    else if (!hasNextColumn) nextIndex = i - 1;

    return nextIndex;
  };

  const getNextOrderIndex = ({
    i,
    columnLength,
    positionInColumn,
    hasNextColumn,
    hasPreviousColumn,
    sectionColumnsCount,
  }) => {
    let nextIndex = totalFields - 1;

    if (hasNextColumn) nextIndex = i + columnLength;
    else if (positionInColumn + 1 === columnLength && !hasNextColumn)
      nextIndex = i + 1;
    else if (!hasNextColumn && hasPreviousColumn)
      nextIndex = i - columnLength * (sectionColumnsCount - 1) + 1;
    else if (!hasPreviousColumn) nextIndex = i + 1;

    return nextIndex;
  };

  const focusByIndex = (index) =>
    document.getElementById(`ej1-i-${index}`).focus();

  const showAndSaveGrade = (results) => {
    const computableResults = results.filter((_, i) => !isShown(i));
    const total = computableResults.length;
    const successes = computableResults.filter((x) => x).length;

    const grade = successes / total;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const getIndex = (iSection, iColumn, i) => {
    const sizes = [];
    ejercicio.sections
      .slice(0, iSection)
      .forEach((section) =>
        section.columns.forEach((column) => sizes.push(column.fields.length))
      );
    ejercicio.sections[iSection].columns
      .slice(0, iColumn)
      .forEach((column) => sizes.push(column.fields.length));
    return sizes.reduce((a, b) => a + b, 0) + i;
  };

  const handleVerify = () => {
    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const answers = [];
    ejercicio.sections.forEach((section) =>
      section.columns.forEach((column) =>
        column.fields.forEach((field) => answers.push(field))
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
          1
        )
      );
    });

    localStorage.removeItem("is_vocabulary_exercise");

    setResponses(responsesCheck);
    setVerified(true);

    showAndSaveGrade(responsesCheck);
  };

  const handleReset = () => {
    setUserResponses([...initialStates]);
    setResponses([...initialStates]);
    setVerified(false);
  };

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      const copy = [...old];
      copy[i] = value;
      return copy;
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
    <div className="gramatica-page" onKeyDown={onKeyDown}>
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <div className="et1-container">
          {ejercicio.sections.map((section, iSection) => (
            <div key={iSection}>
              {section.title && (
                <h4 style={{ textAlign: "center" }}>{section.title}</h4>
              )}
              <div>
                {section.columns.map((column, iColumn) => (
                  <>
                    {section.includePronouns === iColumn && (
                      <div className="et1-column">
                        {shouldShowColumnTitle(section) && (
                          <h5 style={{ textAlign: "center" }}>Pronombres</h5>
                        )}
                        {PRONOUNS.map((pronoun) => (
                          <>
                            <p key={pronoun} className="et1-column-value">
                              {pronoun}
                            </p>
                            {shouldShowAnswer() && (
                              <p className="et1-column-answer"></p>
                            )}
                          </>
                        ))}
                      </div>
                    )}
                    {section.includeSeparator === iColumn && (
                      <div className="et1-column">
                        {shouldShowColumnTitle(section) && (
                          <h5 style={{ textAlign: "center" }}>/</h5>
                        )}
                        {column.fields.map((_, i) => {
                          return (
                            <>
                              <p
                                key={`-/-${i}`}
                                className="et1-column-value"
                                style={{ fontWeight: 600 }}
                              >
                                /
                              </p>
                              {shouldShowAnswer() && (
                                <p className="et1-column-answer"></p>
                              )}
                            </>
                          );
                        })}
                      </div>
                    )}
                    <div className="et1-column">
                      {shouldShowColumnTitle(section) && (
                        <h5 style={{ textAlign: "center" }}>{column.title}</h5>
                      )}
                      {column.fields.map((field, i) => (
                        <>
                          <div
                            key={`field-${getIndex(iSection, iColumn, i)}`}
                            className="et1-column-value"
                          >
                            {field.shown ? (
                              <p
                                key={`field-s-${getIndex(
                                  iSection,
                                  iColumn,
                                  i
                                )}`}
                                style={{
                                  width: "100px",
                                  fontSize: getFontSize(field.value.length),
                                }}
                              >
                                {field.value}
                              </p>
                            ) : !field.useCommonSelect ? (
                              <input
                                key={`input-${getIndex(iSection, iColumn, i)}`}
                                id={`ej1-i-${getIndex(iSection, iColumn, i)}`}
                                style={{
                                  border: `2px solid ${
                                    responses[
                                      getIndex(iSection, iColumn, i)
                                    ] === ""
                                      ? "gray"
                                      : !responses[
                                          getIndex(iSection, iColumn, i)
                                        ]
                                      ? "red"
                                      : "green"
                                  }`,
                                }}
                                value={
                                  userResponses[getIndex(iSection, iColumn, i)]
                                }
                                disabled={verified}
                                onChange={({ target: { value } }) =>
                                  handleChange(
                                    getIndex(iSection, iColumn, i),
                                    value
                                  )
                                }
                              />
                            ) : (
                              <select
                                id={`ej1-i-${getIndex(iSection, iColumn, i)}`}
                                style={{
                                  border: `2px solid ${
                                    responses[
                                      getIndex(iSection, iColumn, i)
                                    ] === ""
                                      ? "gray"
                                      : !responses[
                                          getIndex(iSection, iColumn, i)
                                        ]
                                      ? "red"
                                      : "green"
                                  }`,
                                }}
                                value={
                                  userResponses[getIndex(iSection, iColumn, i)]
                                }
                                disabled={verified}
                                onChange={({ target: { value } }) =>
                                  handleChange(
                                    getIndex(iSection, iColumn, i),
                                    value
                                  )
                                }
                              >
                                <option style={{ display: "none" }}>
                                  Elegir
                                </option>
                                {COMMON_SELECT_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                          {shouldShowAnswer() && (
                            <p
                              className="et1-column-answer"
                              style={{
                                color: responses[getIndex(iSection, iColumn, i)]
                                  ? "green"
                                  : "red",
                                cursor: "pointer",
                              }}
                              onClick={() => showExplanation(field.explanation)}
                            >
                              {!field.shown && getPlainValue(field.value)}
                            </p>
                          )}
                        </>
                      ))}
                    </div>
                    {section.includeQuestionMark &&
                      iColumn + 1 === section.columns.length && (
                        <div className="et1-column">
                          {shouldShowColumnTitle(section) && (
                            <h5 style={{ textAlign: "center" }}></h5>
                          )}
                          {column.fields.map(() => (
                            <>
                              <p className="et1-column-value">?</p>
                              {shouldShowAnswer() && (
                                <p className="et1-column-answer"></p>
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
        <ExerciseControl
          handleReset={handleReset}
          handleVerify={handleVerify}
          verified={verified}
        />
      </div>
    </div>
  );
});
