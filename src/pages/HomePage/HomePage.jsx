import LockedIcon from "@mui/icons-material/Lock";
import UnlockedIcon from "@mui/icons-material/LockOpen";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, Zoom } from "react-reveal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Progressbar } from "../../components/ProgressBar/ProgressBar";
import { setCurrent } from "../../store/datosSlice";
import { getName } from "../../utils/utils";
import "./homePage.css";

export const unidades = [
  {
    number: 0.2,
    title: "CONOCIMIENTOS ELEMENTALES",
  },
  {
    number: 0.1,
    title: "VERBO BE",
  },
  {
    number: 0.3,
    title: "TIEMPOS VERBALES INGLESES",
  },
  {
    number: 1,
    title: "PRESENT SIMPLE",
  },
  {
    number: 2,
    title: "PRESENT CONTINUOUS",
  },
  {
    number: 3,
    title: "PAST SIMPLE",
  },
  {
    number: 4,
    title: "PAST CONTINUOUS",
  },
  {
    number: 59,
    title: "PREPOSICIONES",
  },
  {
    number: 5,
    title: "TIME LINE",
  },
  {
    number: 54,
    title: "PRONOMBRES",
  },
  {
    number: 6,
    title: "PRESENT PERFECT SIMPLE",
  },
  {
    number: 7,
    title: "PRESENT PERFECT CONTINUOUS",
  },
  {
    number: 8,
    title: "FOR / SINCE / AGO",
  },
  {
    number: 9,
    title: "PAST PERFECT SIMPLE",
  },
  {
    number: 10,
    title: "PAST PERFECT CONTINUOUS",
  },
  {
    number: 55,
    title: "ADJETIVOS",
  },
  {
    number: 11,
    title: "LOS TRES FUTUROS",
  },
  {
    number: 12,
    title: "FUTURE SIMPLE",
  },
  {
    number: 13.1,
    title: "BE GOING TO (PRESENT)",
  },
  {
    number: 13.2,
    title: "BE GOING TO (PAST)",
  },
  {
    number: 14,
    title: "PRESENT CONTINUOUS (F.V.)",
  },
  {
    number: 15,
    title: "PRESENT SIMPLE (F.V.)",
  },
  {
    number: 16,
    title: "EJERCICIOS TRES FUTUROS",
  },
  {
    number: 58,
    title: "SUSTANTIVOS",
  },
  {
    number: 60,
    title: "DETERMINANTES",
  },
  {
    number: 29,
    title: "IDENTIFICACIÓN TIEMPOS MÉTODO 1",
  },
  {
    number: 17,
    title: "FUTURE CONTINUOUS",
  },
  {
    number: 18,
    title: "FUTURE PERFECT SIMPLE",
  },
  {
    number: 62,
    title: "MUCH / MANY - FEW / LITTLE",
  },
  {
    number: 23,
    title: "COMPARACIÓN TIEMPOS VERBALES",
  },
  {
    number: 19,
    title: "FUTURE PERFECT CONTINUOUS",
  },
  {
    number: 20,
    title: "PAST TIME CLAUSES",
  },
  {
    number: 63,
    title: "SO / SUCH - TOO / ENOUGH",
  },
  {
    number: 21,
    title: "FUTURE TIME CLAUSES",
  },
  {
    number: 30,
    title: "IDENTIFICACIÓN TIEMPOS MÉTODO 2",
  },
  {
    number: 32,
    title: "TIPOS DE PREGUNTAS",
  },
  {
    number: 33,
    title: "QUESTION TAGS",
  },
  {
    number: 61,
    title: "THERE IS / ARE",
  },
  {
    number: 34,
    title: "PREGUNTAS DE SUJETO",
  },
  {
    number: 35,
    title: "PREGUNTAS DE OBJETO",
  },
  {
    number: 36,
    title: "PREGUNTAS DE PREPOSICIÓN",
  },
  {
    number: 37,
    title: "PREGUNTAS INDIRECTAS",
  },
  {
    number: 38,
    title: "ORACIONES IMPERSONALES",
  },
  {
    number: 39,
    title: "QUIERO QUE VENGAS...",
  },
  {
    number: 40,
    title: "CUÁNTO TIEMPO LLEVA...?",
  },
  {
    number: 41,
    title: "HAVE SOMETHING DONE",
  },
  {
    number: 24,
    title: "MAY / MIGHT",
  },
  {
    number: 25,
    title: "CAN / COULD",
  },
  {
    number: 26,
    title: "SHOULD / OUGHT TO",
  },
  {
    number: 22,
    title: "HAVE / HAVE GOT",
  },
  {
    number: 27,
    title: "MUST / HAVE (GOT) TO",
  },
  {
    number: 28,
    title: "WOULD / COULD",
  },
  {
    number: 31,
    title: "IDENTIFICACIÓN TIEMPOS MÉTODO 3",
  },
  {
    number: 45,
    title: "IMPERATIVOS",
  },
  {
    number: 42,
    title: "USED TO + INFINITIVO",
  },
  {
    number: 43,
    title: "BE USED TO + V(ING)",
  },
  {
    number: 44,
    title: "BE GETTING USED TO + V(ING)",
  },
  {
    number: 57,
    title: "ADVERBIOS",
  },
  {
    number: 56,
    title: "VERBOS",
  },
  {
    number: 46,
    title: "VERBO + VERBO",
  },
  {
    number: 47,
    title: "TO + V(INF) / V(ING) / FOR V(ING)",
  },
  {
    number: 48,
    title: "CONDICIONALES",
  },
  {
    number: 49,
    title: "PREFER",
  },
  {
    number: 50,
    title: "I WISH",
  },
  {
    number: 51,
    title: "PASIVA",
  },
  {
    number: 52,
    title: "RELATIVE CLAUSES",
  },
  {
    number: 53,
    title: "REPORTED SPEECH",
  },
  {
    number: 64,
    title: "ALL / WHOLE / EACH / EVERY",
  },
  {
    number: 65,
    title: "CONJUNCIONES",
  },
];

