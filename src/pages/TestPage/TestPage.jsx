import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { replaceSymbols } from "../../App";
import { ExplanationModal } from "../../components/ExplanationModal/ExplanationModal";
import { GradeModal } from "../../components/GradeModal/GradeModal";
import {
  EjercicioTipo1,
  ejemploTipo1,
} from "../../exercises/Tipo1/EjercicioTipo1";
import {
  EjercicioTipo10,
  ejemploTipo10,
} from "../../exercises/Tipo10/EjercicioTipo10";
import {
  EjercicioTipo11,
  ejemploTipo11,
} from "../../exercises/Tipo11/EjercicioTipo11";
import {
  EjercicioTipo12,
  ejemploTipo12,
} from "../../exercises/Tipo12/EjercicioTipo12";
import {
  EjercicioTipo13,
  ejemploTipo13,
} from "../../exercises/Tipo13/EjercicioTipo13";
import {
  EjercicioTipo14,
  ejemploTipo14,
} from "../../exercises/Tipo14/EjercicioTipo14";
import {
  EjercicioTipo15,
  ejemploTipo15,
} from "../../exercises/Tipo15/EjercicioTipo15";
import {
  EjercicioTipo16,
  ejemploTipo16,
} from "../../exercises/Tipo16/EjercicioTipo16";
import {
  EjercicioTipo17,
  ejemploTipo17,
} from "../../exercises/Tipo17/EjercicioTipo17";
import {
  EjercicioTipo18,
  ejemploTipo18,
} from "../../exercises/Tipo18/EjercicioTipo18";
import {
  EjercicioTipo2,
  ejemploTipo2,
} from "../../exercises/Tipo2/EjercicioTipo2";
import {
  EjercicioTipo21,
  ejemploTipo21,
} from "../../exercises/Tipo21/EjercicioTipo21";
import {
  EjercicioTipo22,
  ejemploTipo22,
} from "../../exercises/Tipo22/ejercicioTipo22";
import {
  EjercicioTipo23,
  ejemploTipo23,
} from "../../exercises/Tipo23/EjercicioTipo23";
import {
  EjercicioTipo27,
  ejemploTipo27,
} from "../../exercises/Tipo27/ejercicioTipo27";
import { EjercicioTipo28, ejemploTipo28 } from "../../exercises/Tipo28/Tipo28";
import { EjercicioTipo29, ejemploTipo29 } from "../../exercises/Tipo29/EjercicioTipo29";
import {
  EjercicioTipo3,
  ejemploTipo3,
} from "../../exercises/Tipo3/EjercicioTipo3";
import { EjercicioTipo30, ejemploTipo30 } from "../../exercises/Tipo30/EjercicioTipo30";
import { EjercicioTipo4, ejemploTipo4 } from "../../exercises/Tipo4/Tipo4";
import {
  EjercicioTipo5,
  ejemploTipo5,
} from "../../exercises/Tipo5/EjercicioTipo5";
import {
  EjercicioTipo6,
  ejemploTipo6,
} from "../../exercises/Tipo6/EjercicioTipo6";
import {
  EjercicioTipo7,
  ejemploTipo7,
} from "../../exercises/Tipo7/ejercicioTipo7";
import {
  EjercicioTipo8,
  ejemploTipo8,
} from "../../exercises/Tipo8/EjercicioTipo8";
import {
  setCurrentSkill,
  setCurrentTitle,
  setCurrentattachedDocument,
} from "../../store/datosSlice";
import "./testPage.css";
import {
  ejemploTipo31,
  EjercicioTipo31,
} from "../../exercises/Tipo31/EjercicioTipo31";

const ejercicios = [
  ejemploTipo1,
  ejemploTipo2,
  ejemploTipo3,
  ejemploTipo4,
  ejemploTipo5,
  ejemploTipo6,
  ejemploTipo7,
  ejemploTipo8,
  null,
  ejemploTipo10,
  ejemploTipo11,
  ejemploTipo12,
  ejemploTipo13,
  ejemploTipo14,
  ejemploTipo15,
  ejemploTipo16,
  ejemploTipo17,
  ejemploTipo18,
  null,
  null,
  ejemploTipo21,
  ejemploTipo22,
  ejemploTipo23,
  null,
  null,
  null,
  ejemploTipo27,
  ejemploTipo28,
  ejemploTipo29,
  ejemploTipo30,
  ejemploTipo31,
];

