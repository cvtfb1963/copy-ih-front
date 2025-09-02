import { useDispatch } from "react-redux";
import { setVerified } from "../../store/datosSlice";
import "./exerciseControl.css";

export const ExerciseControl = ({ verified, handleVerify, handleReset }) => {
  const dispatch = useDispatch();

  const onVerify = () => {
    dispatch(setVerified(true));
    handleVerify();
  };

  const onReset = () => {
    dispatch(setVerified(false));
    handleReset();
  };

  return verified ? (
    <div className="game-control-container">
      <div className="game-button-wrapper">
        <button className="game-button game-button-reset" onClick={onReset}>
          <span className="game-button-emoji">🔄</span>
          <span className="game-button-text">REINICIAR</span>
          <span className="game-button-sparkle">✨</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="game-control-container">
      <div className="game-button-wrapper">
        <button className="game-button game-button-verify" onClick={onVerify}>
          <span className="game-button-emoji">🎯</span>
          <span className="game-button-text">VERIFICAR</span>
          <span className="game-button-sparkle">⭐</span>
        </button>
      </div>
    </div>
  );
};
