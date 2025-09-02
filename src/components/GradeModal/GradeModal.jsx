import {
    CircularProgress,
    Modal
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { postUserGrade } from "../../services/ExercisesService";
import { setCanContinue, setCurrent } from "../../store/datosSlice";
import "./gradeModal.css";

export const GradeModal = ({ nextExercise }) => {
  const { current, unidadIndice } = useSelector((state) => state.datos);
  const [gradeSaved, setGradeSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(
      setCurrent({
        gradeOpen: false,
        dontSaveGrade: false,
        gradeTotal: null,
        binaria: false,
      })
    );
  };

  const handleNext = () => {
    onClose();
    nextExercise();
  };

  const saveGrade = async () => {
    try {
      setLoading(true);
      setGradeSaved(false);
      await postUserGrade(
        current.exerciseId,
        Number(Number(current.gradeTotal ?? current.grade).toFixed(2)),
        current.numeroUnidad
      );
      setGradeSaved(true);
      dispatch(setCanContinue(true));
    } catch (e) {
      console.log(e);
      toast("No se pudo guardar la calificación. Intenta nuevamente.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !current?.gradeOpen ||
      !current?.exerciseId ||
      current?.grade === 0 ||
      current?.dontSaveGrade
    )
      return;

    if (unidadIndice && current?.grade) {
      const exerciseIndex = unidadIndice.findIndex(
        (x) => x._id === current?.exerciseId
      );
      if (exerciseIndex !== -1 && ![18, 30].includes(unidadIndice[exerciseIndex].type)) {
        const newList = [...unidadIndice];
        newList[exerciseIndex] = {
          ...unidadIndice[exerciseIndex],
          completedByUser: true,
          gradeByUser: Number(current?.grade).toFixed(2),
        };
      }
    }

    saveGrade();
  }, [current?.gradeOpen]);

  const getGradeEmoji = () => {
    if (current?.binaria) {
      return current?.grade == 1 ? "🎉" : "😔";
    }
    const percentage = Math.round(current?.grade * 100);
    if (percentage >= 90) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 70) return "👏";
    if (percentage >= 60) return "👍";
    return "💪";
  };

  const getGradeMessage = () => {
    if (current?.binaria) {
      return current?.grade == 1 ? "¡Perfecto!" : "Inténtalo otra vez";
    }
    const percentage = Math.round(current?.grade * 100);
    if (percentage >= 90) return "¡Excelente trabajo!";
    if (percentage >= 80) return "¡Muy bien hecho!";
    if (percentage >= 70) return "¡Buen trabajo!";
    if (percentage >= 60) return "¡Bien hecho!";
    return "¡Sigue practicando!";
  };

  return (
    <Modal open={current?.gradeOpen} onClose={onClose}>
      <div className="game-modal-backdrop" onClick={onClose}>
        <div className="game-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="game-modal-content">
            
            {/* Floating celebration elements */}
            <div className="celebration-particles">
              <span className="particle">🎉</span>
              <span className="particle">⭐</span>
              <span className="particle">🎊</span>
              <span className="particle">✨</span>
              <span className="particle">🌟</span>
            </div>

            {/* Grade Display */}
            <div className="game-grade-section">
              <div className="game-grade-emoji">
                {getGradeEmoji()}
              </div>
              
              {!current?.binaria ? (
                <>
                  <h3 className="game-grade-title">Puntaje obtenido:</h3>
                  <div className="game-grade-score">
                    <span className="game-grade-number">
                      {Math.round(current?.grade * 100)}%
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="game-grade-title">Resultado:</h3>
                  <div className="game-grade-binary">
                    {current?.grade == 1 ? "👍😁" : "👎😢"}
                  </div>
                </>
              )}
              
              <p className="game-grade-message">
                {getGradeMessage()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="game-modal-actions">
              <button className="game-modal-button game-modal-close" onClick={onClose}>
                <span className="game-button-emoji">❌</span>
                <span>CERRAR</span>
              </button>

              {!window.location.pathname.includes("test") && (
                <>
                  {!current?.dontSaveGrade && gradeSaved && !loading && (
                    <button 
                      className={`game-modal-button game-modal-next ${!current?.canContinue ? 'disabled' : ''}`}
                      onClick={handleNext}
                      disabled={!current?.canContinue}
                      title={
                        current?.canContinue
                          ? "Avanzar al siguiente ejercicio de esta unidad."
                          : "No puedes continuar si tienes un 0 en este ejercicio."
                      }
                    >
                      <span className="game-button-emoji">🚀</span>
                      <span>SIGUIENTE EJERCICIO</span>
                    </button>
                  )}
                  
                  {loading && (
                    <div className="game-loading-section">
                      <CircularProgress size={40} style={{ color: '#58cc02' }} />
                      <p>Guardando...</p>
                    </div>
                  )}
                  
                  {!current?.dontSaveGrade &&
                    current?.grade !== 0 &&
                    !gradeSaved &&
                    !loading && (
                      <button 
                        className="game-modal-button game-modal-save"
                        onClick={saveGrade}
                        title="Ocurrió un error al guardar tu calificación. Click para reintentar."
                      >
                        <span className="game-button-emoji">💾</span>
                        <span>GUARDAR CALIFICACIÓN</span>
                      </button>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
