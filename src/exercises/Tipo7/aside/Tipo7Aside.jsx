import { useEffect, useState } from "react";
import "./tipo7Aside.css";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import { useSelector } from "react-redux";
import {
  TIPO7_BLUE,
  TIPO7_GREEN,
  TIPO7_RED,
} from "../formulasPage/Tipo7FormulasPage";

const FORMULA_OPTIONS = ["(Wh_)", "Aux", "C", "C?", "Not", "Suj", "Vr", "Vt"];

const PIRAMIDE_OPTIONS = ["Be", "Have", "Inf", "P.Part", "V.(ing)", "Will"];

export const DEFAULT_ASIDE_FORMULAS = [
  ["Suj", "Vt", "C"],
  ["Aux", "Vr"],
  ["Suj", "Aux", "Not", "Vr", "C"],
  ["(Wh_)", "Aux", "Suj", "Vr", "C?"],
];

const DEFAULT_ASIDE_PIRAMIDES = [
  { izquierda: "Will", derecha: "Inf" },
  { izquierda: "Have", derecha: "P.Part" },
  { izquierda: "Be", derecha: "V.(ing)" },
];

export const getFormulasPageData = (template) => {
  const showed = template?.aside?.formulas
    ? [
        template.aside.formulas[0],
        template.aside.formulas[2],
        template.aside.formulas[3],
      ]
    : [
        DEFAULT_ASIDE_FORMULAS[0],
        DEFAULT_ASIDE_FORMULAS[2],
        DEFAULT_ASIDE_FORMULAS[3],
      ];
  return {
    ...template.formulasPage,
    verboTotal: template.center.verboTotal,
    showed,
  };
};

