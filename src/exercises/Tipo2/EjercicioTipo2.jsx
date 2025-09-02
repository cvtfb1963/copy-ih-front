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
import "./ejercicioTipo2.css";

export const ejemploTipo2 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 2,
  number: 76,
  unidad: 5,
  title: "Titulo del ejercicio",
  description: "descipcion o consigna...",
  sections: [
    {
      title: "AFFIRMATIVE",
      left: ["Singular", "Plural"],
      top: ["PAST SIMPLE", "PRESENT SIMPLE", "FUTURE SIMPLE"],
      rows: [
        {
          fields: [
            {
              shown: true,
              answer: "There was",
            },
            {
              shown: false,
              answer: "correcta",
              answer2: "otra respuesta correcta",
              answer3: "esta tambien",
              explanation: "Esta es una explicacion",
            },
            {
              shown: false,
              answer: "correcta",
              options: ["option 1", "correcta", "option 3"],
            },
          ],
        },
        {
          fields: [
            {
              shown: false,
              answer: "correcta",
            },
            {
              shown: true,
              answer: "There are",
            },
            {
              shown: false,
              answer: "correcta",
            },
          ],
        },
      ],
    },
    {
      title: "NEGATIVE",
      left: ["Singular", "Plural"],
      top: ["PAST SIMPLE", "PRESENT SIMPLE", "FUTURE SIMPLE"],
      rows: [
        {
          fields: [
            {
              shown: false,
              answer: "correcta",
            },
            {
              shown: true,
              answer: "There is not",
            },
            {
              shown: true,
              answer: "There will not be",
            },
          ],
        },
        {
          fields: [
            {
              shown: false,
              answer: "correcta",
            },
            {
              shown: false,
              answer: "correcta",
            },
            {
              shown: false,
              answer: "correcta",
            },
          ],
        },
      ],
    },
    {
      title: "INTERROGATIVE",
      left: ["Singular", "Plural"],
      top: ["PAST SIMPLE", "PRESENT SIMPLE", "FUTURE SIMPLE"],
      rows: [
        {
          fields: [
            {
              shown: true,
              answer: "Was there?",
            },
            {
              shown: false,
              answer: "correcta",
              includeQuestionMark: true,
            },
            {
              shown: false,
              answer: "correcta",
              includeQuestionMark: true,
            },
          ],
        },
        {
          fields: [
            {
              shown: false,
              answer: "correcta",
              includeQuestionMark: true,
            },
            {
              shown: false,
              answer: "prueba",
              includeQuestionMark: true,
            },
            {
              shown: false,
              answer: "correcta",
              includeQuestionMark: true,
            },
          ],
        },
      ],
    },
  ],
};

export const EjercicioTipo2 = ({ ejercicio }) => {
  const initialStates = [];
  ejercicio.sections.forEach((section) =>
    section.rows.forEach((row) =>
      row.fields.forEach(() => initialStates.push(""))
    )
  );

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const isShown = (generalIndex) => {
    let current = 0;

    for (const section of ejercicio.sections) {
      for (const row of section.rows) {
        for (const field of row.fields) {
          if (current === generalIndex) return field.shown;
          else current++;
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
    ejercicio.sections.forEach((section) =>
      section.rows.forEach((row) =>
        row.fields.forEach((field) => answers.push(field))
      )
    );
    const responsesCheck = [];
    answers.forEach((answer, iAns) =>
      responsesCheck.push(
        checkAnswer(
          userResponses[iAns],
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
          2
        )
      )
    );
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

  const getIndex = (iSection, iRow, i) => {
    const sizes = [];
    ejercicio.sections
      .slice(0, iSection)
      .forEach((section) =>
        section.rows.forEach((row) => sizes.push(row.fields.length))
      );
    ejercicio.sections[iSection].rows
      .slice(0, iRow)
      .forEach((row) => sizes.push(row.fields.length));
    return sizes.reduce((a, b) => a + b, 0) + i;
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
        <div className="et2-container">
          {ejercicio.sections.map((section, iSection) => (
            <fieldset key={`section-${iSection}`}>
              <legend> {section.title} </legend>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {section.top.map((top) => (
                      <th key={top}>{top}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.left.map((left, iLeft) => (
                    <tr key={`left-${iLeft}`}>
                      <td style={{ fontWeight: 600 }}>{left}</td>
                      {iLeft < section.rows.length &&
                        section.rows[iLeft].fields.map((field, iField) => {
                          if (iField >= section.top.length) return null;
                          return (
                            <td key={`field-${field}-${iField}`}>
                              <div className="et2-field">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {field.shown ? (
                                    field.answer
                                  ) : field.options ? (
                                    <select
                                      disabled={verified}
                                      style={{
                                        border: `1px solid ${
                                          responses[
                                            getIndex(iSection, iLeft, iField)
                                          ] === ""
                                            ? "gray"
                                            : !responses[
                                                getIndex(
                                                  iSection,
                                                  iLeft,
                                                  iField
                                                )
                                              ]
                                            ? "red"
                                            : "green"
                                        }`,
                                      }}
                                      value={
                                        userResponses[
                                          getIndex(iSection, iLeft, iField)
                                        ]
                                      }
                                      onChange={({ target: { value } }) =>
                                        handleChange(
                                          getIndex(iSection, iLeft, iField),
                                          value
                                        )
                                      }
                                    >
                                      <option selected>Seleccionar</option>
                                      {field.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      style={{
                                        border: `1px solid ${
                                          responses[
                                            getIndex(iSection, iLeft, iField)
                                          ] === ""
                                            ? "gray"
                                            : !responses[
                                                getIndex(
                                                  iSection,
                                                  iLeft,
                                                  iField
                                                )
                                              ]
                                            ? "red"
                                            : "green"
                                        }`,
                                      }}
                                      value={
                                        userResponses[
                                          getIndex(iSection, iLeft, iField)
                                        ]
                                      }
                                      onChange={({ target: { value } }) =>
                                        handleChange(
                                          getIndex(iSection, iLeft, iField),
                                          value
                                        )
                                      }
                                    ></input>
                                  )}
                                  {field.includeQuestionMark && (
                                    <span style={{ marginLeft: 5 }}>?</span>
                                  )}
                                </div>
                                {shouldShowAnswer() && (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color:
                                        responses[
                                          getIndex(iSection, iLeft, iField)
                                        ] === null
                                          ? "black"
                                          : !responses[
                                              getIndex(iSection, iLeft, iField)
                                            ]
                                          ? "red"
                                          : "green",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      showExplanation(field.explanation)
                                    }
                                  >
                                    {!field.shown &&
                                      getPlainValue(field.answer)}
                                  </p>
                                )}
                              </div>
                            </td>
                          );
                        })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>
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
};
