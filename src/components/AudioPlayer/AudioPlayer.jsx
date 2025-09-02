import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getAudio } from "../../services/FilesService";
import { PaisSelector } from "../PaisSelector/PaisSelector";

export const AUDIO_PAISES = {
  ingles: "INGLES",
  indio: "INDIO",
  australiano: "AUSTRALIANO",
  americano: "AMERICANO",
};

export const AudioPlayer = ({ audioName, justEnglish }) => {
  const [audio, setAudio] = useState();
  const [audioPais, setAudioPais] = useState(AUDIO_PAISES.ingles);

  const loadAudio = async () => {
    try {
      const audioFullName = `${audioName}-${audioPais}.mp3`;

      const { data } = await getAudio(audioFullName);

      setAudio(URL.createObjectURL(data));
    } catch (e) {
      setAudio("error");
      console.log(e);
    }
  };

  useEffect(() => {
    loadAudio();
  }, [audioPais]);

  return (
    <div
      style={{
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!justEnglish && (
        <PaisSelector audioPais={audioPais} setAudioPais={setAudioPais} />
      )}
      {!audio ? (
        <div style={{ margin: "10px" }}>
          <CircularProgress />
        </div>
      ) : audio === "error" ? (
        <p style={{ color: "red", margin: "10px" }}>
          No se pudo cargar el audio. {!justEnglish && "Pruebe otro país."}
        </p>
      ) : (
        <audio
          controls
          src={audio}
          style={{ margin: "10px" }}
          controlsList="nodownload"
        ></audio>
      )}
    </div>
  );
};
