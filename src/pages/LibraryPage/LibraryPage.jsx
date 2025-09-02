import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import './LibraryPage.css';

const library = {
  General: {
    "Resumen Situaciones Laborales":
      "https://drive.google.com/file/d/1mj-p0N6F64FWiqxQugHFkzERnw5jPmlY/view?",
    "Resumen Situaciones Académicas":
      "https://drive.google.com/file/d/1hhKgnBP1RZpJhpbxCsU9mXM2Az_Ihghg/view?",
    "Resumen Situaciones Socio-Turísticas":
      "https://drive.google.com/file/d/1zYATtjR6OnT7ZL7nJGt_TCucGvtL64Ms/view?",
    "Skill Level Summaries":
      "https://drive.google.com/file/d/1kSzgzineu3G0c30vPUihQWU6u5FS7krm/view",
    "Reglas de Acentuación":
      "https://drive.google.com/file/d/1Lh1QYqmZKIRskb6lGX35pprlyxvMTZv8/view",
  },
  "Unidad 4": {
    "FÓRMULAS Present Simple":
      "https://drive.google.com/file/d/1-oikIKXMAEGcHuV2c4cg3JHKPFHuAkUI/view?usp=share_link",
  },
  "Unidad 5": {
    "FÓRMULAS Present Continuous":
      "https://drive.google.com/file/d/1ClCFdFtE7BFuenOClYYs3J9KOzgrvN0H/view?usp=share_link",
  },
  "Unidad 6": {
    "FÓRMULAS Past Simple":
      "https://drive.google.com/file/d/1TweSDxzqW9ac49uH0CEef0ViKs481Ztx/view?usp=share_link",
  },
  "Unidad 7": {
    "FÓRMULAS Past Continuous":
      "https://drive.google.com/file/d/1ubik3zbJ-ImN0Aete89zCbUksILNVvLD/view?usp=share_link",
  },
  "Unidad 11": {
    "FÓRMULAS Present Perfect Simple":
      "https://drive.google.com/file/d/1OyGx6aerv3A2RrGokJV0ce_ZaAHEz-6u/view?usp=share_link",
  },
  "Unidad 12": {
    "FÓRMULAS Present Perfect Continuous":
      "https://drive.google.com/file/d/17QSH6JXWlk9Sn3UU-l4rvkoAYnv1kZ2t/view?usp=share_link",
  },
  "Unidad 14": {
    "FÓRMULAS Past Perfect Simple":
      "https://drive.google.com/file/d/1_i-ZipRd8H4zOORQzwrmZSxsZaXr3dDD/view?usp=share_link",
  },
  "Unidad 15": {
    "FÓRMULAS Past Perfect Continuous":
      "https://drive.google.com/file/d/1M_Gh8NNcH_jn2zHVz90S6OdLSIiiCetU/view?usp=share_link",
  },
  "Unidad 18": {
    "FÓRMULAS Future Simple":
      "https://drive.google.com/file/d/1im7RwuW1gLgBNetXvRPaxkvW0o_0lgzH/view?usp=share_link",
  },
  "Unidad 27": {
    "FÓRMULAS Future Continuous":
      "https://drive.google.com/file/d/1OiDRTIMkFd_N3F46X32reEH3BS-ovFDk/view?usp=share_link",
  },
  "Unidad 28": {
    "FÓRMULAS Future Perfect Simple":
      "https://drive.google.com/file/d/1tWqXbf7xB1UeQqMtDlLKshZqOBjo2m-q/view?usp=share_link",
  },
  "Unidad 31": {
    "FÓRMULAS Future Perfect Continuous":
      "https://drive.google.com/file/d/1QfpbQ7iXHC8m-Owruvf00oTp89STiWbs/view?usp=share_link",
  },
  "Unidad 39": {
    "London Underground Map":
      "https://drive.google.com/file/d/1XugbnXDCqz9fXOa_3VJWNl4cAKDH0lKd/view",
  },
};