export const Tipo7Aside = ({ verified, aside, onGradeChange }) => {
  if (!aside) aside = {};

  if (!aside.formulas) aside.formulas = DEFAULT_ASIDE_FORMULAS;
  if (!aside.piramides) aside.piramides = DEFAULT_ASIDE_PIRAMIDES;

  const formulasLength = aside?.formulas?.length ?? 0;
  const piramidesLength = aside?.piramides?.length ?? 0;
  const totalLength = formulasLength + piramidesLength;
  const initialGrades = Array(totalLength).fill(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks, no-unused-vars
  const [grades, setGrades] = useState(initialGrades);

  const handleGradeChange = (i, value) => {
    setGrades((old) => {
      const data = [...old];
      data[i] = value;

      const topGrade =
        data.slice(0, formulasLength).reduce((a, b) => a + b, 0) /
        formulasLength;
      const bottomGrade =
        data.slice(formulasLength).reduce((a, b) => a + b, 0) / piramidesLength;

      const asideGrade = topGrade * 0.8 + bottomGrade * 0.2;
      onGradeChange(asideGrade);

      return data;
    });
  };

  return (
    <div className="tipo7Aside">
      {aside?.formulas?.map((formula, i) => (
        <Formula
          key={`formula-${i}`}
          formula={formula}
          verified={verified}
          onGradeChange={(grade) => handleGradeChange(i, grade)}
          removeMarginTop={i !== 0}
          title={i === 0 ? "Aff" : i === 1 ? "*Vt" : i === 2 ? "Neg" : "?"}
          color={
            i === 0 || i === 1 ? TIPO7_BLUE : i === 2 ? TIPO7_RED : TIPO7_GREEN
          }
        />
      ))}
      {aside?.piramides?.map((piramide, i) => (
        <PiramideSimple
          key={`piramide-${i}`}
          piramide={piramide}
          verified={verified}
          onGradeChange={(grade) =>
            handleGradeChange(formulasLength + i, grade)
          }
          removeMarginTop={aside?.formulas?.length > 0 || i !== 0}
          title={i === 0 ? "Future" : i === 1 ? "Perfect" : "Continouos"}
          color={i === 0 ? TIPO7_RED : i === 1 ? TIPO7_GREEN : TIPO7_BLUE}
        />
      ))}
    </div>
  );
};

const Formula = ({
  formula,
  verified,
  onGradeChange,
  removeMarginTop,
  color,
  title,
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
      <span>{title}</span>
      <span style={{ color: "#000", marginRight: 2 }}>:</span>
      {formula.map((part, i, arr) => (
        <>
          <select
            disabled={verified}
            style={{
              color,
              border: `${verified ? "2px" : "1px"} solid ${
                !verified ? "gray" : !responses[i] ? "red" : "green"
              }`,
              background: !verified
                ? "transparent"
                : !responses[i]
                ? "rgb(255, 0, 0, 0.1)"
                : "rgb(0, 255, 0, 0.1)",
            }}
            className="tipo7Select"
            onChange={({ target: { value } }) => handleChange(i, value)}
            value={userResponses[i]}
          >
            <option value={"Elegir"} style={{ display: "none" }}>
              Elegir
            </option>
            {FORMULA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {i + 1 < arr.length && (
            <span style={{ color: "#000", margin: 1 }}>+</span>
          )}
        </>
      ))}
    </div>
  );
};

export const PiramideSimple = ({
  piramide,
  verified,
  onGradeChange,
  removeMarginTop,
  title,
  color,
}) => {
  const [userResponses, setUserResponses] = useState(["Elegir", "Elegir"]);

  const handleChange = (i, value) => {
    setUserResponses((old) => {
      const data = [...old];
      data[i] = value;
      return data;
    });
  };

  useEffect(() => {
    const results = [];
    results.push(userResponses[0] === piramide.izquierda);
    results.push(userResponses[1] === piramide.derecha);

    const grade = results.filter((x) => x).length / results.length;
    onGradeChange(grade);
  }, [userResponses]);

  useEffect(() => {
    if (!verified) {
      setUserResponses(["Elegir", "Elegir"]);
    }
  }, [verified]);

  const initialSchema = createSchema({
    nodes: [
      {
        id: "center",
        coordinates: [80, 20],
        render: EmptyElement,
      },
      {
        id: "title",
        content: title,
        coordinates: [0, 0],
        disableDrag: true,
        render: TitleNode,
        data: { color },
      },
      {
        id: "izquierda",
        content: piramide.izquierda,
        coordinates: [0, 50],
        disableDrag: true,
        data: {
          color,
          handleChange,
          i: 0,
        },
        render: PiramideBaseNode,
      },
      {
        id: "derecha",
        content: piramide.derecha,
        coordinates: [100, 50],
        disableDrag: true,
        data: {
          color,
          handleChange,
          i: 1,
        },
        render: PiramideBaseNode,
      },
    ],
    links: [
      { input: "center", output: "izquierda", readonly: true },
      { input: "center", output: "derecha", readonly: true },
    ],
  });

  const [schema, { onChange }] = useSchema(initialSchema);

  return (
    <div className="aside-piramide" style={{ marginTop: removeMarginTop && 0 }}>
      <Diagram schema={schema} onChange={onChange} className="diagram" />
    </div>
  );
};

const TitleNode = (props) => {
  const {
    content,
    data: { color },
  } = props;

  return (
    <div
      style={{
        background: "lightcyan",
        padding: "6px",
        borderRadius: "20px",
        width: "165px",
        color,
        border: "3px solid lightgray",
      }}
    >
      <h3 style={{ width: "100%", textAlign: "center", lineHeight: 1 }}>
        {content}
      </h3>
    </div>
  );
};

export const PiramideBaseNode = (props) => {
  const {
    data: { color, handleChange, i },
    content: response,
  } = props;
  const [selected, setSelected] = useState("Elegir");

  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  useEffect(() => {
    if (!verified) {
      handleChange(i, "Elegir");
      setSelected("Elegir");
    }
  }, [verified]);

  return (
    <div
      style={{
        background: "white",
        height: verified ? "17px" : "16px",
        overflow: "hidden",
      }}
    >
      <select
        disabled={verified}
        onChange={({ target: { value } }) => {
          handleChange(i, value);
          setSelected(value);
        }}
        className="tipo7Select"
        style={{
          color,
          width: "80px",
          border: `${verified ? "2px" : "1px"} solid ${
            !verified ? "gray" : selected !== response ? "red" : "green"
          }`,
          position: "relative",
          top: -5,
          background: !verified
            ? "transparent"
            : selected !== response
            ? "rgb(255, 0, 0, 0.1)"
            : "rgb(0, 255, 0, 0.1)",
        }}
        value={selected}
      >
        <option value={"Elegir"} style={{ display: "none" }}>
          Elegir
        </option>
        {PIRAMIDE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export const EmptyElement = () => <></>;
