import AustraliaIcon from "../../assets/icons/australia.png";
import IndiaIcon from "../../assets/icons/india.png";
import InglaterraIcon from "../../assets/icons/inglaterra.png";
import UsaIcon from "../../assets/icons/usa.png";
import { AUDIO_PAISES } from "../AudioPlayer/AudioPlayer";
import "./PaisSelector.css";

export const PaisSelector = ({
  audioPais,
  setAudioPais,
  includeLabel,
  width,
}) => {
  const handleCountrySelect = (country) => {
    setAudioPais(country);
    // Add selecting animation class temporarily
    const flagElement = document.querySelector(`[data-country="${getCountryKey(country)}"]`);
    if (flagElement) {
      flagElement.classList.add('selecting');
      setTimeout(() => {
        flagElement.classList.remove('selecting');
      }, 400);
    }
  };

  const getCountryKey = (audioPaisValue) => {
    switch (audioPaisValue) {
      case AUDIO_PAISES.ingles: return 'england';
      case AUDIO_PAISES.americano: return 'usa';
      case AUDIO_PAISES.australiano: return 'australia';
      case AUDIO_PAISES.indio: return 'india';
      default: return '';
    }
  };

  const getTooltip = (audioPaisValue) => {
    switch (audioPaisValue) {
      case AUDIO_PAISES.ingles: return 'Inglés Británico';
      case AUDIO_PAISES.americano: return 'Inglés Americano';
      case AUDIO_PAISES.australiano: return 'Inglés Australiano';
      case AUDIO_PAISES.indio: return 'Inglés Indio';
      default: return '';
    }
  };

  return (
    <div className="pais-selector-container">
      {includeLabel && (
        <p className="pais-selector-label">Selecciona la lengua de los audios.</p>
      )}
      <div
        className="pais-selector-flags"
        style={{
          width: width ?? "100%",
        }}
      >
        <img
          src={InglaterraIcon}
          onClick={() => handleCountrySelect(AUDIO_PAISES.ingles)}
          className={`pais-selector-flag ${audioPais === AUDIO_PAISES.ingles ? 'active' : ''}`}
          data-country="england"
          data-tooltip={getTooltip(AUDIO_PAISES.ingles)}
          alt="Bandera de Inglaterra"
        />
        <img
          src={UsaIcon}
          onClick={() => handleCountrySelect(AUDIO_PAISES.americano)}
          className={`pais-selector-flag ${audioPais === AUDIO_PAISES.americano ? 'active' : ''}`}
          data-country="usa"
          data-tooltip={getTooltip(AUDIO_PAISES.americano)}
          alt="Bandera de Estados Unidos"
        />
        <img
          src={AustraliaIcon}
          onClick={() => handleCountrySelect(AUDIO_PAISES.australiano)}
          className={`pais-selector-flag ${audioPais === AUDIO_PAISES.australiano ? 'active' : ''}`}
          data-country="australia"
          data-tooltip={getTooltip(AUDIO_PAISES.australiano)}
          alt="Bandera de Australia"
        />
        <img
          src={IndiaIcon}
          onClick={() => handleCountrySelect(AUDIO_PAISES.indio)}
          className={`pais-selector-flag ${audioPais === AUDIO_PAISES.indio ? 'active' : ''}`}
          data-country="india"
          data-tooltip={getTooltip(AUDIO_PAISES.indio)}
          alt="Bandera de India"
        />
      </div>
    </div>
  );
};
