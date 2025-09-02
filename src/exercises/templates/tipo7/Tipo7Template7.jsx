import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TitleRenderer } from "../../../components/DescriptionRenderer/DescriptionRenderer";
import { FloatingVideo } from "../../../components/FloatingVideo/FloatingVideo";
import { Tipo7Control } from "../../../components/Tipo7Control/Tipo7Control";
import { EXPLANATION_VIDEOS } from "../../../constants/ejerciciosData";
import {
  EmptyElement,
  Tipo7Aside,
  getFormulasPageData,
} from "../../Tipo7/aside/Tipo7Aside";
import {
  TIPO7_BLUE,
  TIPO7_GREEN,
  TIPO7_RED,
  Tipo7FormulasPage,
} from "../../Tipo7/formulasPage/Tipo7FormulasPage";
import {
  T7TCompleteVerboTotal,
  T7TMultiSelectNode1,
  T7TSimpleSelectNode,
  T7TTitleNode,
} from "./tipo7TemplatesCommon";

const pantalla1options = [
  "Be",
  "Been",
  "Had",
  "Have",
  "Have / Has",
  "Inf.",
  "Past",
  "Past Part.",
  "Present",
  "V.(ing)",
  "Will",
];

const pantalla2options = [
  "(Wh_)",
  "Been",
  "Complemento",
  "Complemento?",
  "Had",
  "Have",
  "Have / Has",
  "Not",
  "Suj.",
  "V.(Past Part.)",
  "V.(ing)",
  "Will",
];

const template = {
  title: "Past Perfect Simple",
  template: 7,
  center: {
    //verbo total usa un solo lugar promediando sus 5 opciones
    initialGrades: [0, 0, 0, 0, 0],
    piramides: {
      1: "Past",
      2: "Have",
      3: "Had",
      4: "Past Part.",
    },
    options: pantalla1options,
    verboTotal: {
      left: "Had",
      right: "Past Part.",
      options: pantalla1options,
    },
  },
  formulasPage: {
    toComplete: [
      ["Suj.", "Had", "V.(Past Part.)", "Complemento"],
      ["Suj.", "Had", "Not", "V.(Past Part.)", "Complemento"],
      ["(Wh_)", "Had", "Suj.", "V.(Past Part.)", "Complemento?"],
    ],
    options: pantalla2options,
  },
};

const centerInitialGrades =
  template?.center?.initialGrades ?? template?.center?.length;

export const Tipo7Template7 = () => {
  const [grades, setGrades] = useState([0, 0, 0]);
  const [step, setStep] = useState(0);
  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  // eslint-disable-next-line no-unused-vars
  const [centerGrades, setCenterGrades] = useState(centerInitialGrades);

  useEffect(() => {
    if (!verified && step !== 2) {
      setGrades([0, 0, 0]);
      setCenterGrades(centerInitialGrades);
    }
  }, [verified]);

  const handleCenterChange = (i, grade) => {
    setCenterGrades((old) => {
      const data = [...old];
      data[i] = grade;
      const gradeTop =
        data.slice(0, data.length - 1).reduce((a, b) => a + b, 0) /
        (data.length - 1);
      const gradeBottom = data[data.length - 1];

      const gradeTotal = gradeTop * 0.8 + gradeBottom * 0.2;

      setGrades((old) => {
        const data = [...old];
        data[1] = gradeTotal;
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

  const initialSchema = createSchema({
    nodes: [
      {
        id: "title1",
        content: "PAST",
        coordinates: [0, 0],
        disableDrag: true,
        render: T7TTitleNode,
        data: { color: TIPO7_RED },
      },
      {
        id: "title2",
        content: "PERFECT",
        coordinates: [150, 0],
        disableDrag: true,
        render: T7TTitleNode,
        data: { color: TIPO7_GREEN },
      },
      {
        id: "title3",
        content: "SIMPLE",
        coordinates: [300, 0],
        disableDrag: true,
        render: T7TTitleNode,
        data: { color: TIPO7_BLUE, tachado: true },
      },
      {
        id: "center",
        coordinates: [30, 75],
        disableDrag: true,
        render: T7TMultiSelectNode1,
        data: {
          options: template.center.options,
          responses: [
            template.center.piramides[1],
            template.center.piramides[2],
            template.center.piramides[3],
          ],
          onGradeChange: handleCenterChange,
        },
      },
      {
        id: "center-left",
        disableDrag: true,
        coordinates: [80, 75],
        render: EmptyElement,
      },
      {
        id: "center-right",
        disableDrag: true,
        coordinates: [205, 75],
        render: EmptyElement,
      },
      {
        id: "derecha",
        coordinates: [265, 75],
        disableDrag: true,
        render: T7TSimpleSelectNode,
        data: {
          options: template.center.options,
          response: template.center.piramides[4],
          onGradeChange: (v) => handleCenterChange(3, v),
        },
      },
    ],
    links: [
      { input: "title1", output: "center-left", readonly: true },
      { input: "title2", output: "center-right", readonly: true },
      { input: "title2", output: "derecha", readonly: true },
    ],
  });

  const [schema, { onChange }] = useSchema(initialSchema);

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo
          videoID={EXPLANATION_VIDEOS[7.7] ?? EXPLANATION_VIDEOS[7]}
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
                minHeight: "55vh",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "410px",
                  height: "180px",
                  marginTop: 30,
                }}
              >
                <Diagram
                  schema={schema}
                  onChange={onChange}
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                  }}
                />
              </div>
              <div style={{ height: "20px" }}></div>
              <T7TCompleteVerboTotal
                left={template.center.verboTotal.left}
                right={template.center.verboTotal.right}
                options={template.center.verboTotal.options}
                onGradeChange={(grade) =>
                  handleCenterChange(
                    template.center.initialGrades.length - 1,
                    grade
                  )
                }
              />
            </div>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <Tipo7FormulasPage
              onGradeChange={(grade) => onGradeChange(2, grade)}
              data={getFormulasPageData(template)}
              template={template.template}
            />
          </div>
        )}
        <Tipo7Control setStep={setStep} grades={grades} step={step} />
      </div>
    </div>
  );
};
