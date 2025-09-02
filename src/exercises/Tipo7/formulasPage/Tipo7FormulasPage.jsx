import { useEffect, useState } from "react";
import "./tipo7FormulasPage.css";
import { useSelector } from "react-redux";

export const TIPO7_BLUE = "#01a2ff";
export const TIPO7_RED = "#f14736";
export const TIPO7_GREEN = "#1eb100";

export const FORMULAS_PAGE_OPTIONS = [
  [
    "(Wh)",
    "Complemento",
    "Complemento?",
    "Did",
    "Do/does",
    "Not",
    "Sujeto",
    "Verbo infinitivo",
    "Verbo pasado",
    "Verbo presente",
    "Will",
  ],
  [
    "(Wh)",
    "Am/Are/Is",
    "Be",
    "Complemento",
    "Complemento?",
    "Going to",
    "Not",
    "Sujeto",
    "Verbo Gerundio",
    "Verbo Infinitivo",
    "Was/were",
    "Will",
  ],
  [
    "(Wh)",
    "Been",
    "Complemento",
    "Complemento?",
    "Had",
    "Have/Has",
    "Not",
    "Sujeto",
    "Verbo Gerundio",
    "Verbo Past Participle",
    "Will",
  ],
];

export const Tipo7FormulasPage = ({ onGradeChange, data, top }) => {
  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  return (
    <div className="t7fp-container">
      {!top ? (
        <ShowVerboTotal
          left={data.verboTotal.left}
          right={data.verboTotal.right}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 20,
          }}
        >
          {top.map((text, i) => (
            <p
              key={`top-${i}`}
              style={{
                color: i === 0 || i === 2 ? TIPO7_BLUE : TIPO7_RED,
                fontWeight: 900,
                margin: "5px",
                fontSize: "22px",
                marginRight: "20px",
              }}
            >
              {text}
            </p>
          ))}
        </div>
      )}
      <ShowFormulas formulas={data.showed} />
      <ToCompleteFormulaGroup
        formulas={data.toComplete}
        onGradeChange={onGradeChange}
        verified={verified}
        options={data.options}
      />
    </div>
  );
};

const ShowVerboTotal = ({ left, right }) => {
  return (
    <div className="t7fp-vt-container">
      <div>
        <div>
          <BlackBar color={TIPO7_BLUE}>{left}</BlackBar>
          <BlackBar color={TIPO7_BLUE} black>
            Auxiliar
          </BlackBar>
        </div>
        <p style={{ margin: "20px" }}>+</p>
        <div>
          {!Array.isArray(right) ? (
            <BlackBar color={TIPO7_RED}>{right}</BlackBar>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              {right.map((text, i, arr) => (
                <>
                  <BlackBar key={`text-${text}- ${i}`} color={TIPO7_RED}>
                    {text}
                  </BlackBar>
                  {i + 1 < arr.length && <p style={{ margin: "0 6px" }}>+</p>}
                </>
              ))}
            </div>
          )}

          <BlackBar color={TIPO7_RED} black>
            Verbo Restante (Vr)
          </BlackBar>
        </div>
      </div>
      <hr />
      <BlackBar color="#0076ba" black bigger>
        Verbo Total (Vt)
      </BlackBar>
    </div>
  );
};

export const BlackBar = ({ children, color, black, bigger }) => (
  <p
    style={{
      color,
      fontWeight: black && 900,
      fontSize: bigger && "20px",
      textAlign: "center",
    }}
  >
    {children?.split(" ")?.map((part, i) =>
      part === "/" || part === "+" ? (
        <span key={`part-${i}`} style={{ color: "black" }}>
          {part}
        </span>
      ) : (
        ` ${part} `
      )
    )}
  </p>
);

const ShowFormulas = ({ formulas }) => {
  return (
    <div className="t7fp-sf-container">
      {formulas?.map((formula, i) => (
        <ShowedFormula
          key={i}
          formula={formula}
          title={i === 0 ? "Aff" : i === 1 ? "Neg" : "?"}
          color={i === 0 ? TIPO7_BLUE : i === 1 ? TIPO7_RED : TIPO7_GREEN}
        />
      ))}
    </div>
  );
};

const ShowedFormula = ({ formula, color, title }) => {
  return (
    <div className="t7fp-sf" style={{ color }}>
      <span style={{ color: "black" }}>{title}:</span>
      {formula.map((part, i, arr) => (
        <>
          <p key={part} style={{ margin: "5px" }}>
            {" "}
            {part}{" "}
          </p>
          {i + 1 < arr.length && (
            <span style={{ color: "black", margin: 1 }}>+</span>
          )}
        </>
      ))}
    </div>
  );
};

const ToCompleteFormulaGroup = ({
  formulas,
  onGradeChange,
  verified,
  options,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [grades, setGrades] = useState(formulas.map(() => 0));

  const handleGradeChange = (i, value) => {
    setGrades((old) => {
      const data = [...old];
      data[i] = value;

      const asideGrade = data.reduce((a, b) => a + b, 0) / formulas.length;
      onGradeChange(asideGrade);

      return data;
    });
  };

  return (
    <div className="t7fp-sf-container">
      {formulas?.map((formula, i) => (
        <ToCompleteFormula
          key={i}
          formula={formula}
          title={i === 0 ? "Aff" : i === 1 ? "Neg" : "?"}
          color={i === 0 ? TIPO7_BLUE : i === 1 ? TIPO7_RED : TIPO7_GREEN}
          onGradeChange={(grade) => handleGradeChange(i, grade)}
          removeMarginTop={i !== 0}
          verified={verified}
          options={options}
        />
      ))}
    </div>
  );
};

const ToCompleteFormula = ({
  formula,
  title,
  color,
  verified,
  onGradeChange,
  removeMarginTop,
  options,
}) => {
  const [responses, setResponses] = useState(formula.map(() => ""));
  const [userResponses, setUserResponses] = useState(
    formula.map(() => "Elegir")
  );

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      const data = [...old];
      data[i] = value;
      return data;
    });
  };

  useEffect(() => {
    const results = [];
    userResponses.forEach((res, i) => {
      results.push(res === formula[i]);
    });

    const grade = results.filter((x) => x).length / results.length;
    onGradeChange(grade);

    setResponses(results);
  }, [userResponses]);

  useEffect(() => {
    if (!verified) {
      setResponses(formula.map(() => ""));
      setUserResponses(formula.map(() => "Elegir"));
    }
  }, [verified]);

  return (
    <div
      className="aside-formula"
      style={{ color, marginTop: removeMarginTop && 0 }}
    >
      <span style={{ fontSize: "16px", width: 50 }}>
        {title}
        {` `}
        <span style={{ color: "#000", marginRight: 10 }}>:</span>
      </span>

      {formula.map((part, i, arr) => (
        <>
          <div className="tipo7AutoSelect">
            <select
              disabled={verified}
              style={{
                color: color,
                border: `${verified ? "2px" : "1px"} solid ${
                  !verified ? "gray" : !responses[i] ? "red" : "green"
                }`,
                background: !verified
                  ? ""
                  : !responses[i]
                  ? "rgb(255, 0, 0, 0.2)"
                  : "rgb(0, 255, 0, 0.2)",
                fontSize: "16px",
              }}
              className="tipo7Select"
              onChange={({ target: { value } }) => handleChange(i, value)}
              value={userResponses[i]}
            >
              <option value={"Elegir"} style={{ display: "none" }}>
                Elegir
              </option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {i + 1 < arr.length && (
            <span style={{ color: "#000", margin: 5 }}>+</span>
          )}
        </>
      ))}
    </div>
  );
};
