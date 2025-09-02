import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import { EXERCISE_SKILLS } from "../../constants/ejerciciosData";
import { useScreenSize } from "../../hooks/useScreenSize";
import { getVideoCredentials } from "../../services/VdocipherService";
import { setCanContinue, setUnidadIndice } from "../../store/datosSlice";
import "./ejercicioTipo18.css";

export const ejemploTipo18 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 18,
  number: 76,
  unidad: 2,
  title: "Present continuous",
  description:
    "Esta descripción es opcional. Presta atención al siguiente video explicativo sobre present continuous. Lo necesitarás para resolver los ejercicios siguientes.",
  videoID: "41dc07ad1e6a1818196b500b4315ed78",
};

let player;
let interval;

export const EjercicioTipo18 = ({ ejercicio }) => {
  const [videoData, setVideoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const { unidadIndice } = useSelector((state) => state.datos);

  const { isMobile } = useScreenSize();

  const listener = async () => {
    const totalPlayed = await player.api.getTotalPlayed();
    const duration = player.video.duration;

    if (!totalPlayed || !duration) return;

    if (totalPlayed >= duration * 0.75) {
      clearInterval(interval);
      dispatch(setCanContinue(true));

      const exerciseIndex = unidadIndice.findIndex(
        (x) => x._id === ejercicio._id
      );
      if (exerciseIndex !== -1) {
        const newList = [...unidadIndice];
        newList[exerciseIndex] = {
          ...unidadIndice[exerciseIndex],
          completedByUser: true,
          gradeByUser: 1,
        };
        dispatch(setUnidadIndice(newList));
      }
    }
  };

  const fetchVideoData = async () => {
    setLoading(true);
    try {
      const { data } = await getVideoCredentials(ejercicio.videoID);
      if (data === "fallo") return setError(true);
      setVideoData(data);
      player = VdoPlayer.getInstance(
        document.getElementById("vdocipher-iframe")
      );

      if (!ejercicio.completedByUser) interval = setInterval(listener, 1000);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ejercicio) fetchVideoData();

    return () => {
      clearInterval(interval);
    };
  }, [ejercicio]);

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <DescriptionRenderer ejercicio={ejercicio} />
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </div>
        ) : error ? (
          <div style={{ margin: "20px" }}>
            <p style={{ color: "red" }}>No se pudo cargar el video.</p>
            <div style={{ padding: "20px" }}>
              <Button variant="contained" onClick={() => fetchVideoData()}>
                Reintentar
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div style={{ display: !videoData || (loading && "none") }}>
          <iframe
            id="vdocipher-iframe"
            src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
            style={{
              border: 0,
              width: "100%",
              height: !isMobile ? "70vh" : "40vh",
            }}
            allow="encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
