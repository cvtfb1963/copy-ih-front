import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { toast } from "react-toastify";
import { getGlobalTop10 } from "../../services/StatisticsService";
import { useChartConfig } from "./useDemoConfig";

function numeroAleatorio(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getMock(username) {
  const Grammar = numeroAleatorio(1, 10);
  const Listening = numeroAleatorio(1, 10);
  const Pronunciation = numeroAleatorio(1, 10);
  const Reading = numeroAleatorio(1, 10);
  const Speaking = numeroAleatorio(1, 10);
  const Writing = numeroAleatorio(1, 10);
  const Vocabulary = numeroAleatorio(1, 10);
  const total =
    (Grammar +
      Listening +
      Pronunciation +
      Reading +
      Speaking +
      Writing +
      Vocabulary) /
    7;

  return {
    username,
    total: total / 10,
    Grammar: Grammar / 10,
    Listening: Listening / 10,
    Pronunciation: Pronunciation / 10,
    Reading: Reading / 10,
    Speaking: Speaking / 10,
    Writing: Writing / 10,
    Vocabulary: Vocabulary / 10,
  };
}

export function getMockList() {
  return [
    getMock("Gonzalo Lezo De Cordova"),
    getMock("Joaquin Guerrini"),
    getMock("Carolina Giraldo"),
    getMock("Marcos Tanlanav"),
    getMock("Julian Rodriguez"),
    getMock("Camila Marquez"),
    getMock("Rodrigo Eguillor"),
    getMock("Jazmin Lopez"),
    getMock("Andres Gutierrez"),
    getMock("Carlos Valles"),
  ].sort((a, b) => a.total - b.total);
}

export const StatisticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: chartData } = useChartConfig({
    dataType: "ordinal",
    injectData: data,
  });

  const primaryAxis = React.useMemo(
    () => ({
      position: "left",
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        position: "bottom",
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getGlobalTop10();
      setData(mapDataToChart(data));
    } catch (e) {
      console.log(e);
      toast("No se pudieron obtener los datos. Intente nuevamente.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const mapDataToChart = (data) => {
    const TotalData = [];
    const GrammarData = [];
    const ListeningData = [];
    const PronunciationData = [];
    const ReadingData = [];
    const SpeakingData = [];
    const WritingData = [];
    const VocabularyData = [];

    for (let i = data.length - 1; i >= 0; i--) {
      const userData = data[i];

      userData.username ??= "Usuario anónimo";
      userData.total ??= 0;
      userData.Grammar ??= 0;
      userData.Listening ??= 0;
      userData.Pronunciation ??= 0;
      userData.Reading ??= 0;
      userData.Speaking ??= 0;
      userData.Writing ??= 0;
      userData.Vocabulary ??= 0;

      TotalData.push({
        primary: userData.username,
        secondary: Number(userData.total) * 10,
      });
      GrammarData.push({
        primary: userData.username,
        secondary: Number(userData.Grammar) * 10,
      });
      ListeningData.push({
        primary: userData.username,
        secondary: Number(userData.Listening) * 10,
      });
      PronunciationData.push({
        primary: userData.username,
        secondary: Number(userData.Pronunciation) * 10,
      });
      ReadingData.push({
        primary: userData.username,
        secondary: Number(userData.Reading) * 10,
      });
      SpeakingData.push({
        primary: userData.username,
        secondary: Number(userData.Speaking) * 10,
      });
      WritingData.push({
        primary: userData.username,
        secondary: Number(userData.Writing) * 10,
      });
      VocabularyData.push({
        primary: userData.username,
        secondary: Number(userData.Vocabulary) * 10,
      });
    }

    return [
      { label: "Promedio", data: TotalData },
      { label: "Grammar", data: GrammarData },
      { label: "Listening", data: ListeningData },
      { label: "Pronunciation", data: PronunciationData },
      { label: "Reading", data: ReadingData },
      { label: "Speaking", data: SpeakingData },
      { label: "Writing", data: WritingData },
      { label: "Vocabulary", data: VocabularyData },
    ];
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ width: "95%", margin: "10px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <h1
          className="poppins-extrabold"
          style={{
            fontSize: "1.75rem",
            margin: "10px 10px 0 10px",
            height: "2.4rem",
          }}
        >
          TOP 10 Mejores Alumnos
        </h1>
        <p
          className="poppins-regular"
          style={{ margin: "20px 10px 0 10px", height: "1.5rem" }}
        >
          Calificaciones en base a 10 (10 = 100%).
        </p>
      </div>
      {loading ? (
        <CircularProgress size={"30px"} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "80vh",
          }}
        >
          {chartData && chartData.length !== 0 ? (
            <Chart
              options={{
                data: chartData,
                primaryAxis,
                secondaryAxes,
              }}
            />
          ) : (
            <p className="poppins">Aún no hay datos para mostrar.</p>
          )}
        </div>
      )}
    </div>
  );
};
