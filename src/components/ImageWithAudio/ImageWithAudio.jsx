import ReplayIcon from "@mui/icons-material/Replay";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { CircularProgress, IconButton } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { getAudio, getImagen } from "../../services/FilesService";
import { AUDIO_PAISES } from "../AudioPlayer/AudioPlayer";

export const ImageWithAudio = ({
  imageName,
  audioName,
  audioPais = AUDIO_PAISES.ingles,
}) => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [image, setImage] = useState();
  const [audioElement, setAudioElement] = useState();

  const fetchFiles = async () => {
    setLoading(true);
    setError(false);
    setAudioElement(null);
    setImage(null);

    try {
      const [{ data }, imagen] = await Promise.all([
        getAudio(`${audioName}-${audioPais}.mp3`),
        getImagen(imageName),
      ]);
      const audioPlayer = new Audio();
      audioPlayer.src = URL.createObjectURL(data);
      setAudioElement(audioPlayer);
      setImage(URL.createObjectURL(imagen.data));
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(true);
    }
  };

  const fetchAudio = async () => {
    setLoading(true);
    setError(false);
    setAudioElement(null);

    try {
      const { data } = await getAudio(`${audioName}-${audioPais}.mp3`);
      const audioPlayer = new Audio();
      audioPlayer.src = URL.createObjectURL(data);
      setAudioElement(audioPlayer);
      setLoading(false);
    } catch (e) {
      setAudioElement("error");
      setLoading(false);
      setError(false);
    }
  };

  const playAudio = () => audioElement.play();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    fetchAudio();
  }, [audioPais]);

  return (
    <div
      style={{
        position: "relative",
        width: "200px",
        height: "150px",
        display: "flex",
      }}
    >
      {loading ? (
        <div style={{ margin: "auto" }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <div style={{ margin: "auto" }}>
          <IconButton onClick={fetchFiles}>
            <ReplayIcon />
          </IconButton>
        </div>
      ) : (
        <Fragment>
          <img
            src={image}
            width={200}
            style={{ width: "100%", height: "100%" }}
          />
          <div style={{ position: "absolute", bottom: 0, marginLeft: "5px" }}>
            {audioElement === "error" ? (
              <p style={{ fontSize: "12px" }}>
                No se pudo cargar el audio. <br /> Seleccione otro país.
              </p>
            ) : (
              <IconButton onClick={playAudio}>
                <VolumeUpIcon />
              </IconButton>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              marginRigth: "5px",
            }}
          ></div>
        </Fragment>
      )}
    </div>
  );
};
