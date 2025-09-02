import { useAuth0 } from "@auth0/auth0-react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LanguageIcon from "@mui/icons-material/Language";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Button, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { Zoom } from "react-reveal";
import { useNavigate } from "react-router-dom";
import { ENV } from "../../../env";
import LogoCompleto from "../../assets/logo/logo-completo.png";
import Logo from "../../assets/logo/logo-corto.png";
import { useScreenSize } from "../../hooks/useScreenSize";
import "./landingPage.css";

const videos = [
  "https://drive.google.com/file/d/1Bj5rNIkqHsyjBOT5GJiitylcUtHUuSIE/preview",
];

const email = "info@ihingles.com";

const navOptions = [
  {
    option: "Inicio",
    optionId: "landing-inicio-section",
  },
  {
    option: "Ventajas",
    optionId: "landing-ventajas-section",
  },
  {
    option: "Método",
    optionId: "landing-metodo-section",
  },
  {
    option: "Testimonios",
    optionId: "landing-testimonios-section",
  },
  {
    option: "Fundador",
    link: "/founder",
  },
  {
    option: "Contacto",
    optionId: "landing-contacto-section",
  },
];

const videosTestimonios = [
  "https://drive.google.com/file/d/1Tp5eVXLrYM0QLn0ICcrITjY7In3Dkc0R/preview",
  "https://drive.google.com/file/d/1Z4nP0-nIhnnCK2k4v4BYk9lB6NL9eto6/preview",
  "https://drive.google.com/file/d/1XjqMdWE1-PuF_tdSVG-siBaN-Cns4XIx/preview",
  "https://drive.google.com/file/d/1qwX77EUht43CYyRJFVxLy9N9J0emg5y9/preview",
  "https://drive.google.com/file/d/1S2HQKSk_wM2kUoJOO8rD1nKSb-4Nk0rY/preview"
];

const ventajas = [
  {
    title: "Plataforma Digital",
    desc: "Trajimos el mejor método de aprendizaje a la virtualidad para que puedas aprenderlo desde cualquier parte del mundo.",
    icon: <LanguageIcon style={{ color: "#FFF" }} fontSize="large" />,
    color: "#9848FF",
  },
  {
    title: "Método Comprobado",
    desc: "Años de estudio y análisis derivaron en la creación del efectivo método de aprendizaje de Carlos Valles.",
    icon: <TipsAndUpdatesIcon style={{ color: "#FFF" }} fontSize="large" />,
    color: "#A7CE4A",
  },
  {
    title: "Material Completo",
    desc: "Aprende todas las partes del lenguaje: Grammar, Listening, Pronunciation, Speaking, Reading & Writing.",
    icon: <AutoFixHighIcon style={{ color: "#FFF" }} fontSize="large" />,
    color: "#4D93DF",
  },
  {
    title: "Plataforma Interactiva",
    desc: "Una aplicación interactiva donde disfrutes aprender mediante cada ejercicio y cada metodología.",
    icon: <RecordVoiceOverIcon style={{ color: "#FFF" }} fontSize="large" />,
    color: "#FF60A8",
  },
  {
    title: "Tiempo Flexible",
    desc: "Trasladar el método de Carlos Valles a la digitalidad le permite a nuestros alumnos estudiar a la hora que ellos deseen.",
    icon: <WatchLaterIcon style={{ color: "#FFF" }} fontSize="large" />,
    color: "#F66742",
  },
  {
    title: "Confiable",
    desc: "Todos nuestros alumnos quedan fascinados y felices con los resultados. ",
    icon: <FavoriteIcon style={{ color: "#FFF" }} fontSize="large" />,
    color: "#FFCF59",
  },
];

