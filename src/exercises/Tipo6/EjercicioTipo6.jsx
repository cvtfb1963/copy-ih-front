import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PALETTE } from "../../common/palette";
import { AudioPlayer } from "../../components/AudioPlayer/AudioPlayer";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import { ExerciseControl } from "../../components/ExerciseControl/ExerciseControl";
import { FloatingVideo } from "../../components/FloatingVideo/FloatingVideo";
import {
  EXERCISE_SKILLS,
  EXPLANATION_VIDEOS,
} from "../../constants/ejerciciosData";
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer, getPlainValue } from "../../utils/exercises.utils";
import "./ejercicioTipo6.css";

//TIPOS DE ORACIONES DE TRADUCCION
// ORACIÓN NORMAL
// 30%   45%    25%
//  s  +  v  +  c

// ORACIÓN CON ADVERBIO
// 5% + 30%   45%    20%
// a  +  s  +  v  +  c

// PREGUNTA BE
//  5%    45%   30%   20%
// (wh) +  v  +  s  +  c

// PREGUNTA GENERAL
//  5%     20%    30%    25%  20%
// (wh) +  aux  +  s  +  v  +  c

export const ejemploTipo6 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 6,
  number: 3,
  title: "Present Simple",
  unidad: 13,
  description:
    "Selecciona en cuáles de las siguientes oraciones usarías el present simple y en cuáles no.",
  sentences: [
    {
      sentence: "Usualmente juego al tenis",
      adverbio: "usually",
      sujeto: "i",
      verbo: "play",
      complemento: "tennis",
    },
    {
      complementar: "b) ¿(Se) suelen quedar(se) en casa cuando vengo a Madrid?",
      sentence: "b1) ¿(Se) suelen quedar(se) en casa...",
      pregunta: "general",
      aux: "do",
      sujeto: "they",
      verbo: "usually stay",
      complemento: "at home",
      explanation:
        "Used to + infinitivo es una estrauctura que solo es válida en inglés en past simple. Su equivalente en presente es 'usually' como veremos en la correspondiente unidad de used to",
    },
    {
      sentence: "b2) ... cuando vengo a Madrid?",
      sujeto: "When I",
      verbo: "come",
      complemento: "to Madrid?",
      explanation:
        "Nota: La pregunta es '¿Suelen quedarse en casa?' y 'cuando vengo a Madrid' no es mas que la segunda oración que de hecho es afirmativa",
    },

    {
      sentence: "¿Cuántos años tienes?",
      pregunta: "be",
      wh: "How old",
      verbo: "are",
      sujeto: "you?",
      complemento: "N/A",
    },
    {
      sentence: "Hace calor",
      sujeto: "It",
      verbo: "is",
      complemento: "hot",
      complemento2: "warm",
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "Estás en Madrid?",
      pregunta: "be",
      verbo: "are",
      sujeto: "you",
      complemento: "in madrid?",
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "No estás en Madrid?",
      pregunta: "be",
      verbo: "are not",
      sujeto: "you",
      complemento: "in madrid?",
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "Por qué ella está en Madrid?",
      pregunta: "be",
      wh: "why",
      verbo: "is",
      sujeto: "she",
      complemento: "in madrid?",
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "A dónde estás yendo a comer hoy?",
      pregunta: "general",
      wh: "Where",
      aux: "are",
      sujeto: "you",
      verbo: "going to eat",
      complemento: "today?",
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "Ella es una conductora muy buena",
      sujeto: "She",
      verbo: "is",
      complemento: "a very good driver",
    },
    {
      sentence: "Va el gato a la cocina todos los días?",
      pregunta: "general",
      aux: "does",
      sujeto: "the cat",
      verbo: "go",
      complemento: ["to the kitchen", "everyday"],
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "No va el gato a la cocina todos los días?",
      pregunta: "general",
      aux: "doesn't",
      sujeto: "the cat",
      verbo: "go",
      complemento: ["to the kitchen", "everyday"],
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "El gato va todos los días a la cocina",
      sujeto: "The cat",
      verbo: "goes",
      complemento: ["to the kitchen", "everyday"],
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "Estamos cenando en un restaurante chino.",
      sujeto: "We",
      verbo: "are having dinner",
      complemento: "at a chinese restaurant",
      sujeto2: "We",
      verbo2: "are dinning",
      complemento2: "at a chinese restaurant",
      explanation: "Esta es una explicacion",
    },
    {
      sentence: "Animal con cuello muy largo",
      answer: "Giraffe",
    },
    {
      sentence: "Hacer algo para hallar a alguien o algo",
      answer: "Search",
      answer2: "Search for",
    },
  ],
};

