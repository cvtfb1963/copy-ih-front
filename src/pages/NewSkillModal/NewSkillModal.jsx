import { DotLottiePlayer } from "@dotlottie/react-player";
import { Button, Modal } from "@mui/material";
import { useSelector } from "react-redux";
import { Bounce } from "react-reveal";
import { EXERCISE_ANIMATIONS } from "../../components/StatisticsShower/StatisticsShower";
import "./newSkillModal.css";

export const NewSkillModal = ({ open, onClose, skill }) => {
  const {
    current: { displayUnidad },
  } = useSelector((state) => state.datos);

  if (!skill) return;

  return (
    <Modal open={open} onClose={onClose}>
      <Bounce>
        <div className="nsm-container" onClick={onClose}>
          <div className="nsm-center" onClick={(e) => e.stopPropagation()}>
            <h2>¡Felicidades!</h2>
            <DotLottiePlayer
              src={EXERCISE_ANIMATIONS[skill.toUpperCase()]}
              autoplay
              loop
              style={{
                height: "50vh",
              }}
            ></DotLottiePlayer>
            <p style={{ padding: "20px" }}>
              Has comenzado la sección <b>{skill}</b> de la{" "}
              <b>Unidad {displayUnidad}</b>
            </p>
            <Button variant="contained" color="secondary" onClick={onClose}>
              CONTINUAR
            </Button>
          </div>
        </div>
      </Bounce>
    </Modal>
  );
};
