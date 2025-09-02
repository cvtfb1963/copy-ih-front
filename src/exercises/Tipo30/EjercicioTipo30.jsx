import { AudioPlayer } from "../../components/AudioPlayer/AudioPlayer";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import {
  EXERCISE_SKILLS
} from "../../constants/ejerciciosData";


export const ejemploTipo30 = {
  type: 30,
  unidad: 0.3,
  skill: EXERCISE_SKILLS.VOCABULARY,
  number: 22.5,
  title: 'Biografía Elon Musk',
  description: "&Elon Reeve Musk& (Pretoria, 28 de junio de 1971), conocido como ~Elon Musk~, es un empresario, inversor y magnate _u_sudafricano_u_ que también posee las nacionalidades color::verdecanadiensecolor::verde y estadounidense. Es el fundador, consejero delegado e ingeniero en jefe de SpaceX; inversor ángel, director general y arquitecto de productos de Tesla, Inc.; fundador de The Boring Company; cofundador de Neuralink y OpenAI, aunque ya no tiene más participación en esta última por desacuerdos en el rumbo de la empresa. Además de ser el director de tecnología de X Corp..5​",
  description2: "Con un patrimonio neto estimado en unos 252.4 mil millones de dólares en julio de 2024,6​ llegando a ser la persona más rica del mundo según el índice de multimillonarios en tiempo real de letra::cursivaForbesletra::cursiva",
  description3: "Musk nació y se crío en una rica familia de Pretoria (Sudáfrica). Su madre es canadiense y su padre un sudafricano blanco. Estudió brevemente en la Universidad de Pretoria antes de trasladarse a Canadá a los 17 años. Se matriculó en la Universidad de Queen y se trasladó a la Universidad de Pensilvania dos años después, donde se graduó en Economía y Física. En 1995 se trasladó a California para asistir a la Universidad Stanford, pero en su lugar decidió seguir una carrera empresarial, cofundando la empresa de software web Zip2 con su hermano Kimbal. La empresa fue adquirida por Compaq por 307 millones de dólares en 1999. Ese mismo año, Musk cofundó el banco en línea X.com, que se fusionó con Confinity en 2000 para formar PayPal. La empresa fue comprada por eBay en 2002 por 1500 millones de dólares."
}

export const EjercicioTipo30 = ({ ejercicio }) => {
  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        {ejercicio.audio && (
          <AudioPlayer audioName={ejercicio.audio} justEnglish />
        )}
        <DescriptionRenderer ejercicio={ejercicio} />
      </div>
    </div>
  );
};