export const TestPage = () => {
  const [text, setText] = useState("");
  const [ejercicio, setEjercicio] = useState();

  const dispatch = useDispatch();

  const ExercisesComponentsTypes = [
    <EjercicioTipo1 key="tipo1" ejercicio={ejercicio ?? ejemploTipo1} />,
    <EjercicioTipo2 key="tipo2" ejercicio={ejercicio ?? ejemploTipo2} />,
    <EjercicioTipo3 key="tipo3" ejercicio={ejercicio ?? ejemploTipo3} />,
    <EjercicioTipo4 key="tipo4" ejercicio={ejercicio ?? ejemploTipo4} />,
    <EjercicioTipo5 key="tipo5" ejercicio={ejercicio ?? ejemploTipo5} />,
    <EjercicioTipo6 key="tipo6" ejercicio={ejercicio ?? ejemploTipo6} />,
    <EjercicioTipo7 key="tipo7" ejercicio={ejercicio ?? ejemploTipo7} />,
    <EjercicioTipo8 key="tipo8" ejercicio={ejercicio ?? ejemploTipo8} />,
    null, //COMPLETADO, ES TIPO 23.
    <EjercicioTipo10 key={"tipo10"} ejercicio={ejercicio ?? ejemploTipo10} />,
    <EjercicioTipo11 key={"tipo11"} ejercicio={ejercicio ?? ejemploTipo11} />,
    <EjercicioTipo12 key={"tipo12"} ejercicio={ejercicio ?? ejemploTipo12} />,
    <EjercicioTipo13 key={"tipo13"} ejercicio={ejercicio ?? ejemploTipo13} />,
    <EjercicioTipo14 key={"tipo14"} ejercicio={ejercicio ?? ejemploTipo14} />,
    <EjercicioTipo15 key={"tipo15"} ejercicio={ejercicio ?? ejemploTipo15} />,
    <EjercicioTipo16 key={"tipo16"} ejercicio={ejercicio ?? ejemploTipo16} />,
    <EjercicioTipo17 key={"tipo17"} ejercicio={ejercicio ?? ejemploTipo17} />,
    <EjercicioTipo18 key={"tipo18"} ejercicio={ejercicio ?? ejemploTipo18} />,
    null,
    null,
    <EjercicioTipo21 key={"tipo21"} ejercicio={ejercicio ?? ejemploTipo21} />,
    <EjercicioTipo22 key={"tipo22"} ejercicio={ejercicio ?? ejemploTipo22} />,
    <EjercicioTipo23 key={"tipo23"} ejercicio={ejercicio ?? ejemploTipo23} />,
    null,
    null,
    null,
    <EjercicioTipo27 key={"tipo27"} ejercicio={ejercicio ?? ejemploTipo27} />,
    <EjercicioTipo28 key={"tipo28"} ejercicio={ejercicio ?? ejemploTipo28} />,
    <EjercicioTipo29 key={"tipo29"} ejercicio={ejercicio ?? ejemploTipo29} />,
    <EjercicioTipo30 key={"tipo30"} ejercicio={ejercicio ?? ejemploTipo30} />,
    <EjercicioTipo31 key={"tipo31"} ejercicio={ejercicio ?? ejemploTipo31} />,
  ];

  const handleRender = () => {
    try {
      const data = JSON.parse(text);
      setEjercicio(data);
      dispatch(setCurrentSkill(data.skill));
      dispatch(setCurrentTitle(data.title));
      dispatch(setCurrentattachedDocument(data.attachedDocument));
      toast("Se renderizó el ejercicio!", { position: "top-left" });
    } catch (e) {
      toast("No se pudo renderizar. El JSON es inválido", { type: "error" });
    }
  };

  useEffect(() => {
    replaceSymbols();
  }, [ejercicio]);

  return (
    <div className="test-page">
      <h1 style={{ margin: "10px" }}>PREUBA DE EJERCICIOS</h1>
      <div>
        {ejercicios.map((ejercicio, i) =>
          !ejercicio ? null : (
            <Button
              key={`ej-${i}`}
              sx={{ margin: "5px" }}
              variant="contained"
              onClick={() => setText(JSON.stringify(ejercicio, null, 2))}
            >
              VER EJEMPLO TIPO {i + 1}
            </Button>
          )
        )}
      </div>
      <textarea
        onChange={({ target: { value } }) => setText(value)}
        value={text}
        style={{
          margin: "20px 20px 0 20px",
          height: "400px",
          fontSize: "20px",
        }}
      />
      <Button
        variant="contained"
        sx={{ margin: "20px" }}
        onClick={handleRender}
      >
        RENDERIZAR
      </Button>
      {ejercicio && ExercisesComponentsTypes[ejercicio.type - 1]}
      <ExplanationModal />
      <GradeModal />
    </div>
  );
};
