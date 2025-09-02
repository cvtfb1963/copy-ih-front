import { DotLottiePlayer } from "@dotlottie/react-player";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { Button, CircularProgress, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bounce } from "react-reveal";
import { useNavigate } from "react-router";
import { PALETTE } from "../../common/palette";
import { EXERCISE_SKILLS_COLORS } from "../../components/DescriptionRenderer/DescriptionRenderer";
import { ExplanationModal } from "../../components/ExplanationModal/ExplanationModal";
import { GradeModal } from "../../components/GradeModal/GradeModal";
import { UnidadControls } from "../../components/UnidadControls/UnidadControls";
import { UnidadIndice } from "../../components/UnidadIndice/UnidadIndice";
import { VocabularyModal } from "../../components/VocabularyModal/VocabularyModal";
import { ExerciseRenderer } from "../../exercises/ExerciseRenderer/ExerciseRenderer";
import { useScreenSize } from "../../hooks/useScreenSize";
import {
  getOneExercise,
  getUnidadIndice,
  postUserGrade,
  postUserPositions,
} from "../../services/ExercisesService";
import {
  setCanContinue,
  setCloudData,
  setCurrent,
  setCurrentSkill,
  setCurrentTitle,
  setCurrentattachedDocument,
  setPosicionPorUnidad,
  setUnidadIndice,
  setUnidadStatus,
  setUser,
  setVerified,
  setVocabularyOpen,
} from "../../store/datosSlice";
import { NewSkillModal } from "../NewSkillModal/NewSkillModal";
import "./unidadPage.css";

