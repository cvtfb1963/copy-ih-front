import Logo from "../../assets/logo/logo-corto.png";
import { useScreenSize } from "../../hooks/useScreenSize";
export const FundadorPage = () => {
  const { isMobile } = useScreenSize();
  return (
    <div>
      <div className="landing-navbar">
        <div style={{ flex: 1 }}>
          <img src={Logo} />
        </div>
        <div className="landing-navbar-center">
          <h1 className="poppins-bold">¡Hola, soy Carlos Vallés!</h1>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <button
            className="poppins-bold landing-nav-login-button button"
            onClick={() => (window.location.pathname = "/")}
          >
            Volver a IH
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <iframe
            src="https://drive.google.com/file/d/1uEkHGRkdS1XO58sTvZX9N5tnBqea4P5o/preview"
            width="40%"
            height="480px"
            allow="autoplay"
            style={{ maxWidth: 330, borderRadius: 20 }}
          ></iframe>
          <div style={{ margin: "20px" }}></div>
          <p style={{ width: "50%" }} className="poppins-regular">
            Cuando apenas tenía 4 años, en un pequeño rincón de Madrid, mi
            travesía en el mundo del inglés comenzó. Siendo español de
            nacimiento y de padres españoles, me aventuré en el prestigioso
            Colegio Británico de Madrid, donde completé todos mis estudios hasta
            el bachillerato superior. Este colegio, reconocido mundialmente como
            uno de los mejores centros de aprendizaje de la lengua inglesa, se
            convirtió en mi segundo hogar. Allí, no solo adquirí una educación
            de primera clase, sino que también absorbí una metodología de
            enseñanza que ha demostrado su eficacia una y otra vez.
            <br />
            <br />
            Más tarde, mi camino me llevó a Retamar, donde debido a mi avanzado
            nivel de inglés, fui encargado de traducir libros, obteniendo
            matrículas de honor sin dificultad.
            <br />
            <br />
            Mi sed de conocimiento y perfección no se detuvo ahí. Me gradué en
            universidades del Reino Unido como Oxford, Brighton y Open
            University, en Matemáticas, Económicas, Estadística y Ciencias
            Empresariales.
          </p>
        </div>
        <div style={{ height: 30 }}></div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ width: "50%" }} className="poppins-regular">
            Este recorrido académico no solo consolidó mi dominio del inglés,
            sino que me permitió alcanzarlo a un nivel nativo y absoluto. Nací
            con lo que se conoce como oído absoluto, una habilidad que me
            permite reproducir cualquier sonido tal cual lo escucho. Esta
            capacidad innata ha sido fundamental para desarrollar uno de los
            pilares de nuestro método: una técnica de pronunciación que
            garantiza a cualquier alumno la capacidad de pronunciar
            perfectamente con acento británico.
            <br />
            <br />
            Durante mi carrera profesional, he trabajado en entornos donde el
            inglés era la lengua predominante. Desde mis inicios como profesor
            de inglés en colegios hasta mis 18 años como operador del mercado
            financiero para entidades de primera línea como Commerzbank AG, HSBC
            PLC, Intermoney o BBVA donde siempre me desenvolví en inglés.
          </p>

          <div style={{ margin: "20px" }}></div>
          <iframe
            src="https://drive.google.com/file/d/1v8i2ByZ8Q27QuyWy_pXs0jaJHJfWOOhl/preview"
            width="40%"
            height="480px"
            allow="autoplay"
            style={{ maxWidth: 330, borderRadius: 20 }}
          ></iframe>
        </div>
        <div style={{ height: 30 }}></div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ width: "80%" }} className="poppins-regular">
            A pesar del éxito y la estabilidad en mi carrera financiera, siempre
            sentí el deseo de contribuir a la sociedad de una manera más
            significativa. Decidí abandonar el mercado financiero y resolver el
            problema de por qué la gente no aprende inglés eficazmente. Empecé a
            dar clases particulares en casas y empresas para entender mejor las
            fallas en la enseñanza del inglés. Ahora, estoy aquí para compartir
            contigo el método que he perfeccionado a lo largo de mi vida. Un
            método que no solo te enseña inglés, sino que te garantiza hablarlo
            con confianza y precisión en solo 14 meses.
            <br />
            <br />
            ¡Empieza tu viaje hacia la fluidez en inglés hoy mismo!
            <br />
            <br />
            <button
              className="landing-inicio-izquierda-button-1 poppins-bold button"
              onClick={() => window.open(ENV.calendly_link, "_blank")}
            >
              EMPIEZA AHORA
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
