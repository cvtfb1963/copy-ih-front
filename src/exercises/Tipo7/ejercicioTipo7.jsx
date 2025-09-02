import "./ejercicioTipo7.css";
import { EXERCISE_SKILLS } from "../../constants/ejerciciosData";
import { Tipo7Template1 } from "../templates/tipo7/Tipo7Template1";
import { Tipo7Template2 } from "../templates/tipo7/Tipo7Template2";
import { Tipo7Template3 } from "../templates/tipo7/Tipo7Template3";
import { Tipo7Template4 } from "../templates/tipo7/Tipo7Template4";
import { Tipo7Template5 } from "../templates/tipo7/Tipo7Template5";
import { Tipo7Template6 } from "../templates/tipo7/Tipo7Template6";
import { Tipo7Template7 } from "../templates/tipo7/Tipo7Template7";
import { Tipo7Template8 } from "../templates/tipo7/Tipo7Template8";
import { Tipo7Template9 } from "../templates/tipo7/Tipo7Template9";
import { Tipo7Template10 } from "../templates/tipo7/Tipo7Template10";
import { Tipo7Template11 } from "../templates/tipo7/Tipo7Template11";
import { Tipo7Template12 } from "../templates/tipo7/Tipo7Template12";
import { Tipo7Template13 } from "../templates/tipo7/Tipo7Template13";
import { Tipo7Template14 } from "../templates/tipo7/Tipo7Template14.jsx";

export const ejemploTipo7 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 7,
  number: 96,
  unidad: 16,
  template: 2,
};

// 1: present simple
// 2: present continuous
// 3: present perfect simple
// 4: present perfect continuous
// 5: past simple
// 6: past continuous
// 7: past perfect simple
// 8: past perfect continuous
// 9: future simple
// 10: be going to present
// 11: be going to past
// 12: future continuous
// 13: future perfect simple
// 14: future perfect continuous

export const EjercicioTipo7 = ({ ejercicio }) => {
  const templates = [
    Tipo7Template1,
    Tipo7Template2,
    Tipo7Template3,
    Tipo7Template4,
    Tipo7Template5,
    Tipo7Template6,
    Tipo7Template7,
    Tipo7Template8,
    Tipo7Template9,
    Tipo7Template10,
    Tipo7Template11,
    Tipo7Template12,
    Tipo7Template13,
    Tipo7Template14,
  ];

  const Template = templates[ejercicio.template - 1];

  return <Template ejercicio={ejercicio} />;
};
