import { DotLottiePlayer } from "@dotlottie/react-player";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, CircularProgress, Modal, Slide } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVocabularyByUnit } from "../../services/VocabularyService";
import { setVocabulary, setVocabularyOpen } from "../../store/datosSlice";
import { AudioPlayer } from "../AudioPlayer/AudioPlayer";

export const VocabularyModal = () => {
  const { current } = useSelector((state) => state.datos);
  const [loading, setLoading] = useState(false);
  const [vocabularyNotLoadedYet, setVocabularyNotLoadedYet] = useState(false);

  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setVocabularyOpen(false));
  };

  const getVocabulary = async () => {
    setLoading(true);
    try {
      let { data } = await getVocabularyByUnit(current?.numeroUnidad);
      dispatch(setVocabulary(data));
      setVocabularyNotLoadedYet(false);
    } catch (e) {
      setVocabularyNotLoadedYet(true);
      console.log("Error getting vocabulary: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (current?.vocabulary?.unidad == current?.numeroUnidad) setLoading(false);
    else getVocabulary();
  }, []);

  return (
    <Modal open={current?.vocabularyOpen} onClose={onClose}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={onClose}
      >
        <Slide
          in={current?.vocabularyOpen}
          direction="left"
          mountOnEnter
          unmountOnExit
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "white",
              padding: "10px",
              borderRadius: "20px",
              minWidth: "315px",
              maxHeight: "95vh",
              maxWidth: "95vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <CircularProgress />
            ) : !vocabularyNotLoadedYet ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "90vh",
                  overflowY: "scroll",
                }}
              >
                {current?.vocabulary?.dictionaries.map((dictionary, i) => (
                  <div
                    style={{ width: "95%", margin: "0 auto 10px auto" }}
                    key={`dictionari-${i}`}
                  >
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <p className="poppins-bold">{dictionary.title}</p>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "90vh",
                            overflowY: "scroll",
                          }}
                        >
                          {dictionary.title && (
                            <p
                              className="poppins-extrabold"
                              style={{ fontSize: "1.5rem", height: "2rem" }}
                            >
                              {dictionary.title}
                            </p>
                          )}
                          {dictionary.titleTranslation && (
                            <p
                              className="poppins-regular"
                              style={{ fontSize: "1rem" }}
                            >
                              {dictionary.titleTranslation}
                            </p>
                          )}
                          {dictionary.audio && (
                            <AudioPlayer
                              audioName={dictionary.audio}
                              justEnglish
                            />
                          )}
                          <table style={{ flex: 1, padding: "20px" }}>
                            <thead>
                              <tr>
                                <td
                                  style={{ minWidth: 40, fontSize: "1.3rem" }}
                                  className="poppins-semibold"
                                >
                                  N°
                                </td>
                                <td
                                  style={{ minWidth: 200, fontSize: "1.3rem" }}
                                  className="poppins-semibold"
                                >
                                  Palabra
                                </td>
                                <td
                                  style={{ minWidth: 200, fontSize: "1.3rem" }}
                                  className="poppins-semibold"
                                >
                                  Traducción
                                </td>
                                <td
                                  style={{ minWidth: 200, fontSize: "1.3rem" }}
                                  className="poppins-semibold"
                                >
                                  Sonido
                                </td>
                                <td
                                  style={{ minWidth: 200, fontSize: "1.3rem" }}
                                  className="poppins-semibold"
                                >
                                  Ejemplos
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {dictionary.list &&
                                dictionary.list?.map((element, i) => (
                                  <tr
                                    key={`v-l-i-${i}`}
                                    style={{
                                      background:
                                        i % 2 == 0 ? "#e6edfa" : "#f7f9fc",
                                    }}
                                  >
                                    <td>
                                      <span
                                        style={{
                                          padding: "5px",
                                          borderRadius: "50%",
                                          backgroundColor:
                                            "var(--quaternary-color)",
                                          width: "30px",
                                          height: "30px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          color: "white",
                                          fontWeight: "600",
                                          fontSize: "20px",
                                          margin: "10px auto",
                                        }}
                                      >
                                        {i + 1}
                                      </span>
                                    </td>
                                    <td style={{ padding: "5px" }}>
                                      {element.word}
                                    </td>
                                    <td style={{ padding: "5px" }}>
                                      {element.translation}
                                    </td>
                                    <td style={{ padding: "5px" }}>
                                      {element.sound}
                                    </td>
                                    <td style={{ padding: "5px" }}>
                                      {element.examples.join("; ")}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p className="poppins-regular">
                  Aún no hemos cargado el vocabulario de esta unidad.{" "}
                  <span className="poppins-semibold">
                    ¡Estamos trabajando en ello!
                  </span>
                </p>
                <DotLottiePlayer
                  src={"animations/maintenance.lottie"}
                  autoplay
                  loop
                  style={{ height: "130px" }}
                />
              </div>
            )}
            <div
              style={{
                margin: "0 10px 0 10px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button fullWidth onClick={onClose}>
                CERRAR
              </Button>
            </div>
          </div>
        </Slide>
      </div>
    </Modal>
  );
};
