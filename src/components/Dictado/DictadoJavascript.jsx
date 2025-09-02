import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./dictado.css";

let recognition;

export const DictadoJavascript = ({
  onChange,
  onRecordChange,
  borderColor,
  inputStyle,
  canRecord,
}) => {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [dictado, setDictado] = useState("");

  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  useEffect(() => {
    onChange(dictado.replaceAll("  ", "").trim());
  }, [dictado]);

  useEffect(() => {
    if (!verified) setDictado("");
  }, [verified]);

  useEffect(() => {
    handleStartRecord();
  }, []);

  const handleStartRecord = async () => {
    try {
      onRecordChange(true);
      setLoading(true);
      setDictado("");

      recognition =
        // eslint-disable-next-line no-undef
        new webkitSpeechRecognition() || new SpeechRecognition();

      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.start();
      setLoading(false);
      setRecording(true);

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        setDictado(result);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onnomatch = () => {
        console.log("No speech was recognized.");
      };
    } catch (error) {
      console.log("error iniciando transcribe js: ", error);
      await handleStopRecord();
    }
  };

  const handleStopRecord = async () => {
    setLoading(true);
    setRecording(false);
    recognition.stop();
    setLoading(false);
    onRecordChange(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "90%",
        maxWidth: "500px",
      }}
    >
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
            onClick={recording ? handleStopRecord : handleStartRecord}
            disabled={!canRecord && !recording}
          >
            {recording ? (
              <StopCircleIcon color="error" />
            ) : (
              <MicIcon color={canRecord ? "info" : "disabled"} />
            )}
          </IconButton>
        </div>
      )}
    </div>
  );
};
