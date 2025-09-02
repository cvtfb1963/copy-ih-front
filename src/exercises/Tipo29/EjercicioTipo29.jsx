import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PALETTE } from "../../common/palette";
import { AudioPlayer } from "../../components/AudioPlayer/AudioPlayer";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import { ExerciseControl } from "../../components/ExerciseControl/ExerciseControl";
import {
  EXERCISE_SKILLS
} from "../../constants/ejerciciosData";
import { useScreenSize } from '../../hooks/useScreenSize';
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer, getPlainValue } from "../../utils/exercises.utils";
import "./ejercicioTipo29.css";

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

export const ejemploTipo29 = {
  type: 29,
  vocabularyType: "idiom",
  unidad: 0.3,
  skill: EXERCISE_SKILLS.VOCABULARY,
  number: 22.5,
  vocabularyLevel: "B2",
  title: `otro test titulo`,
  explanation: `Esta es la explicación del funcionamiento de este vocabulario!`,
  example: `Este es un ejemplo de uso`,
  sentences: [
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

export const EjercicioTipo29 = ({ ejercicio }) => {
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
        {/* <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} /> */}
        <DescriptionRenderer ejercicio={ejercicio} />

        <div className="et29-vocabulary-info">
            <p className="poppins-medium">Este vocabulario es de tipo <b>{ejercicio.vocabularyType}</b> y pertenece al nivel <b>{ejercicio.vocabularyLevel}</b>.</p>
          <div className="et29-explanation-section">
            <EmojiObjectsIcon />
            <p className="poppins-bold">{ejercicio.explanation}</p>
          </div>
          <p className="et29-example-intro">Veamos un ejemplo:</p>
          <p className="et29-example-content">{ejercicio.example}</p>
          <p className="et29-practice-intro">Ahora, ejercitemos:</p>
        </div>

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
  
  const {isMobile} = useScreenSize()

  return (
    <div
      className="et6-sentence"
      key={i}
      style={{ border: removeBorder && "none", margin: removeBorder && 0 }}
    >
      <p className="et29-spanish-text" style={{ flex: 1, minWidth: "200px" }}>{sentence.sentence}</p>
      <div style={{width: isMobile ? '90%' : '40%', marginRight: 10}}>
        {sentence.shown ? (
          <p className="et29-shown-answer" style={{ fontWeight: "400" }}>{sentence.answer}</p>
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
              width: '100%',
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
            className="et29-answer-display"
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
