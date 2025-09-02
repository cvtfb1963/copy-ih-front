import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./dictado.css";
import * as TranscribeClient from "./transcribeClient.js";

const WORD_DONT_CHANGE = ["!", ",", ".", "?"];

let timer;

export const DictadoOptimized = ({
  onChange,
  onRecordChange,
  borderColor,
  inputStyle,
  maxAudioDurationMillis = 20000,
  canRecord,
  wordFunction,
  divStyle,
}) => {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [dictado, setDictado] = useState("");

  const {
    current: { verified },
    credentials,
  } = useSelector((state) => state.datos);

  useEffect(() => {
    onChange(dictado.replaceAll("  ", "").trim());
  }, [dictado]);

  useEffect(() => {
    if (!verified) setDictado("");
  }, [verified]);

  const handleStartRecord = async () => {
    try {
      onRecordChange(true);
      setLoading(true);
      setDictado("");
      timer = setTimeout(() => {
        setRecording(false);
        handleStopRecord();
        toast(
          `El audio no puede durar más de ${
            maxAudioDurationMillis / 1000
          } segundos`,
          { type: "error" }
        );
      }, maxAudioDurationMillis);
      await TranscribeClient.startRecording(
        credentials,
        () => {
          setLoading(false);
          setRecording(true);
        },
        (data) =>
          setDictado((old) =>
            wordFunction
              ? WORD_DONT_CHANGE.includes(String(data).trim())
                ? old
                : String(data).trim()
              : (old += `${data}`)
          )
      );
    } catch (error) {
      await handleStopRecord();
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setRecording(false);
    }
  };

  const handleStopRecord = async () => {
    setLoading(true);
    setRecording(false);
    await TranscribeClient.stopRecording();
    setLoading(false);
    onRecordChange(false);
  };

  // Determine container classes based on state
  const getContainerClasses = () => {
    let classes = "dictado-container";
    if (recording) classes += " recording";
    if (borderColor === "green") classes += " dictado-success";
    if (borderColor === "red") classes += " dictado-error";
    return classes;
  };

  // Determine button classes based on state
  const getButtonClasses = () => {
    let classes = "dictado-button";
    if (recording) classes += " recording";
    return classes;
  };

  // Determine bounce container classes
  const getBounceClasses = () => {
    let classes = "dictado-button-container";
    if (recording) classes += " dictado-bounce recording";
    return classes;
  };

  return (
    <div 
      className={getContainerClasses()}
      style={{ ...divStyle }}
    >
      <input
        disabled
        style={{ 
          border: `2px solid ${borderColor || '#cbd5e0'}`, 
          ...inputStyle 
        }}
        value={dictado}
        placeholder={recording ? "🎤 Grabando..." : "🎧 Presiona el micrófono para hablar"}
      />
      {loading ? (
        <div className="dictado-loading">
        <CircularProgress
          color="secondary"
            size="20px"
        />
        </div>
      ) : (
        <div className={getBounceClasses()}>
          <IconButton
            className={getButtonClasses()}
            onClick={recording ? handleStopRecord : handleStartRecord}
            disabled={!canRecord && !recording}
            size="large"
          >
            {recording ? (
              <StopCircleIcon />
            ) : (
              <MicIcon />
            )}
          </IconButton>
        </div>
      )}
    </div>
  );
};