const getAnswer = (sentence) => {
  if (sentence?.answer) return getPlainValue(sentence.answer);

  let complemento =
    sentence.complemento && sentence.complemento != "N/A"
      ? getPlainValue(sentence.complemento)
      : "";

  let wh = sentence.wh ?? "";

  const isPreguntaBe = sentence.pregunta === "be";
  const isPreguntaGeneral = sentence.pregunta === "general";
  const isNormalSentence =
    !isPreguntaBe &&
    !isPreguntaGeneral &&
    !sentence.wh &&
    !sentence.aux &&
    !sentence.adverbio &&
    sentence.sujeto &&
    sentence.verbo &&
    sentence.complemento;
  const isAdverbioSentence =
    !isPreguntaBe &&
    !isNormalSentence &&
    !isPreguntaGeneral &&
    sentence.adverbio;

  if (isNormalSentence)
    return `${sentence.sujeto} ${sentence.verbo} ${complemento}`.trim();
  if (isPreguntaBe)
    return `${wh} ${sentence.verbo} ${sentence.sujeto} ${complemento}`.trim();
  if (isPreguntaGeneral)
    return `${wh} ${sentence.aux} ${sentence.sujeto} ${sentence.verbo} ${complemento}`.trim();
  if (isAdverbioSentence)
    return `${sentence.adverbio} ${sentence.sujeto} ${sentence.verbo} ${complemento}`.trim();

  return "Error: no matching rule";
};

const getSujObj = (sentence, n) => ({
  wh: !n ? sentence.wh : sentence[`wh${n}`] ? sentence[`wh${n}`] : sentence.wh,
  adverbio: !n
    ? sentence.adverbio
    : sentence[`adverbio${n}`]
    ? sentence[`adverbio${n}`]
    : sentence.adverbio,
  aux: !n
    ? sentence.aux
    : sentence[`aux${n}`]
    ? sentence[`aux${n}`]
    : sentence.aux,
  sujeto: !n
    ? sentence.sujeto
    : sentence[`sujeto${n}`]
    ? sentence[`sujeto${n}`]
    : sentence.sujeto,
  verbo: !n
    ? sentence.verbo
    : sentence[`verbo${n}`]
    ? sentence[`verbo${n}`]
    : sentence.verbo,
  complemento: !n
    ? sentence.complemento
    : sentence[`complemento${n}`]
    ? sentence[`complemento${n}`]
    : sentence.complemento,
});

const getColor = (target) =>
  typeof target === "number"
    ? target > 0.6
      ? "green"
      : "red"
    : target
    ? "green"
    : "red";

