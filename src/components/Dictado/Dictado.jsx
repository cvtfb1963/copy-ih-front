import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { CircularProgress, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { sendAudioToTranscribe } from "../../services/TranscribeService";
import "./dictado.css";

let timer;
let avoidSending = false;

export const Dictado = ({
  onChange,
  borderColor,
  inputStyle,
  maxAudioDurationMillis = 15000,
}) => {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [dictado, setDictado] = useState("");

  const audioChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);

  const handleStartRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      if (avoidSending) {
        audioChunksRef.current = [];
        return (avoidSending = false);
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");

      try {
        const { data } = await sendAudioToTranscribe(formData);
        setDictado(data.result);
        onChange(data.result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast("Ocurrió un error, no se pudo transcribir el audio.", {
          type: "error",
        });
        console.error("Error al enviar audio al backend", error);
      }

      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);

    timer = setTimeout(() => {
      avoidSending = true;
      setRecording(false);
      mediaRecorderRef.current.stop();
      toast(
        `El audio no puede durar más de ${
          maxAudioDurationMillis / 1000
        } segundos`,
        { type: "error" }
      );
    }, maxAudioDurationMillis);
  };

  const handleSendRecord = () => {
    clearTimeout(timer);
    setRecording(false);
    mediaRecorderRef.current.stop();
    setLoading(true);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        disabled
        style={{ flex: 1, border: `1px solid ${borderColor}`, ...inputStyle }}
        value={dictado}
      />
      {loading ? (
        <CircularProgress
          color="secondary"
          size="25px"
          sx={{ marginLeft: "15px" }}
        />
      ) : (
        <div
          style={{
            animation: recording && "bounce 1s infinite ease-in-out",
          }}
        >
          <IconButton
            onClick={recording ? handleSendRecord : handleStartRecord}
          >
            {recording ? (
              <StopCircleIcon color="error" />
            ) : (
              <MicIcon color="info" />
            )}
          </IconButton>
        </div>
      )}
    </div>
  );
};
