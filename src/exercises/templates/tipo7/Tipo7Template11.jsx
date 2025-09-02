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
  "Am / Are / Is",
  "Be",
  "Going to",
  "Past",
  "Present",
  "V.(ing)",
  "V.(inf)",
  "Was / Were",
  "Will",
];

const pantalla2options = [
  "(Wh_)",
  "Am / Are / Is",
  "Complemento",
  "Complemento?",
  "Going to",
  "Not",
  "Sujeto",
  "V.(ing)",
  "V.(inf)",
  "Was / Were",
  "Will",
];

const template = {
  title: "Be Going To + Inf. (Past)",
  template: 11,
  center: {
    //verbo total usa un solo lugar promediando sus 5 opciones
    initialGrades: [0, 0, 0, 0, 0, 0],
    piramides: {
      1: "Past",
      2: "Be",
      3: "Was / Were",
      4: "Going to",
      5: "V.(inf)",
    },
    options: pantalla1options,
    verboTotal: {
      left: "Was / Were",
      right: ["Going to", "V.(inf)"],
      options: pantalla1options,
    },
  },
  formulasPage: {
    toComplete: [
      ["Sujeto", "Was / Were", "Going to", "V.(inf)", "Complemento"],
      ["Sujeto", "Was / Were", "Not", "Going to", "V.(inf)", "Complemento"],
      ["(Wh_)", "Was / Were", "Sujeto", "Going to", "V.(inf)", "Complemento?"],
    ],
    options: pantalla2options,
  },
};

const centerInitialGrades =
  template?.center?.initialGrades ?? template?.center?.length;

export const Tipo7Template11 = () => {
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
        id: "title0",
        content: "Past",
        coordinates: [40, 0],
        disableDrag: true,
        render: T7TTitleNode,
        data: { color: TIPO7_RED },
      },
      {
        id: "title1",
        content: "Be",
        coordinates: [114, 0],
        disableDrag: true,
        render: T7TTitleNode,
        data: { color: TIPO7_RED },
      },
      {
        id: "title2",
        content: "going to",
        coordinates: [160, 0],
        disableDrag: true,
        render: T7TTitleNode,
        data: { color: TIPO7_BLUE },
      },
      {
        id: "title3",
        content: "+",
        coordinates: [270, 0],
        disableDrag: true,
        render: T7TTitleNode,
      },
      {
        id: "title4",
        content: "infinitivo",
        coordinates: [290, 0],
        disableDrag: true,
        render: T7TTitleNode,
        data: { color: TIPO7_BLUE },
      },
      {
        id: "center1",
        coordinates: [20, 75],
        disableDrag: true,
        render: T7TMultiSelectNode1,
        data: {
          options: template.center.options,
          responses: [
            template.center.piramides[1],
            template.center.piramides[2],
            template.center.piramides[3],
          ],
          small: true,
          onGradeChange: handleCenterChange,
        },
      },
      {
        id: "center1-left",
        coordinates: [60, 75],
        disableDrag: true,
        render: EmptyElement,
      },
      {
        id: "center1-right",
        coordinates: [145, 75],
        disableDrag: true,
        render: EmptyElement,
      },
      {
        id: "center2",
        coordinates: [190, 75],
        disableDrag: true,
        render: T7TSimpleSelectNode,
        data: {
          options: template.center.options,
          response: template.center.piramides[4],
          small: true,
          onGradeChange: (v) => handleCenterChange(3, v),
        },
      },
      {
        id: "center3",
        coordinates: [310, 75],
        disableDrag: true,
        render: T7TSimpleSelectNode,
        data: {
          options: template.center.options,
          response: template.center.piramides[5],
          small: true,
          onGradeChange: (v) => handleCenterChange(4, v),
        },
      },
    ],
    links: [
      { input: "title0", output: "center1-left", readonly: true },
      { input: "title1", output: "center1-right", readonly: true },
      { input: "title2", output: "center2", readonly: true },
      { input: "title4", output: "center3", readonly: true },
    ],
  });

  const [schema, { onChange }] = useSchema(initialSchema);

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo
          videoID={EXPLANATION_VIDEOS["7.11"] ?? EXPLANATION_VIDEOS[7]}
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
