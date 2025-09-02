import { useState } from "react";
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
import "./ejercicioTipo10.css";

const abcd = "abcdefghijklmnopqrstuvwxyz";

export const ejemploTipo10 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 10,
  number: 123,
  unidad: 5,
  title: "Titulo del ejercicio",
  description: "descipcion o consigna...",
  includeNumeration: true,
  heads: ["INFINITIVO", "PASADO", "PASADO PARTICIPIO", "SIGNIFICADO"],
  rows: [
    {
      fields: [
        {
          shown: true,
          answer: "Try on",
        },
        {
          shown: false,
          answer: "correcta",
          answer2: "otra respuesta correcta",
          answer3: "esta tambien",
          explanation: "Esta es la explicación!",
        },
        {
          shown: false,
          answer: "correcta",
        },
        {
          shown: false,
          answer: "correcta",
          options: ["correcta", "incorrecta"],
        },
      ],
    },
    {
      fields: [
        {
          shown: true,
          answer: "Put on",
        },
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
          options: ["correcta", "incorrecta"],
        },
      ],
    },
    {
      fields: [
        {
          shown: true,
          answer: "Wear",
        },
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
          options: ["correcta", "incorrecta"],
        },
      ],
    },
    {
      fields: [
        {
          shown: true,
          answer: "Do exercise",
        },
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
          options: ["correcta", "incorrecta"],
        },
      ],
    },
    {
      fields: [
        {
          shown: true,
          answer: "Work out",
        },
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
          options: ["correcta", "incorrecta"],
        },
      ],
    },
    {
      fields: [
        {
          shown: true,
          answer: "Write",
        },
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
          options: ["correcta", "incorrecta"],
        },
      ],
    },
    {
      fields: [
        {
          shown: true,
          answer: "Explain",
        },
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
          options: ["correcta", "incorrecta"],
        },
      ],
    },
  ],
};

export const EjercicioTipo10 = ({ ejercicio }) => {
  const initialStates = [];
  ejercicio.rows.forEach((row) =>
    row.fields.forEach(() => initialStates.push(""))
  );

  const [verified, setVerified] = useState(false);
  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const isShown = (generalIndex) => {
    let current = 0;

    for (const row of ejercicio.rows) {
      for (const field of row.fields) {
        if (current === generalIndex) return field.shown;
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
    const answers = [];
    ejercicio.rows.forEach((row) =>
      row.fields.forEach((field) => answers.push(field))
    );
    const responsesCheck = [];
    answers.forEach((field, iAns) =>
      responsesCheck.push(
        checkAnswer(
          userResponses[iAns],
          field.answer,
          field.answer2,
          field.answer3,
          field.answer4,
          field.answer5,
          field.answer6,
          field.answer7,
          field.answer8,
          field.answer9,
          field.answer10,
          field.answer11,
          field.answer12,
          10
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

  const getIndex = (iRow, i) => {
    const sizes = [];
    ejercicio.rows
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

        <div className="et10-container">
          <table>
            <thead>
              <tr>
                {ejercicio.heads.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ejercicio.rows.map((row, iRow) => (
                <tr key={`row-${iRow}`}>
                  {row.fields.map((field, iField) => (
                    <td key={`field-${iRow}.${iField}`}>
                      {ejercicio.includeNumeration &&
                        iField === 0 &&
                        `${abcd[iRow]}) `}
                      {field.shown ? (
                        field.answer
                      ) : field.options ? (
                        <select
                          disabled={verified}
                          style={{
                            border: `3px solid ${
                              responses[getIndex(iRow, iField)] === ""
                                ? "gray"
                                : !responses[getIndex(iRow, iField)]
                                ? "red"
                                : "green"
                            }`,
                          }}
                          onChange={({ target: { value } }) =>
                            handleChange(getIndex(iRow, iField), value)
                          }
                          value={userResponses[getIndex(iRow, iField)]}
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
                              responses[getIndex(iRow, iField)] === ""
                                ? "gray"
                                : !responses[getIndex(iRow, iField)]
                                ? "red"
                                : "green"
                            }`,
                          }}
                          value={userResponses[getIndex(iRow, iField)]}
                          onChange={({ target: { value } }) =>
                            handleChange(getIndex(iRow, iField), value)
                          }
                        ></input>
                      )}
                      {shouldShowAnswer() && (
                        <p
                          className="et1-column-answer"
                          style={{
                            lineHeight: 1,
                            color: !responses[getIndex(iRow, iField)]
                              ? "red"
                              : "green",
                            cursor: "pointer",
                          }}
                          onClick={() => showExplanation(field.explanation)}
                        >
                          {getPlainValue(field.answer)}
                        </p>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