export const getUnitPosition = (unitNumber) =>
  unidades.findIndex((unidad) => String(unidad.number) === String(unitNumber)) +
  1;

export const HomePage = () => {
  const navigate = useNavigate();
  const { unidadesData, posicionPorUnidad, unidadesStatus, user } = useSelector(
    (state) => state.datos
  );
  const dispatch = useDispatch();

  const showErrorMessage = (show, message) => {
    if (show)
      toast(message, {
        type: "error",
      });
    return false;
  };

  const canAccessUnit = (number, shouldShowMsg) => {
    const unitPosition = getUnitPosition(number);

    if (unitPosition <= user.boughtUpTo && user?.freeNavigation) return true;

    const isInInstitution =
      user?.institutionId !== undefined && user?.institutionId !== null;
    const { boughtUpTo, atUnit } = user;

    if (isInInstitution) {
      if (boughtUpTo < unitPosition)
        return showErrorMessage(
          shouldShowMsg,
          "Tu institución aún no te concedió acceso a esta unidad"
        );

      if (new Date(user?.institutionLicenseDate).getTime() < Date.now())
        return showErrorMessage(
          shouldShowMsg,
          "La licencia de su institución está vencida."
        );

      return true;
    }

    if (new Date(user.subscriptionValidUntil).getTime() < Date.now())
      return showErrorMessage(
        shouldShowMsg,
        "Necesitas tener una subscripción activa para poder utilizar la plataforma. Si acabas de suscribirte, el pago puede tardar en acreditarse."
      );

    if (unitPosition > boughtUpTo) {
      if (user?.extraUnitsRequested === 5)
        return showErrorMessage(
          shouldShowMsg,
          "Alcanzaste el máximo de unidades permitidas en un mes, incluyendo las unidades de premio."
        );

      return showErrorMessage(
        shouldShowMsg,
        "Alcanzaste el máximo de unidades permitidas en el mes. Puedes intentar una unidad de premio desde la ventana FACTURACIÓN"
      );
    }

    if (unitPosition > atUnit + 1)
      return showErrorMessage(
        shouldShowMsg,
        "Para conseguir acceso a esta unidad debes recorrer las unidades anteriores."
      );

    return true;
  };

  const goToUnit = (unidad, iUnidad) => {
    if (!canAccessUnit(unidad.number, true)) return;

    dispatch(
      setCurrent({
        numeroUnidad: unidad.number,
        displayUnidad: iUnidad + 1,
        tituloUnidad: unidad.title,
      })
    );

    navigate(`/unidad`);
  };

  const getProgress = (numeroUnidad) => {
    if (unidadesStatus[numeroUnidad] == true) return 100;

    const position = posicionPorUnidad[numeroUnidad] ?? 0;
    const size = unidadesData?.[numeroUnidad]?.count;

    const progress = position === 0 ? 0 : Math.round((position / size) * 100);

    return progress;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const billed = urlParams.get("billed");

    if (billed) {
      toast(
        "Estamos procesando tu suscripción. Pueden pasar algunos minutos hasta que la operación se haga efectiva.",
        {
          type: "success",
          toastId: "billedSuccess",
          autoClose: 5000,
        }
      );
    }
  }, []);

  const getFontSize = (length) => {
    if (length < 10) return "25px";
    if (length < 15) return "23px";
    if (length < 20) return "21px";
    if (length < 25) return "18px";
    if (length < 30) return "16px";
    return "13px";
  };

  return (
    <div>
      <Bounce>
        <h1 style={{ margin: "10px" }}>{`¡Hola, ${getName(user?.name)}👋!`}</h1>
      </Bounce>

      <div className="hp-container">
        {unidades.map((unidad, iUnidad) => {
          const canAccessThisUnit = canAccessUnit(unidad.number, false);
          const isUnitAllowedByPlan = user?.profileApplied?.units?.includes(iUnidad + 1);
          const isRestrictedByPlan = user?.profileApplied && !isUnitAllowedByPlan;
          
          return (
            <Zoom key={unidad.number}>
              <div>
                <div
                  className={`unidad ${isRestrictedByPlan ? 'unidad-restricted' : ''}`}
                  onClick={() => !isRestrictedByPlan && goToUnit(unidad, iUnidad)}
                  style={{
                    ...(isRestrictedByPlan && {
                      backgroundColor: '#f5f5f5',
                      color: '#999',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                      border: '2px solid #ddd'
                    })
                  }}
                >
                  <span className="poppins-extrabold">
                    Unidad {iUnidad + 1}
                  </span>
                  <p
                    style={{
                      color: isRestrictedByPlan ? "#666" : "rgb(0,0,0,0.9)",
                      marginBottom: isRestrictedByPlan && 5,
                      maxHeight: "50px",
                      lineHeight: "25px",
                      fontSize: getFontSize(unidad.title.length),
                    }}
                    className="poppins-medium"
                  >
                    {unidad.title}
                  </p>
                  
                  {isRestrictedByPlan ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '5px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      margin: '5px 0'
                    }}>
                      <p style={{ 
                        color: '#666', 
                        fontSize: '14px', 
                        marginBottom: '7px',
                        fontWeight: 'bold'
                      }}>
                        Unidad no disponible en tu plan
                      </p>
                    </div>
                  ) : (
                    <Progressbar filled={getProgress(unidad.number)} />
                  )}
                  
                  <div className="unidad-icon">
                    {isRestrictedByPlan ? (
                      <LockedIcon sx={{ color: "#999" }} />
                    ) : canAccessThisUnit ? (
                      <UnlockedIcon sx={{ color: "green" }} />
                    ) : user.boughtUpTo >= iUnidad + 1 ? (
                      <LockedIcon sx={{ color: "green" }} />
                    ) : (
                      <LockedIcon sx={{ color: "red" }} />
                    )}
                  </div>
                </div>
              </div>
            </Zoom>
          );
        })}
      </div>
    </div>
  );
};