export const EjercicioTipo6 = ({ ejercicio }) => {
  useEffect(() => {
    ejercicio.sentences.forEach((sentence, i) => {
      if (sentence.answer && sentence.sujeto)
        alert(
          `ORACIÓN ${
            i + 1
          } MAL FORMADA: no puede tener answer y sujeto al mismo tiempo`
        );
    });
  }, [ejercicio]);
  const initialStates = [];
  const initialResponses = {};
  ejercicio.sentences.forEach((x, i) => {
    initialStates.push(null);
    initialResponses[i] = "";
  });

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const [selectState, setSelectState] = useState(initialStates); //this are the state of answers (true / false / null)
  const [responses, setResponses] = useState(initialResponses);
  const [verified, setVerified] = useState(false);

  const handleChange = (index, value) => {
    setResponses((old) => ({ ...old, [index]: value }));
  };

  const handleReset = () => {
    setSelectState(initialStates);
    setResponses(initialResponses);
    setVerified(false);
  };

  const isShown = (generalIndex) => {
    let current = 0;

    for (const sentence of ejercicio.sentences) {
      if (current === generalIndex) return sentence.shown;
      else current++;
    }
  };

  const showAndSaveGrade = (results) => {
    const computableResults = results.filter((_, i) => !isShown(i));
    const total = computableResults.length;

    const gradeTotal = computableResults.reduce((a, b) => a + b, 0);
    const grade = gradeTotal / total;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const handleVerify = () => {

    

    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );

    const results = [];
    ejercicio.sentences.forEach((s, i) => {
      if (s.shown) return results.push(true);

      if (s?.sujeto) {
        localStorage.setItem(
          "peso_sujeto_verbo_complemento",
          s.pregunta ?? true
        );

        results.push(
          checkAnswer(
            responses[i],
            getSujObj(s),
            getSujObj(s, 2),
            getSujObj(s, 3),
            getSujObj(s, 4),
            getSujObj(s, 5),
            getSujObj(s, 6),
            getSujObj(s, 7),
            getSujObj(s, 8),
            getSujObj(s, 9),
            getSujObj(s, 10),
            getSujObj(s, 11),
            getSujObj(s, 12),
            6
          )
        );

        localStorage.removeItem("peso_sujeto_verbo_complemento");
      } else
        results.push(
          checkAnswer(
            responses[i],
            s.answer,
            s.answer2,
            s.answer3,
            s.answer4,
            s.answer5,
            s.answer6,
            s.answer7,
            s.answer8,
            s.answer9,
            s.answer10,
            s.answer11,
            s.answer12,
            s.answer13,
            s.answer14,
            s.answer15,
            s.answer16,
            s.answer17,
            s.answer18,
            s.answer19,
            s.answer20,
            6
          )
        );
    });

    localStorage.removeItem("is_vocabulary_exercise");
    setSelectState(results);
    setVerified(true);

    showAndSaveGrade(results);
  };

  const shouldShowAnswer = () =>
    verified && Object.values(selectState).some((x) => !x);

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />

        {ejercicio.audio && (
          <AudioPlayer audioName={ejercicio.audio} justEnglish />
        )}
        {ejercicio.sentences.map((sentence, i, arr) => {
          if (i !== 0 && arr[i - 1]?.complementar) return <></>;

          if (!sentence.complementar)
            return (
              <Sentence
                i={i}
                selectStateI={selectState[i]}
                sentence={sentence}
                ejercicio={ejercicio}
                handleChange={handleChange}
                responses={responses}
                shouldShowAnswer={shouldShowAnswer}
                showExplanation={showExplanation}
                verified={verified}
              />
            );

          return (
            <div
              style={{
                margin: "10px",
                border: `3px solid ${PALETTE.tertiary_color}`,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              key={`comp-i-${i}`}
            >
              <p
                style={{
                  fontSize: "14px",
                  padding: "5px 2px",
                  margin: "5px",
                  fontWeight: 600,
                }}
              >
                {sentence.complementar}
              </p>
              <span style={{ width: "98%", alignSelf: "end" }}>
                <Sentence
                  i={i}
                  selectStateI={selectState[i]}
                  sentence={sentence}
                  ejercicio={ejercicio}
                  handleChange={handleChange}
                  responses={responses}
                  shouldShowAnswer={shouldShowAnswer}
                  showExplanation={showExplanation}
                  verified={verified}
                  removeBorder
                />
              </span>
              <span style={{ width: "98%", alignSelf: "end" }}>
                <Sentence
                  i={i + 1}
                  selectStateI={selectState[i + 1]}
                  sentence={arr[i + 1]}
                  ejercicio={ejercicio}
                  handleChange={handleChange}
                  responses={responses}
                  shouldShowAnswer={shouldShowAnswer}
                  showExplanation={showExplanation}
                  verified={verified}
                  removeBorder
                />
              </span>
            </div>
          );
        })}
        <ExerciseControl
          handleReset={handleReset}
          handleVerify={handleVerify}
          verified={verified}
        />
      </div>
    </div>
  );
};

const Sentence = ({
  sentence,
  ejercicio,
  verified,
  selectStateI,
  i,
  handleChange,
  responses,
  showExplanation,
  shouldShowAnswer,
  removeBorder,
}) => {
  return (
    <div
      className="et6-sentence"
      key={i}
      style={{ border: removeBorder && "none", margin: removeBorder && 0 }}
    >
      <p style={{ flex: 1, minWidth: "200px" }}>{sentence.sentence}</p>
      <div>
        {sentence.shown ? (
          <p style={{ fontWeight: "400" }}>{sentence.answer}</p>
        ) : ejercicio.options ? (
          <select
            disabled={verified}
            style={{
              border: `3px solid ${
                selectStateI === null ? "gray" : getColor(selectStateI)
              }`,
            }}
            onChange={({ target: { value } }) => handleChange(i, value)}
            value={responses[i]}
          >
            <option selected>Seleccionar</option>
            {ejercicio.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            key={i}
            style={{
              // width: "250px",
              border: `2px solid ${
                selectStateI === null ? "gray" : getColor(selectStateI)
              }`,
              borderRadius: "5px",
            }}
            value={responses[i]}
            disabled={verified}
            onChange={({ target: { value } }) => handleChange(i, value)}
          />
        )}
        {shouldShowAnswer() && !sentence.shown && (
          <p
            className="et1-column-answer"
            style={{
              color: selectStateI ? "green" : "red",
              paddingLeft: ejercicio.options ? "20px" : 0,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => showExplanation(sentence.explanation)}
          >
            {getAnswer(sentence)}
          </p>
        )}
      </div>
    </div>
  );
};
