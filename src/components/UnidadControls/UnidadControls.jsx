import PreviousIcon from "@mui/icons-material/ArrowBack";
import NextIcon from "@mui/icons-material/ArrowForward";
import { Button, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { useScreenSize } from "../../hooks/useScreenSize";
import { Progressbar } from "../ProgressBar/ProgressBar";
import "./unidadControls.css";

export const UnidadControls = ({ progress, handleNext, handlePrevious }) => {
  const { isMobile } = useScreenSize();
  const {
    current: { canContinue },
  } = useSelector((state) => state.datos);

  // Enhanced Progress Bar component with game styling
  const GameProgressBar = ({ filled, mobile }) => {
    return (
      <div className={`game-progress-container ${mobile ? 'mobile' : ''}`}>
        <div className="game-progressbar">
          <div 
            className="progress-fill"
            style={{
              width: `${filled}%`,
            }}
          />
          <span className="game-progress-percent">{filled}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="unidad-controls-wrapper">
      {isMobile && <GameProgressBar filled={progress} mobile />}
      <div className="unidad-controls">
        <div className="game-button-container">
          <Button
            className="game-control-button previous-button"
            variant="outlined"
            startIcon={<PreviousIcon className="game-button-icon" />}
            onClick={handlePrevious}
          >
            Anterior
          </Button>
        </div>
        {!isMobile && <GameProgressBar filled={progress} />}
        <div className="game-button-container">
          <Tooltip
            className="game-tooltip"
            title={
              canContinue
                ? "¡Avance al siguiente ejercicio! 🚀"
                : "Para poder avanzar, complete el ejercicio actual. 💪"
            }
            arrow
          >
            <span>
              <Button
                className="game-control-button next-button"
                variant="contained"
                endIcon={<NextIcon className="game-button-icon" />}
                onClick={handleNext}
                disabled={!canContinue}
              >
                Siguiente
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
