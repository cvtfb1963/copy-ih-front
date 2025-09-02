import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    Tabs,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StatisticsShower } from "../../components/StatisticsShower/StatisticsShower";
import { EXERCISE_SKILLS } from "../../constants/ejerciciosData";
import { useScreenSize } from "../../hooks/useScreenSize";
import {
    getDataForLinearChart,
    getOwnGlobalStatistics,
    getOwnUnidadStatistics,
} from "../../services/StatisticsService";
import { CustomTabPanel, a11yProps } from "../EjerciciosPage/EjerciciosPage";
import { unidades } from "../HomePage/HomePage";
import "./MyProgressPage.css";

export const MyProgressPage = () => {
  const [datos, setDatos] = useState();
  const [loading, setLoading] = useState(true);
  const [unidadSelected, setUnidadSelected] = useState("global");

  const [linearChartData, setLinearChartData] = useState();
  const [mappedToChartData, setMappedToChartData] = useState();
  const [linearChartSkill, setLinearChartSkill] = useState(
    EXERCISE_SKILLS.GRAMMAR
  );

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { width, height } = useScreenSize();

  const mapToChart = (data, skill) => {
    const ejeX = Array(data.length)
      .fill(null)
      .map((_, i) => i + 1);

    const media = [];

    const alumno = [];

    data.forEach(({ platform, user }) => {
      media.push(Number(platform?.[skill] * 10));
      alumno.push(Number(user?.[skill] * 10));
    });

    const result = {
      ejeX,
      media,
      alumno,
    };

    setMappedToChartData(result);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } =
        unidadSelected === "global"
          ? await getOwnGlobalStatistics()
          : await getOwnUnidadStatistics(Number(unidadSelected));
      setDatos(data);
    } catch (e) {
      console.log(e);
      toast("No se pudieron obtener los datos. Intente nuevamente.", {
        type: "error",
      });
    } finally {
      if (value === 0) setLoading(false);
    }
  };

  const fetchLinearChartData = async () => {
    setLoading(true);
    try {
      const { data } = await getDataForLinearChart();
      setLinearChartData(data);
      mapToChart(data, linearChartSkill);
    } catch (e) {
      console.log(e);
      toast("No se pudieron obtener los datos. Intente nuevamente.", {
        type: "error",
      });
    } finally {
      if (value === 1) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [unidadSelected]);

  useEffect(() => {
    if (!linearChartData) fetchLinearChartData();
  }, []);

  useEffect(() => {
    if (linearChartData) mapToChart(linearChartData, linearChartSkill);
  }, [linearChartSkill]);

  return (
    <div className="progress-page-container">
      {/* Header Section */}
      <div className="progress-header">
        <h1 className="progress-title">📊 Mi Progreso</h1>
        <p className="progress-subtitle">
          Descubre tu evolución y compara tu rendimiento
        </p>
      </div>

      {/* Game-style Tabs */}
      <div className="game-tabs-container">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="📈 PROGRESO PERSONAL" {...a11yProps(0)} />
            <Tab label="⚔️ COMPARACIÓN CON LA MEDIA" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </div>

      {/* Tab Content */}
      <CustomTabPanel value={value} index={0}>
        <div className="progress-content-card">
          {loading ? (
            <div className="progress-loading">
              <CircularProgress size={40} />
              <div className="loading-text">Cargando tu progreso...</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormControl fullWidth className="game-form-control">
                <InputLabel>🎯 Selecciona una Unidad</InputLabel>
                <Select
                  id="demo-simple-select"
                  value={unidadSelected}
                  label="🎯 Selecciona una Unidad"
                  onChange={(e) => {
                    setUnidadSelected(e.target.value);
                    e.stopPropagation();
                  }}
                >
                  <MenuItem value={"global"}>
                    <b>🌟 Global</b>
                  </MenuItem>
                  {unidades.map((unidad, i) => (
                    <MenuItem key={`s-u-${i + 1}`} value={i + 1}>
                      <b>📚 Unidad {i + 1}</b>: {unidad.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {datos && <StatisticsShower statistics={datos} />}
            </div>
          )}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <div className="progress-content-card">
          {loading ? (
            <div className="progress-loading">
              <CircularProgress size={40} />
              <div className="loading-text">Cargando comparación...</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="comparison-header">
                <div className="comparison-title-section">
                  <h2 className="comparison-title">
                    🎮 Tú <span className="vs-text">vs</span> 🌍 La Media
                  </h2>
                  <p className="comparison-description">
                    Aquí puedes comparar tu progreso con el resto de los alumnos
                    en cada unidad y descubrir en qué áreas destacas más.
                  </p>
                </div>
                <FormControl className="game-form-control skill-selector">
                  <InputLabel>🎯 Habilidad</InputLabel>
                  <Select
                    value={linearChartSkill}
                    label="🎯 Habilidad"
                    onChange={(e) => {
                      setLinearChartSkill(e.target.value);
                      e.stopPropagation();
                    }}
                  >
                    {Object.values(EXERCISE_SKILLS).map((skill, i) => (
                      <MenuItem key={`s-i-${i + 1}`} value={skill}>
                        <b>{skill}</b>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {linearChartData &&
              linearChartData?.length !== 0 &&
              mappedToChartData ? (
                <div className="chart-container">
                  <LineChart
                    xAxis={[
                      {
                        data: mappedToChartData?.ejeX,
                        disableTicks: true,
                        tickMinStep: 1,
                        label: "Unidades",
                      },
                    ]}
                    series={[
                      {
                        data: mappedToChartData?.alumno,
                        label: "🎮 Tú",
                        color: "#58cc02",
                      },
                      {
                        data: mappedToChartData?.media,
                        label: "🌍 Media",
                        color: "#ff6b35",
                      },
                    ]}
                    grid={{ vertical: true, horizontal: true }}
                    width={width * 0.8}
                    height={height * 0.6}
                  />
                </div>
              ) : (
                <div className="no-data-message">
                  Aún no hay datos para mostrar. ¡Completa más ejercicios para ver tu progreso!
                </div>
              )}
            </div>
          )}
        </div>
      </CustomTabPanel>
    </div>
  );
};