export const LandingPage = () => {
  const { isMobile } = useScreenSize();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [currentNavItem, setCurrentNavItem] = useState(navOptions[0].optionId);
  const [animationModalDisplay, setAnimationModalDisplay] = useState("initial");
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!contactModalOpen) setAnimationModalDisplay("initial");
  }, [contactModalOpen]);

  const navigate = useNavigate();

  const goToLogin = () => loginWithRedirect();

  return (
    <div className="landing-container">
      <div className="landing-navbar">
        <div style={{ flex: 1 }}>
          <img src={Logo} />
        </div>
        <div className="landing-navbar-center">
          {navOptions.map((option, i) => (
            <NavbarOption
              key={`l-n-${i}`}
              option={option.option}
              optionId={option.optionId}
              link={option.link}
              current={currentNavItem}
              setCurrent={setCurrentNavItem}
            />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <button
            className="poppins-bold landing-nav-login-button button"
            onClick={goToLogin}
          >
            Ingresar
          </button>
        </div>
      </div>
      {isMobile && <div style={{ height: 60 }}></div>}
      <div
        id="landing-inicio-section"
        className="landing-section landing-inicio"
      >
        <div className="landing-inicio-izquierda">
          <p
            // className="poppins-medium"
            style={{ lineHeight: "40px", fontSize: "40px", marginBottom: "10px", marginTop: "80px" }}
          >
            <span className="poppins-extrabold">Domina el Inglés</span> con el
            Método IH en solo<span className="poppins-extrabold"> 8 meses</span>{" "}
            dedicando{" "}
            <span className="poppins-extrabold">30 minutos al día</span>
          </p>
          <p className="poppins-regular" style={{ fontSize: "1rem" }}>
            IH es una plataforma para aprender inglés dirigida a estudiantes de
            habla hispana. Utiliza un efectivo e innovador método creado para
            identificar las estructuras que utilizamos en el castellano y poner
            su equivalente en la lengua inglesa.
          </p>
          <div className="landing-inicio-izquierda-buttons">
            <button
              className="landing-inicio-izquierda-button-1 poppins-bold button"
              onClick={() => window.open(ENV.calendly_link, "_blank")}
            >
              EMPIEZA AHORA
            </button>
            <a
              href="#landing-metodo-section"
              className="landing-inicio-izquierda-button-2 poppins-bold button"
            >
              <PlayCircleIcon style={{ color: "#525FE1" }} /> Conocer más
            </a>
          </div>
        </div>
        <div className="landing-inicio-derecha">
          <DotLottiePlayer
            src={"animations/learning.lottie"}
            autoplay
            loop
            style={{
              height: "50vh",
            }}
          ></DotLottiePlayer>
        </div>
      </div>
      <div
        id="landing-ventajas-section"
        className="landing-section landing-ventajas"
      >
        <p
          className="poppins-regular"
          style={{
            fontSize: "2rem",
            color: "#1C1C1C",
            margin: "10px 20px 0 20px",
          }}
        >
          <span className="poppins-bold" style={{ color: "#525FE1" }}>
            ¿Por qué somos
          </span>{" "}
          tu mejor elección?
        </p>
        <p
          className="poppins-regular"
          style={{ color: "#333333", fontSize: "0.8rem", margin: "10px 20px" }}
        >
          Aquí te presentamos algunas de las ventajas que presenta nuestra
          plataforma
        </p>
        <div className="landing-ventajas-cajas-container">
          {ventajas.map((ventaja, i) => (
            <VentajasCaja key={`lv-${i}`} {...ventaja} />
          ))}
        </div>
      </div>
      <div
        id="landing-metodo-section"
        className="landing-section metodo-section"
      >
        <p
          className="poppins-regular"
          style={{
            fontSize: "2rem",
            color: "#1C1C1C",
            margin: "10px 20px 0 20px",
          }}
        >
          ¿Qué es lo que nos hace{" "}
          <span className="poppins-bold" style={{ color: "#525FE1" }}>
            ser únicos?
          </span>
        </p>
        <p
          className="poppins-regular"
          style={{ color: "#333333", fontSize: "0.8rem", margin: "10px 20px" }}
        >
          El siguiente video proporciona más información sobre el curso de IH
        </p>
        <div className="landing-metodo-video-container">
          {videos.map((video, i) => (
            <iframe
              key={`landing-video-${i}`}
              width="100%"
              height="100%"
              src={video}
              title=""
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              style={{
                borderRadius: "10px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            ></iframe>
          ))}
        </div>
      </div>

      <div
        id="landing-testimonios-section"
        className="landing-section metodo-section"
      >
        <p
          className="poppins-regular"
          style={{
            fontSize: "2rem",
            color: "#1C1C1C",
            margin: "10px 20px 0 20px",
          }}
        >
          +1000 alumnos ya dominan el inglés con el
          <span className="poppins-bold" style={{ color: "#525FE1" }}>
            {" "}
            método IH
          </span>
        </p>
        <p
          className="poppins-regular"
          style={{ color: "#333333", fontSize: "0.8rem", margin: "10px 20px" }}
        >
          Estos son algunos de nuestros alumnnos que elijen dar testimonio de
          sus resultados
        </p>
        <div
          className="landing-metodo-video-container"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {videosTestimonios.map((video, i) => (
            <iframe
              key={`landing-video-${i}`}
              width={isMobile ? "80%" : "100%"}
              height="100%"
              src={video}
              title=""
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              style={{
                borderRadius: "10px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                maxWidth: 200,
              }}
            ></iframe>
          ))}
        </div>
      </div>

      <p
        className="poppins-regular"
        style={{
          fontSize: "1.8rem",
          color: "#1C1C1C",
          margin: "10px 20px 0 20px",
        }}
      >
        La única garantía que te devuelve el{" "}
        <span className="poppins-bold" style={{ color: "#525FE1" }}>
          100% del dinero
        </span>{" "}
        si el Método IH Inglés no te funciona.
      </p>
      <p className="poppins-medium"></p>

      <p
        className="poppins-regular"
        style={{
          fontSize: "1.4rem",
          margin: "10px 20px 0 20px",
        }}
      >
        Prueba el método de IH. No tienes nada que perder.
      </p>

      <button
        className="landing-inicio-izquierda-button-1 poppins-bold button"
        onClick={() => window.open(ENV.calendly_link, "_blank")}
        style={{ margin: 20 }}
      >
        SOLICITA MÁS INFORMACIÓN
      </button>

      <div
        id="landing-contacto-section"
        className="landing-section contacto-section"
        style={{ marginTop: 10, marginBottom: 30 }}
      >
        <button
          className="landing-nav-login-button button"
          onClick={() => setContactModalOpen(true)}
        >
          CONTACTAR A IH INGLES
        </button>
      </div>
      {/* <div
        id="landing-precios-section"
        className="landing-section landing-ventajas"
      >
        <p
          className="poppins-regular"
          style={{
            fontSize: "2rem",
            color: "#1C1C1C",
            margin: "10px 20px 0 20px",
          }}
        >
          <span className="poppins-bold" style={{ color: "#525FE1" }}>
            Nuestros
          </span>{" "}
          precios
        </p>
        <div className="landing-precios-cajas-container">
          <div className="landing-precios-container">
            <div className="landing-precios-caja">
              <img src={Student} />
              <p className="poppins-bold landing-precios-caja-title">
                Soy un estudiante
              </p>
              <p className="poppins-regular landing-precios-caja-desc">
                Nuetra plataforma está diseñada justamente para ti. Cuenta con
                17 módulos con un precio de $99 c/u. La duración estimada del
                curso es de 17 meses. Te invitamos a conocerla y conocer los
                unidades gratuitas que otorgamos a todos nuestros nuevos
                alumnos.
              </p>
            </div>
            <button
              className="landing-precios-button poppins-bold button"
              onClick={goToLogin}
            >
              QUIERO COMENZAR
            </button>
          </div>
          <div className="landing-precios-container">
            <div className="landing-precios-caja">
              <img src={Teacher} />
              <p className="poppins-bold landing-precios-caja-title">
                Profesor / Institución
              </p>
              <p className="poppins-regular landing-precios-caja-desc">
                Hemos preparado algo especial para tí. Pensando en tu situación,
                hemos re-adaptado nuestra plataforma para que puedas enseñas a
                tus alumnos con el efectivo método de Carlos Valles. Ponte en
                contacto con nosotros para obtener más detalles.
              </p>
            </div>
            <button
              className="landing-precios-button poppins-bold button"
              onClick={() => setContactModalOpen(true)}
            >
              CONTACTANOS
            </button>
          </div>
        </div>
      </div> */}
      <div className="landing-footer">
        <img src={LogoCompleto} />
        <div className="landing-footer-list">
          <h3 className="poppins-bold" style={{ color: "#fff" }}>
            Sobre el servicio
          </h3>
          <p
            className="work-sans-regular"
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={() => navigate("/terms-of-service")}
          >
            Términos y Condiciones
          </p>
          <p
            className="work-sans-regular"
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={() => navigate("/privacy-policie")}
          >
            Política de privacidad
          </p>
        </div>
      </div>
      <Modal open={contactModalOpen} onClose={() => setContactModalOpen(false)}>
        <Zoom>
          <div
            className="nsm-container"
            onClick={() => setContactModalOpen(false)}
          >
            <div className="nsm-center" onClick={(e) => e.stopPropagation()}>
              <h2>¡Hablemos!</h2>
              <DotLottiePlayer
                src={"animations/email.lottie"}
                autoplay
                onEvent={(event) => {
                  if (event === "complete") setAnimationModalDisplay("none");
                }}
                style={{
                  height: "30vh",
                  display: animationModalDisplay,
                }}
              ></DotLottiePlayer>
              <button
                className="landing-inicio-izquierda-button-1 poppins-bold button"
                onClick={() =>
                  window.open(`https://wa.me/${ENV.telefono}`, "_blank")
                }
                style={{
                  width: 250,
                  display: "flex",
                  alignItems: "center",
                  height: 70,
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <span style={{ padding: 5, fontSize: 15 }}>
                  ¡Contáctanos por Whatsapp!
                </span>
                <WhatsAppIcon
                  style={{ marginRight: 5 }}
                  color="success"
                  fontSize="large"
                />
              </button>

              <p style={{ padding: "20px" }}>
                Si no deseas usar Whatsapp, puedes enviarnos un correo a{" "}
                <b>{email}</b> y te responderemos a la brevedad.
              </p>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setContactModalOpen(false)}
              >
                CERRAR
              </Button>
            </div>
          </div>
        </Zoom>
      </Modal>
    </div>
  );
};

const NavbarOption = ({ option, optionId, link }) => {
  return (
    <a
      href={optionId ? `#${optionId}` : link}
      className={`landing-nav-a ${
        optionId === "landing-inicio-section" && "landing-nav-a-active"
      }`}
    >
      <p>{option}</p>
    </a>
  );
};

const VentajasCaja = ({ title, desc, icon, color }) => {
  return (
    <div className="landing-ventajas-caja">
      <div
        style={{
          borderRadius: "13px",
          background: color,
          boxShadow: "0px 8px 21px rgba(152, 72, 255, 0.25)",
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px",
        }}
      >
        {icon}
      </div>
      <p
        className="poppins-semibold"
        style={{
          color: "#1C1C1C",
          fontSize: "1rem",
          margin: "0 10px 10px 10px",
        }}
      >
        {title}
      </p>
      <p
        className="poppins-regular"
        style={{
          color: "#4D4D4D",
          fontSize: "0.75rem",
          textAlign: "center",
          margin: "0 20px 20px 20px",
        }}
      >
        {desc}
      </p>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", function () {
    var sections = document.querySelectorAll(".landing-section");
    var navLinks = document.querySelectorAll(".landing-nav-a");

    sections.forEach(function (section, index) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var windowHeight = window.innerHeight;
      var halfWindowHeight = windowHeight / 2;

      if (
        window.pageYOffset >= top - halfWindowHeight &&
        window.pageYOffset < top + height - halfWindowHeight
      ) {
        navLinks[index].classList.add("landing-nav-a-active");
      } else {
        navLinks[index].classList.remove("landing-nav-a-active");
      }
    });
  });
});
