import { useEffect } from "react";
import { replaceSymbols } from "../../App";
import { EjercicioTipo1 } from "../Tipo1/EjercicioTipo1";
import { EjercicioTipo10 } from "../Tipo10/EjercicioTipo10";
import { EjercicioTipo11 } from "../Tipo11/EjercicioTipo11";
import { EjercicioTipo12 } from "../Tipo12/EjercicioTipo12";
import { EjercicioTipo13 } from "../Tipo13/EjercicioTipo13";
import { EjercicioTipo14 } from "../Tipo14/EjercicioTipo14";
import { EjercicioTipo15 } from "../Tipo15/EjercicioTipo15";
import { EjercicioTipo16 } from "../Tipo16/EjercicioTipo16";
import { EjercicioTipo17 } from "../Tipo17/EjercicioTipo17";
import { EjercicioTipo18 } from "../Tipo18/EjercicioTipo18";
import { EjercicioTipo2 } from "../Tipo2/EjercicioTipo2";
import { EjercicioTipo21 } from "../Tipo21/EjercicioTipo21";
import { EjercicioTipo22 } from "../Tipo22/ejercicioTipo22";
import { EjercicioTipo23 } from "../Tipo23/EjercicioTipo23";
import { EjercicioTipo27 } from "../Tipo27/ejercicioTipo27";
import { EjercicioTipo28 } from "../Tipo28/Tipo28";
import { EjercicioTipo29 } from "../Tipo29/EjercicioTipo29";
import { EjercicioTipo3 } from "../Tipo3/EjercicioTipo3";
import { EjercicioTipo30 } from "../Tipo30/EjercicioTipo30";
import { EjercicioTipo4 } from "../Tipo4/Tipo4";
import { EjercicioTipo5 } from "../Tipo5/EjercicioTipo5";
import { EjercicioTipo6 } from "../Tipo6/EjercicioTipo6";
import { EjercicioTipo7 } from "../Tipo7/ejercicioTipo7";
import { EjercicioTipo8 } from "../Tipo8/EjercicioTipo8";
import { EjercicioTipo31 } from "../Tipo31/EjercicioTipo31";

export const ExerciseRenderer = ({ ejercicio }) => {
  const ExercisesComponentsTypes = [
    <EjercicioTipo1 key="tipo1" ejercicio={ejercicio} />,
    <EjercicioTipo2 key="tipo2" ejercicio={ejercicio} />,
    <EjercicioTipo3 key="tipo3" ejercicio={ejercicio} />,
    <EjercicioTipo4 key="tipo4" ejercicio={ejercicio} />,
    <EjercicioTipo5 key="tipo5" ejercicio={ejercicio} />,
    <EjercicioTipo6 key="tipo6" ejercicio={ejercicio} />,
    <EjercicioTipo7 key="tipo7" ejercicio={ejercicio} />,
    <EjercicioTipo8 key="tipo8" ejercicio={ejercicio} />,
    null, //COMPLETADO, ES TIPO 23.
    <EjercicioTipo10 key={"tipo10"} ejercicio={ejercicio} />,
    <EjercicioTipo11 key={"tipo11"} ejercicio={ejercicio} />,
    <EjercicioTipo12 key={"tipo12"} ejercicio={ejercicio} />,
    <EjercicioTipo13 key={"tipo13"} ejercicio={ejercicio} />,
    <EjercicioTipo14 key={"tipo14"} ejercicio={ejercicio} />,
    <EjercicioTipo15 key={"tipo15"} ejercicio={ejercicio} />,
    <EjercicioTipo16 key={"tipo16"} ejercicio={ejercicio} />,
    <EjercicioTipo17 key={"tipo17"} ejercicio={ejercicio} />,
    <EjercicioTipo18 key={"tipo18"} ejercicio={ejercicio} />,
    null,
    null,
    <EjercicioTipo21 key={"tipo21"} ejercicio={ejercicio} />,
    <EjercicioTipo22 key={"tipo22"} ejercicio={ejercicio} />,
    <EjercicioTipo23 key={"tipo23"} ejercicio={ejercicio} />,
    null,
    null,
    null,
    <EjercicioTipo27 key={"tipo27"} ejercicio={ejercicio} />,
    <EjercicioTipo28 key={"tipo28"} ejercicio={ejercicio} />,
    <EjercicioTipo29 key={"tipo29"} ejercicio={ejercicio} />,
    <EjercicioTipo30 key={"tipo30"} ejercicio={ejercicio} />,
    <EjercicioTipo31 key={"tipo31"} ejercicio={ejercicio} />,
  ];

  useEffect(() => {
    replaceSymbols();
  }, [ejercicio]);

  return ExercisesComponentsTypes[ejercicio.type - 1];
};
