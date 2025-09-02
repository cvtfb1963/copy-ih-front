import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, Zoom } from "react-reveal";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import { DictadoOptimized } from "../../components/Dictado/DictadoOptimized";
import * as TranscribeClient from "../../components/Dictado/transcribeClient.js";
import { EXERCISE_SKILLS } from "../../constants/ejerciciosData";
import { useScreenSize } from "../../hooks/useScreenSize";
import { getVideoCredentials } from "../../services/VdocipherService";
import { setCanContinue, setUnidadIndice } from "../../store/datosSlice";
import { checkAnswer } from "../../utils/exercises.utils";

export const ejemploTipo31 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 31,
  number: 76,
  unidad: 2,
  title: "Diálogo: Vamos de compras",
  description:
    "Esta descripción es opcional. Presta atención al siguiente video y completa los diálogos hablando cuando sea necesario.",
  videoID: "1d76d1fd3144466388812e80c561ac01",
  answers: [
    {
      timeInSeconds: 5,
      answer: "The sky is blue",
    },
    {
      timeInSeconds: 15,
      answer: "The sky is red",
    },
  ],
};

let player;
let interval;
let completitionInterval;
let lastSeenTime = 0;

export const EjercicioTipo31 = ({ ejercicio }) => {
  const [videoData, setVideoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const [speakModalOpen, setSpeakModalOpen] = useState(false);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState();
  const [result, setResult] = useState(undefined);

  const getColor = (target) =>
    typeof target === "number"
      ? target > 0.6
        ? "green"
        : "red"
      : target
      ? "green"
      : "red";

  const { unidadIndice } = useSelector((state) => state.datos);

  const { isMobile } = useScreenSize();

  const listener = async () => {
    const currentTime = player.video.currentTime;

    for (let index = 0; index < ejercicio.answers.length; index++) {
      const answer = ejercicio.answers[index];

      if (
        answer.timeInSeconds >= currentTime - 0.25 &&
        answer.timeInSeconds < currentTime &&
        (lastSeenTime == 0 || lastSeenTime + 1000 < new Date().getTime())
      ) {
        player.video.pause();
        setCurrentAnswerIndex(index);
        setSpeakModalOpen(true);

        break;
      }
    }
  };

  const completitionListener = async () => {
    const totalPlayed = await player.api.getTotalPlayed();
    const duration = player.video.duration;

    if (!totalPlayed || !duration) return;

    if (totalPlayed >= duration * 0.75) {
      clearInterval(completitionInterval);
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
      // eslint-disable-next-line no-undef
      player = VdoPlayer.getInstance(
        document.getElementById("vdocipher-iframe")
      );

      interval = setInterval(listener, 250);
      completitionInterval = setInterval(completitionListener, 1000);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getResult = (currentUserAnswer) => {
    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    if (!currentUserAnswer || currentUserAnswer == "") return;

    const item = ejercicio.answers[currentAnswerIndex];
    const posibleResponses = [item.answer];

    if (item.answers2) posibleResponses.push(item.answers2);
    if (item.answers3) posibleResponses.push(item.answers3);
    if (item.answers4) posibleResponses.push(item.answers4);
    if (item.answers5) posibleResponses.push(item.answers5);
    if (item.answers6) posibleResponses.push(item.answers6);
    if (item.answers7) posibleResponses.push(item.answers7);
    if (item.answers8) posibleResponses.push(item.answers8);
    if (item.answers9) posibleResponses.push(item.answers9);
    if (item.answers10) posibleResponses.push(item.answers10);
    if (item.answers11) posibleResponses.push(item.answers11);
    if (item.answers12) posibleResponses.push(item.answers12);

    const res = checkAnswer(currentUserAnswer, ...posibleResponses, 23);
    localStorage.removeItem("is_vocabulary_exercise");
    setResult(res);
    return res;
  };

  useEffect(() => {
    if (ejercicio) fetchVideoData();

    dispatch(setCanContinue(true));

    return () => {
      clearInterval(interval);
      clearInterval(completitionInterval);
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

      <Modal
        open={speakModalOpen}
        onClose={() => {
          lastSeenTime = new Date().getTime();
          setSpeakModalOpen(false);
          setCurrentAnswerIndex(undefined);
          setResult(undefined);
          player.video.play();
          TranscribeClient.stopRecording();
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "600px",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 1,
            borderRadius: 10,
          }}
        >
          <Bounce>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p className="poppins-bold">¡Es tu turno de hablar!</p>
              {/* <DictadoJavascript
              inputStyle={{ width: "70%", maxWidth: "400px" }}
              canRecord={true}
              onChange={(value) => getResult(value)}
              borderColor={!result ? "" : getColor(result)}
              onRecordChange={(state) => {}}
            /> */}
              <DictadoOptimized
                inputStyle={{
                  width: "70%",
                  maxWidth: "600px",
                  borderRadius: "10px",
                  padding: "10px",
                }}
                divStyle={{
                  width: "90%",
                  maxWidth: "600px",
                }}
                canRecord={true}
                onChange={(value) => getResult(value)}
                borderColor={!result ? "" : getColor(result)}
                onRecordChange={(state) => {}}
              />
              {result != undefined &&
              ejercicio?.answers?.[currentAnswerIndex]?.answer ? (
                <>
                  <p className="poppins-regular">
                    {ejercicio.answers[currentAnswerIndex].answer}
                  </p>
                  <Typography align="center" mt={1} fontSize={12}>
                    Coincidencia:
                  </Typography>
                  <Zoom>
                    <h4
                      style={{
                        fontSize: "70px",
                        margin: 0,
                        color: result >= 0.6 ? "green" : "red",
                      }}
                    >
                      {Math.round(result * 100)}%
                    </h4>
                  </Zoom>
                </>
              ) : (
                <></>
              )}
              <Button
                onClick={() => {
                  lastSeenTime = new Date().getTime();
                  setSpeakModalOpen(false);
                  setCurrentAnswerIndex(undefined);
                  setResult(undefined);
                  player.video.play();
                  TranscribeClient.stopRecording();
                }}
              >
                Continuar
              </Button>
            </div>
          </Bounce>
        </Paper>
      </Modal>
    </div>
  );
};