// Unit configuration with emojis, colors, and descriptions
const unitConfig = {
  "General": {
    emoji: "🌟",
    color: "#ff6b9d",
    description: "Recursos generales y guías de estudio",
    gradient: "linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)"
  },
  "Unidad 4": {
    emoji: "📝",
    color: "#58cc02",
    description: "Present Simple - Tiempo presente básico",
    gradient: "linear-gradient(135deg, #58cc02 0%, #4caf50 100%)"
  },
  "Unidad 5": {
    emoji: "⏰",
    color: "#1cb0f6",
    description: "Present Continuous - Acciones en progreso",
    gradient: "linear-gradient(135deg, #1cb0f6 0%, #0ea5e9 100%)"
  },
  "Unidad 6": {
    emoji: "📚",
    color: "#ffc800",
    description: "Past Simple - Tiempo pasado básico",
    gradient: "linear-gradient(135deg, #ffc800 0%, #ffb700 100%)"
  },
  "Unidad 7": {
    emoji: "🔄",
    color: "#ff9600",
    description: "Past Continuous - Acciones pasadas continuas",
    gradient: "linear-gradient(135deg, #ff9600 0%, #f57c00 100%)"
  },
  "Unidad 11": {
    emoji: "✅",
    color: "#ce82ff",
    description: "Present Perfect Simple - Experiencias",
    gradient: "linear-gradient(135deg, #ce82ff 0%, #b968ff 100%)"
  },
  "Unidad 12": {
    emoji: "🔥",
    color: "#ff4757",
    description: "Present Perfect Continuous - Duración",
    gradient: "linear-gradient(135deg, #ff4757 0%, #ff3742 100%)"
  },
  "Unidad 14": {
    emoji: "⭐",
    color: "#2ed573",
    description: "Past Perfect Simple - Pasado anterior",
    gradient: "linear-gradient(135deg, #2ed573 0%, #1dd1a1 100%)"
  },
  "Unidad 15": {
    emoji: "💫",
    color: "#a4b0be",
    description: "Past Perfect Continuous - Duración pasada",
    gradient: "linear-gradient(135deg, #a4b0be 0%, #8395a7 100%)"
  },
  "Unidad 18": {
    emoji: "🚀",
    color: "#3742fa",
    description: "Future Simple - Tiempo futuro básico",
    gradient: "linear-gradient(135deg, #3742fa 0%, #2f3542 100%)"
  },
  "Unidad 27": {
    emoji: "🌊",
    color: "#70a1ff",
    description: "Future Continuous - Futuro continuo",
    gradient: "linear-gradient(135deg, #70a1ff 0%, #5352ed 100%)"
  },
  "Unidad 28": {
    emoji: "🎯",
    color: "#ff6348",
    description: "Future Perfect Simple - Futuro perfecto",
    gradient: "linear-gradient(135deg, #ff6348 0%, #ff4757 100%)"
  },
  "Unidad 31": {
    emoji: "👑",
    color: "#ffa502",
    description: "Future Perfect Continuous - Maestría",
    gradient: "linear-gradient(135deg, #ffa502 0%, #ff6348 100%)"
  },
  "Unidad 39": {
    emoji: "🗺️",
    color: "#747d8c",
    description: "Mapas y recursos especiales",
    gradient: "linear-gradient(135deg, #747d8c 0%, #57606f 100%)"
  }
};

// Helper function to get unit-specific CSS class
const getUnitClass = (title) => {
  return title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/ñ/g, 'n')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
};

// Sparkle component for floating animations
const SparkleEffect = () => (
  <>
    <span className="library-sparkle">✨</span>
    <span className="library-sparkle">⭐</span>
    <span className="library-sparkle">💫</span>
    <span className="library-sparkle">🌟</span>
  </>
);

// Unit Card Component
const UnitCard = ({ title, resources, config, onClick }) => {
  const resourceCount = Object.keys(resources).length;
  
  return (
    <div 
      className={`unit-card ${getUnitClass(title)}`}
      onClick={() => onClick(title, resources)}
      style={{ background: config.gradient }}
    >
      <div className="unit-card-content">
        <div className="unit-emoji">{config.emoji}</div>
        <h3 className="unit-title">{title}</h3>
        <p className="unit-description">{config.description}</p>
        <div className="unit-stats">
          <span className="resource-count">
            📄 {resourceCount} recurso{resourceCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="unit-card-shine"></div>
    </div>
  );
};

// Resources Modal Component
const ResourcesModal = ({ open, onClose, title, resources, config }) => {
  if (!config) return null;
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="resources-modal"
    >
      <Box className="resources-modal-content">
        <div className="modal-header" style={{ background: config.gradient }}>
          <div className="modal-header-content">
            <span className="modal-emoji">{config.emoji}</span>
            <div>
              <h2 className="modal-title">{title}</h2>
              <p className="modal-subtitle">{config.description}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="modal-close-btn"
          >
            <CloseIcon />
          </Button>
        </div>
        
        <div className="modal-body">
          <div className="resources-grid">
            {Object.entries(resources).map(([docTitle, url], index) => (
              <Button
                key={index}
                variant="contained"
                startIcon={<OpenInNewIcon />}
                onClick={() => window.open(url, "_blank")}
                className="resource-card-button"
                style={{ 
                  background: config.gradient,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {docTitle}
              </Button>
            ))}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const LibraryPage = () => {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUnitClick = (title, resources) => {
    setSelectedUnit({ title, resources });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUnit(null);
  };

  return (
    <div className="library-page">
      <SparkleEffect />
      
      <div className="library-header">
        <h1 className="library-page-title">
          Biblioteca de Recursos
        </h1>
        <p className="library-subtitle">
          🎯 Explora recursos útiles para cada unidad de aprendizaje
        </p>
      </div>

      <div className="units-grid">
        {Object.entries(library).map(([title, resources]) => (
          <UnitCard
            key={title}
            title={title}
            resources={resources}
            config={unitConfig[title]}
            onClick={handleUnitClick}
          />
        ))}
      </div>

      {selectedUnit && (
        <ResourcesModal
          open={modalOpen}
          onClose={handleCloseModal}
          title={selectedUnit.title}
          resources={selectedUnit.resources}
          config={unitConfig[selectedUnit.title]}
        />
      )}
    </div>
  );
};
