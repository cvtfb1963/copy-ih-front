import { Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrent } from "../../store/datosSlice";
import "./explanationModal.css";

export const ExplanationModal = () => {
  const { current } = useSelector((state) => state.datos);

  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setCurrent({ explanationOpen: false, explanation: "" }));
  };

  return (
    <Modal open={current?.explanationOpen} onClose={onClose}>
      <div className="game-explanation-backdrop" onClick={onClose}>
        <div className="game-explanation-container" onClick={(e) => e.stopPropagation()}>
          
          {/* Floating lightbulb particles */}
          <div className="explanation-particles">
            <span className="explanation-particle">💡</span>
            <span className="explanation-particle">🤓</span>
            <span className="explanation-particle">📚</span>
            <span className="explanation-particle">✨</span>
          </div>

          <div className="game-explanation-header">
            <div className="game-explanation-title">
              <span className="explanation-emoji">🧠</span>
              <h4>Explicación</h4>
              <span className="explanation-emoji">💡</span>
            </div>
          </div>

          <div className="game-explanation-content">
            {current?.explanation ? (
              current?.explanation?.split("<br>").map((part, i) => (
                <p key={`exp-p-${i}`} className="game-explanation-text">
                  {part}
                </p>
              ))
            ) : (
              <div className="game-explanation-fallback">
                <span className="fallback-emoji">🤔</span>
                <p className="game-explanation-text">
                  Lo sentimos. Aún no hemos cargado la explicación de esta respuesta.
                </p>
                <span className="fallback-emoji">📖</span>
              </div>
            )}
          </div>

          <div className="game-explanation-actions">
            <button className="game-explanation-close-button" onClick={onClose}>
              <span className="game-button-emoji">✅</span>
              <span>ENTENDIDO</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