let lastSkill;
export const UnidadPage = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ejercicioActual, setEjercicioActual] = useState();
  const [error, setError] = useState();
  const [showUnitFinished, setShowUnitFinished] = useState(false);
  const [newSkillModalOpen, setNewSkillModalOpen] = useState(false);
  const navigate = useNavigate();

  const { isMobile } = useScreenSize();

  const {
    posicionPorUnidad,
    unidadesData,
    current: { numeroUnidad, displayUnidad, tituloUnidad },
    user
  } = useSelector((state) => state.datos);

  useEffect(() => {
    const position = posicionPorUnidad[numeroUnidad] ?? 0;
    const size = unidadesData?.[numeroUnidad]?.count;

    const progress = position === 0 ? 0 : Math.round((position / size) * 100);
    setProgress(progress);
  }, [posicionPorUnidad]);

  const isInThisUnit = (index) => {
    const unitData = unidadesData[`${numeroUnidad}`];
    const unitStart = unitData.startIndex;
    index = index + unitStart;
    const unitEnd = unitStart + unitData.count - 1;
    return index >= unitStart && index <= unitEnd;
  };

  const dispatch = useDispatch();

  const handleIndiceNavigate = (unitPosition) => {
    const unitData = unidadesData[`${numeroUnidad}`];
    const unitStart = unitData.startIndex;
    const index = unitStart + unitPosition;
    fetchData(index);
  };

  const handleNext = async () => {
    const startUnitIndex = unidadesData?.[numeroUnidad]?.startIndex;
    const current = posicionPorUnidad?.[numeroUnidad] ?? 0;

    try {
      const nextPosition = current + 1;
      if (!isInThisUnit(nextPosition)) {
        if ([18, 30].includes(ejercicioActual.type))
          await postUserGrade(ejercicioActual._id, 1, numeroUnidad);

        await postUserPositions(String(numeroUnidad), nextPosition);
        dispatch(
          setPosicionPorUnidad({ [String(numeroUnidad)]: nextPosition })
        );

        dispatch(setUnidadStatus({ [numeroUnidad]: true }));
        setProgress(100);

        return setShowUnitFinished(true);
      }

      setLoading(true);
      const [
        { data: ejerNuevo },
        {
          data: { atUnit },
        },
      ] = await Promise.all([
        getOneExercise(nextPosition + startUnitIndex),
        postUserPositions(String(numeroUnidad), nextPosition),
        [18, 30].includes(ejercicioActual.type) &&
          postUserGrade(ejercicioActual._id, 1, numeroUnidad),
      ]);
      dispatch(setCloudData(ejerNuevo?.credentials));
      dispatch(setUser({ atUnit }));
      dispatch(setCurrent({ exerciseId: ejerNuevo._id }));
      dispatch(setCurrentSkill(ejerNuevo.skill));
      dispatch(setCurrentTitle(ejerNuevo.title));
      dispatch(setCurrentattachedDocument(ejerNuevo.attachedDocument));
      dispatch(setPosicionPorUnidad({ [String(numeroUnidad)]: nextPosition }));
      dispatch(setVerified(false));
      setEjercicioActual(ejerNuevo);

      if (lastSkill && lastSkill !== ejerNuevo.skill) {
        setNewSkillModalOpen(true);
      }

      lastSkill = ejerNuevo.skill;
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    const startUnitIndex = unidadesData?.[numeroUnidad]?.startIndex;
    dispatch(setUnidadStatus({ [numeroUnidad]: false }));
    const current = posicionPorUnidad?.[numeroUnidad] ?? 0;
    try {
      const previousPosition = current - 1;
      if (!isInThisUnit(previousPosition)) return navigate("/");

      setLoading(true);
      const [
        { data: ejerNuevo },
        {
          data: { atUnit },
        },
      ] = await Promise.all([
        getOneExercise(previousPosition + startUnitIndex),
        postUserPositions(String(numeroUnidad), previousPosition),
      ]);
      dispatch(setCloudData(ejerNuevo?.credentials));
      dispatch(setUser({ atUnit }));
      dispatch(setCurrent({ exerciseId: ejerNuevo._id }));
      dispatch(setCurrentSkill(ejerNuevo.skill));
      dispatch(setCurrentTitle(ejerNuevo.title));

      dispatch(setCurrentattachedDocument(ejerNuevo.attachedDocument));
      dispatch(setPosicionPorUnidad({ [numeroUnidad]: previousPosition }));
      dispatch(setVerified(false));
      setEjercicioActual(ejerNuevo);
      lastSkill = ejerNuevo.skill;
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (index) => {
    try {
      setLoading(true);
      if (!numeroUnidad || !displayUnidad || !tituloUnidad)
        return navigate("/");

      let current = posicionPorUnidad?.[numeroUnidad] ?? 0;
      const count = unidadesData?.[numeroUnidad]?.count;
      if (current === count) current--;
      const startUnitIndex = unidadesData?.[numeroUnidad]?.startIndex;

      if (startUnitIndex === undefined)
        return setError(
          `Aún no están cargados los ejercicios de la unidad ${numeroUnidad}.`
        );

      if (index === null || index === undefined) {
        const { data: indice } = await getUnidadIndice(displayUnidad);
        dispatch(setUnidadIndice(indice));
        index = startUnitIndex + current;
        dispatch(
          setPosicionPorUnidad({
            [String(numeroUnidad)]: current,
          })
        );
      } else
        dispatch(
          setPosicionPorUnidad({
            [String(numeroUnidad)]: index - startUnitIndex,
          })
        );

      const { data: ejercicio } = await getOneExercise(index);

      dispatch(setCloudData(ejercicio?.credentials));
      dispatch(setCurrent({ exerciseId: ejercicio._id }));
      dispatch(setCurrentSkill(ejercicio.skill));
      dispatch(setCurrentTitle(ejercicio.title));

      dispatch(setCurrentattachedDocument(ejercicio.attachedDocument));
      dispatch(setVerified(false));
      setEjercicioActual(ejercicio);

      lastSkill = ejercicio.skill;
    } catch (e) {
      console.log(e);
      setError();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      dispatch(setUnidadIndice(null));
    };
  }, []);

  useEffect(() => {
    if (ejercicioActual) {
      if (ejercicioActual.completedByUser) {
        dispatch(setCanContinue(true));
      } else {
        dispatch(setCanContinue(false));
      }
    }
  }, [ejercicioActual]);

  return (
    <div className="unidad-page">
      <div className="unidad-header-container">
        <div className="unidad-page-titles main-titles">
          <h1 className="game-unit-number">
            UNIDAD {displayUnidad}
          </h1>
          <div className="game-subtitle-container">
            <h3 className="game-unit-title">
              {tituloUnidad}
            </h3>
            {!isMobile && <p className="game-separator">/</p>}
            <p
              className="game-skill-name"
              style={{
                color: EXERCISE_SKILLS_COLORS[ejercicioActual?.skill],
              }}
            >
              {ejercicioActual?.skill}
            </p>
          </div>
        </div>
        <Button
          className="game-vocabulary-button"
          startIcon={<AutoStoriesIcon />}
          size="medium"
          onClick={() => dispatch(setVocabularyOpen(true))}
        >
          Vocabulario
        </Button>
      </div>
      {error ? (
        <p style={{ color: "red", margin: "10px" }}>
          {typeof error === "string"
            ? error
            : "No se pudieron cargar los datos."}
        </p>
      ) : (
        <div className="unidad-player">
          <UnidadIndice onNavigate={handleIndiceNavigate} />
          <UnidadControls
            progress={progress}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />
          {loading ? (
            <div
              style={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            ejercicioActual && <>
             {user?.profileApplied 
             && !user?.profileApplied?.['skills']?.includes(ejercicioActual?.skill?.toLowerCase()) 
             ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <h1 style={{ color: "red", margin: "10px" }}>No tienes acceso a este ejercicio.</h1>
              <p style={{ color: "red", margin: "10px" }}>Tu plan contratado no incluye ejercicios de {ejercicioActual?.skill}.</p>
              <Button variant="contained" color="secondary" onClick={() => navigate("/")} style={{ margin: "10px" }}>
                IR A INICIO
              </Button>
             </div>: 
                <ExerciseRenderer
                    ejercicio={ejercicioActual}
                    posicion={posicionPorUnidad?.[numeroUnidad] ?? 0}
                  />
              }
            </>
          )}
        </div>
      )}
      <Modal open={showUnitFinished} onClose={() => navigate("/")}>
        <Bounce>
          <div className="nsm-container" onClick={() => navigate("/")}>
            <div className="nsm-center" onClick={(e) => e.stopPropagation()}>
              <h2>¡Felicidades!</h2>
              <DotLottiePlayer
                src={"animations/completed.lottie"}
                autoplay
                style={{
                  height: "50vh",
                }}
              ></DotLottiePlayer>
              <p style={{ padding: "20px" }}>
                Finalizaste la unidad <b>{displayUnidad}</b>
              </p>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/")}
              >
                IR A INICIO
              </Button>
            </div>
          </div>
        </Bounce>
      </Modal>
      <ExplanationModal />
      <GradeModal nextExercise={handleNext} />
      <VocabularyModal />
      <NewSkillModal
        open={newSkillModalOpen}
        onClose={() => setNewSkillModalOpen(false)}
        skill={ejercicioActual?.skill}
      />
    </div>
  );
};
