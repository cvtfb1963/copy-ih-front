import { CircularProgress, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getVideoCredentials } from "../../services/VdocipherService";
import "./floatingVideo.css";

export const FloatingVideo = ({ videoID, removeMarginBottom }) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState();
  const [error, setError] = useState();
  const { current } = useSelector((state) => state.datos);

  const fetchVideoData = async () => {
    if (videoID.includes("https")) {
      setVideoOpen(false);
      return window.open(videoID, "_blank");
    }
    setLoading(true);
    try {
      const { data } = await getVideoCredentials(videoID);
      setVideoData(data);
    } catch (e) {
      console.log(e);
      setError(true);
    }
    setLoading(false);
  };

  const openAttachedDocument = (link) => window.open(link, "_blank");

  useEffect(() => {
    const init = async () => {
      if (videoOpen) {
        if (!videoID) {
          setVideoOpen(false);
          return toast(
            "Lo sentimos. Aún no hemos cargado el video instructivo para este ejercicio 😌",
            { type: "error" }
          );
        }
        await fetchVideoData();
      }
    };
    init();
  }, [videoOpen]);

  return (
    <div className="floating-video-container">
      {/* Floating Instructions Button - Bottom Left */}
      <div className="floating-instructions-wrapper">
        <button className="floating-instructions-button" onClick={() => setVideoOpen(true)}>
          <span className="floating-camera-icon">🎥</span>
          <span className="floating-instructions-text">Instrucciones</span>
          <span className="floating-sparkle">✨</span>
        </button>
      </div>

      {/* Document Button - Only show if exists, in original position */}
      {current?.attachedDocument && (
        <div className="floating-video-buttons">
          <div className="floating-video-button-wrapper" style={{ marginBottom: removeMarginBottom ? 0 : '20px' }}>
            <button 
              className="game-floating-button document-button"
              onClick={() => openAttachedDocument(current.attachedDocument)}
            >
              <span className="game-floating-emoji">📎</span>
              <span className="game-floating-text">Ver documento adjunto</span>
              <span className="game-floating-sparkle">⭐</span>
            </button>
          </div>
        </div>
      )}

      <Modal open={videoOpen} onClose={() => setVideoOpen(false)}>
        <div className="game-video-modal-backdrop" onClick={() => setVideoOpen(false)}>
          <div className="game-video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="game-video-modal-header">
              <div className="game-video-title">
                <span className="game-video-emoji">🎬</span>
                <h3>Video Instructivo</h3>
                <span className="game-video-emoji">🍿</span>
              </div>
            </div>

            <div className="game-video-content-scrollable">
              <div className="game-video-content">
                {loading ? (
                  <div className="game-video-loading">
                    <div className="game-loading-spinner-video">
                      <CircularProgress size={60} style={{ color: '#58cc02' }} />
                    </div>
                    <p className="game-loading-text-video">Cargando video... 🎬</p>
                  </div>
                ) : error ? (
                  <div className="game-video-error">
                    <span className="error-emoji">😔</span>
                    <p>No se pudo cargar el video.</p>
                    <span className="error-emoji">📺</span>
                  </div>
                ) : (
                  <div className="game-video-player">
                    <iframe
                      src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
                      className="game-iframe"
                      allow="encrypted-media"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="game-video-actions-sticky">
              <button className="game-video-close-button" onClick={() => setVideoOpen(false)}>
                <span className="game-button-emoji">❌</span>
                <span>CERRAR</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
