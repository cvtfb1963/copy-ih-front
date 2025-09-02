import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useScreenSize } from "../../hooks/useScreenSize";
import { getImagen } from "../../services/FilesService";
import "./descriptionRenderer.css";

export const EXERCISE_SKILLS_COLORS = {
  Grammar: "#58cc02",
  Listening: "#ce82ff",
  Pronunciation: "#1cb0f6",
  Speaking: "#ffc800",
  Reading: "#ff4b4b",
  Writing: "#ff6b9d",
  Vocabulary: "#58cc02",
};

export const EXERCISE_SKILLS_GRADIENTS = {
  Grammar: "linear-gradient(135deg, #58cc02 0%, #46a302 100%)",
  Listening: "linear-gradient(135deg, #ce82ff 0%, #b968ff 100%)",
  Pronunciation: "linear-gradient(135deg, #1cb0f6 0%, #1899d6 100%)",
  Speaking: "linear-gradient(135deg, #ffc800 0%, #ff9600 100%)",
  Reading: "linear-gradient(135deg, #ff4b4b 0%, #dc2626 100%)",
  Writing: "linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)",
  Vocabulary: "linear-gradient(135deg, #58cc02 0%, #46a302 100%)",
};

export const EXERCISE_SKILLS_EMOJIS = {
  Grammar: "📝",
  Listening: "👂",
  Pronunciation: "🗣️",
  Speaking: "💬",
  Reading: "📖",
  Writing: "✍️",
  Vocabulary: "🧠",
};

export const TitleRenderer = () => {
  const {
    current: { skill, title },
  } = useSelector((state) => state.datos);

  const { isMobile } = useScreenSize();

  return (
    <div className="game-title-container">
      <div className="game-title-wrapper">
        <div className="game-title-emoji">{EXERCISE_SKILLS_EMOJIS[skill]}</div>
        <h2
          className="game-title"
          style={{
            background: EXERCISE_SKILLS_GRADIENTS[skill],
            fontSize: isMobile ? "1rem" : "1.4rem",
          }}
        >
          {title}
        </h2>
        <div className="game-title-stars">
          <span className="star">⭐</span>
          <span className="star">⭐</span>
          <span className="star">⭐</span>
        </div>
      </div>
    </div>
  );
};

export const DescriptionRenderer = ({ ejercicio, bold, ignoreImage }) => {
  const descriptions = [];
  const [imagen, setImagen] = useState(undefined);
  const [loadingImagen, setLoadingImagen] = useState(undefined);
  const { isMobile } = useScreenSize();

  if (!ejercicio.description) return null;

  if (ejercicio.description) descriptions.push(ejercicio.description);

  const fetchImagen = async () => {
    setLoadingImagen(true);

    try {
      const imagen = await getImagen(ejercicio.imagen);

      setImagen(URL.createObjectURL(imagen.data));
    } catch (e) {
      console.log(e);
      toast("Ocurrió un error, no se pudo cargar la imagen", { type: "error" });
    } finally {
      setLoadingImagen(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (ejercicio.imagen && !ignoreImage) fetchImagen();
  }, []);

  let found = false;
  let acc = 2;
  while (!found) {
    const target = ejercicio[`description${acc}`];
    if (!target) found = true;
    else descriptions.push(target);
    acc++;
  }

  return (
    <div className="game-description-container">
      {loadingImagen ? (
        <div className="game-loading-container">
          <div className="game-loading-spinner">
            <CircularProgress size={60} style={{ color: '#58cc02' }} />
          </div>
          <p className="game-loading-text">Cargando imagen... 🎨</p>
        </div>
      ) : imagen ? (
        <div className="game-image-container">
          <div className="game-image-wrapper">
            <img
              src={imagen}
              className="game-image"
              style={{
                maxWidth: isMobile ? "90%" : "700px",
                maxHeight: isMobile ? "90%" : "700px",
              }}
              alt="Exercise illustration"
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="game-description-content">
        {descriptions.map((desc, i1) =>
          desc.split("<br>").map((part, i) => (
            <p 
              key={`dr-desc-${i1}-${i}`} 
              className="game-description-text"
              style={{ fontWeight: bold ? 600 : 500 }}
            >
              {part}
            </p>
          ))
        )}
      </div>
    </div>
  );
};
