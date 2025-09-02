import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TitleRenderer } from "../../../components/DescriptionRenderer/DescriptionRenderer";
import { FloatingVideo } from "../../../components/FloatingVideo/FloatingVideo";
import { Tipo7Control } from "../../../components/Tipo7Control/Tipo7Control";
import { EXPLANATION_VIDEOS } from "../../../constants/ejerciciosData";
import { Tipo7Aside, getFormulasPageData } from "../../Tipo7/aside/Tipo7Aside";
import {
  TIPO7_BLUE,
  TIPO7_RED,
  Tipo7FormulasPage,
} from "../../Tipo7/formulasPage/Tipo7FormulasPage";

const pantalla1options = [
  "Did",
  "Do / Does",
  "Verbo (infinitivo)",
  "Verbo (past)",
  "Verbo (present)",
  "Will",
  "Present",
  "Past",
];

const pantalla2options = [
  "(Wh_)",
  "Complemento",
  "Complemento?",
  "Did",
  "Do / Does",
  "Not",
  "Sujeto",
  "Verbo (Inf.)",
  "Verbo (Past)",
  "Verbo (Present)",
  "Will",
];

const template = {
  title: "Past Simple",
  template: 5,
  center: ["Past", "Did", "Verbo (infinitivo)", "Verbo (past)"],
  top: ["Aux: Did", "Verbo Restante: V. (inf)", "Verbo total: Past"],
  formulasPage: {
    toComplete: [
      ["Sujeto", "Verbo (Past)", "Complemento"],
      ["Sujeto", "Did", "Not", "Verbo (Inf.)", "Complemento"],
      ["(Wh_)", "Did", "Sujeto", "Verbo (Inf.)", "Complemento?"],
    ],
    options: pantalla2options,
  },
};

const centerInitialGrades =
  template?.center?.initialGrades ?? Array(template?.center?.length).fill(0);

export const Tipo7Template5 = () => {
  //grades:                            [aside, center, formulaPage]
  const [grades, setGrades] = useState([0, 0, 0]);
  const [step, setStep] = useState(0);
  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  const [centerResponses, setCenterResponses] = useState(centerInitialGrades);
  const [centerResponsesResult, setCenterResponsesResult] =
    useState(centerInitialGrades);

  useEffect(() => {
    if (!verified && step !== 2) {
      setGrades([0, 0, 0]);
      setCenterResponses(centerInitialGrades);
      setCenterResponsesResult(centerInitialGrades);
    }
  }, [verified]);

  const handleCenterChange = (i, value) => {
    setCenterResponses((old) => {
      const data = [...old];
      data[i] = value;

      const results = [];

      data.forEach((selected, i) =>
        results.push(selected === template.center[i])
      );

      setCenterResponsesResult(results);

      const corrects = results.filter((x) => x).length;
      const total = results.length;
      const grade = corrects / total;
      setGrades((old) => {
        const data = [...old];
        data[1] = grade;
        return data;
      });

      return data;
    });
  };

  const onGradeChange = (i, grade) => {
    setGrades((old) => {
      const data = [...old];
      data[i] = grade;
      return data;
    });
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo
          videoID={EXPLANATION_VIDEOS[7.5] ?? EXPLANATION_VIDEOS[7]}
          removeMarginBottom
        />
        {step < 2 ? (
          <div className="et7-container">
            <Tipo7Aside
              aside={template.aside}
              verified={verified}
              onGradeChange={(grade) => onGradeChange(0, grade)}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "20px",
                  }}
                >
                  <h1 style={{ color: TIPO7_RED }}>PAST</h1>
                  <div
                    style={{
                      width: "1px",
                      height: "50px",
                      background: "black",
                    }}
                  ></div>
                  <select
                    disabled={verified}
                    style={{
                      color: TIPO7_BLUE,
                      border: `${verified ? "2px" : "1px"} solid ${
                        !verified
                          ? "gray"
                          : !centerResponsesResult[0]
                          ? "red"
                          : "green"
                      }`,
                      background: !verified
                        ? "transparent"
                        : !centerResponsesResult[0]
                        ? "rgb(255, 0, 0, 0.1)"
                        : "rgb(0, 255, 0, 0.1)",
                      width: "200px",
                      fontSize: "20px",
                    }}
                    className="tipo7Select"
                    onChange={({ target: { value } }) =>
                      handleCenterChange(0, value)
                    }
                    value={centerResponses[0]}
                  >
                    <option value={"Elegir"} style={{ display: "none" }}>
                      Elegir
                    </option>
                    {pantalla1options.map((option, i) => (
                      <option value={option} key={`p1-o-${i}`}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <h1 style={{ color: TIPO7_BLUE, margin: "20px" }}>
                  <del>SIMPLE</del>
                </h1>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 20,
                }}
              >
                {template.center.slice(1).map((res, i) => (
                  <div
                    key={`center-${i}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        color: i === 0 || i === 2 ? TIPO7_BLUE : TIPO7_RED,
                        fontWeight: 900,
                        margin: "5px",
                        fontSize: "22px",
                        marginRight: "20px",
                      }}
                    >
                      {i === 0
                        ? "Auxiliar"
                        : i === 1
                        ? "Verbo Restante"
                        : "Verbo Total"}
                      {": "}
                    </p>
                    <select
                      disabled={verified}
                      style={{
                        color: i === 0 || i === 2 ? TIPO7_BLUE : TIPO7_RED,
                        border: `${verified ? "2px" : "1px"} solid ${
                          !verified
                            ? "gray"
                            : !centerResponsesResult[i + 1]
                            ? "red"
                            : "green"
                        }`,
                        background: !verified
                          ? "transparent"
                          : !centerResponsesResult[i + 1]
                          ? "rgb(255, 0, 0, 0.1)"
                          : "rgb(0, 255, 0, 0.1)",
                        width: "200px",
                        fontSize: "20px",
                      }}
                      className="tipo7Select"
                      onChange={({ target: { value } }) =>
                        handleCenterChange(i + 1, value)
                      }
                      value={centerResponses[i + 1]}
                    >
                      <option value={"Elegir"} style={{ display: "none" }}>
                        Elegir
                      </option>
                      {pantalla1options.map((option, i) => (
                        <option value={option} key={`p1-o-${i}`}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <Tipo7FormulasPage
              onGradeChange={(grade) => onGradeChange(2, grade)}
              data={getFormulasPageData(template)}
              top={template.top}
              template={template.template}
            />
          </div>
        )}
        <Tipo7Control setStep={setStep} grades={grades} step={step} />
      </div>
    </div>
  );
};
