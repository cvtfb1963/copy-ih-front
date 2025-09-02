import { useState } from "react";
import { useDispatch } from "react-redux";
import { PALETTE } from "../../common/palette";
import { AUDIO_PAISES } from "../../components/AudioPlayer/AudioPlayer";
import {
  DescriptionRenderer,
  TitleRenderer,
} from "../../components/DescriptionRenderer/DescriptionRenderer";
import { ExerciseControl } from "../../components/ExerciseControl/ExerciseControl";
import { FloatingVideo } from "../../components/FloatingVideo/FloatingVideo";
import { ImageWithAudio } from "../../components/ImageWithAudio/ImageWithAudio";
import { PaisSelector } from "../../components/PaisSelector/PaisSelector";
import {
  EXERCISE_SKILLS,
  EXPLANATION_VIDEOS,
} from "../../constants/ejerciciosData";
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer } from "../../utils/exercises.utils";
import "./ejercicioTipo17.css";

export const ejemploTipo17 = {
  skill: EXERCISE_SKILLS.LISTENING,
  type: 17,
  number: 391,
  unidad: 5,
  title: "Titulo del ejercicio",
  description: "Enunciado o consigna...",
  fields: [
    {
      answer: "aircon",
      audio: "1.1",
      image: "aircon.jpeg",
    },
  ],
};

export const EjercicioTipo17 = ({ ejercicio }) => {
  ejercicio = {
    ...ejercicio,
    fields: ejercicio.fields.map((field, i) => ({ ...field, id: i })),
  };
  const initialStates = ejercicio.fields.map(() => "");

  const [verified, setVerified] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const [responses, setResponses] = useState(initialStates);
  const [userResponses, setUserResponses] = useState(initialStates);
  const [answerSelected, setAnswerSelected] = useState(null);
  const [audioPais, setAudioPais] = useState(AUDIO_PAISES.ingles);

  const dispatch = useDispatch();

  const shuffleArray = (array) => {
    if (shuffled) return array;
    else setShuffled(true);

    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  };

  const shouldShowAnswer = () => verified && responses.some((x) => !x);

  const showAndSaveGrade = (results) => {
    const total = results.length;
    const successes = results.filter((x) => x).length;

    const grade = successes / total;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const handleVerify = () => {
    

    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const fields = [];
    ejercicio.fields.forEach((field) => fields.push(field));
    const responsesCheck = [];
    fields.forEach((field, iAns) => {
      if (field.shown) return responsesCheck.push(true);
      responsesCheck.push(checkAnswer(userResponses[iAns], field.answer, 17));
    });
    localStorage.removeItem("is_vocabulary_exercise");
    setResponses(responsesCheck);
    setVerified(true);
    showAndSaveGrade(responsesCheck);
  };

  const handleReset = () => {
    setUserResponses(initialStates);
    setResponses(initialStates);
    setAnswerSelected(null);
    setVerified(false);
  };

  const getIndex = (i) => i;

  const handleChange = (i) => {
    let value = null;

    if (userResponses[i] === "" && answerSelected != null)
      value = ejercicio.fields.find((x) => x.id === answerSelected).answer;
    else value = "";

    setUserResponses((old) => {
      const data = [...old];
      data[i] = value;
      return data;
    });
    setAnswerSelected(null);
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />

        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <PaisSelector
          audioPais={audioPais}
          setAudioPais={setAudioPais}
          width={300}
          includeLabel
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "10px auto",
            width: "90%",
            justifyContent: "center",
            alignContent: "center",
            background: PALETTE.quaternaryColor,
            borderRadius: "20px",
            padding: "10px",
            minHeight: "79px",
          }}
        >
          {shuffleArray(ejercicio.fields)
            .filter(({ answer }) => !userResponses.some((x) => x === answer))
            .map((field) => {
              return (
                <p
                  key={`field-${field.id}`}
                  style={{
                    background:
                      answerSelected === field.id
                        ? PALETTE.secondary_color
                        : "beige",
                    color:
                      answerSelected === field.id
                        ? PALETTE.primary_color
                        : PALETTE.textPrimaryColor,
                    transition: "all 0.1s ease-in-out",
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    scale: answerSelected === field.id ? "1.2" : "1",
                  }}
                  onClick={() => setAnswerSelected(field.id)}
                >
                  {field.answer}
                </p>
              );
            })}
        </div>
        <div className="et17-container">
          {ejercicio.fields.map((field, i) => (
            <div key={`f-${i}`} className="et17-card">
              <ImageWithAudio
                audioName={field.audio}
                imageName={field.image}
                audioPais={audioPais}
              />
              <p
                className="et17-value"
                style={{
                  cursor: "pointer",
                  color: shouldShowAnswer()
                    ? !responses[getIndex(i)]
                      ? "red"
                      : "green"
                    : "",
                }}
                onClick={() => handleChange(i)}
              >
                {userResponses[i]}
              </p>
              {shouldShowAnswer() && (
                <p
                  className="et1-column-answer"
                  style={{
                    lineHeight: 0,
                    margin: "0 0 0 12px",
                    padding: 0,
                    color: !responses[getIndex(i)] ? "red" : "green",
                  }}
                >
                  {field.answer}
                </p>
              )}
            </div>
          ))}
        </div>
        <ExerciseControl
          handleReset={handleReset}
          handleVerify={handleVerify}
          verified={verified}
        />
      </div>
    </div>
  );
};
