import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
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
import { useScreenSize } from "../../hooks/useScreenSize";
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer, getPlainValue } from "../../utils/exercises.utils";
import "./ejercicioTipo8.css";

export const ejemploTipo8 = {
  skill: EXERCISE_SKILLS.GRAMMAR,
  type: 8,
  number: 23,
  groupLength: 2,
  unidad: 3,
  title: "Titulo del ejercicio",
  description: "descipcion o consigna...",
  sentence: "El fin de semana fui al cine con mis padres",
  answer: "The weekend I went with my parents to the cinema",
  explanation: "Esta es la explicación",
};

const grid = 8;

const separateSentence = (sentence, groupLengthTemp) => {
  const words = sentence.split(" ");

  let groups = [];
  let currentGroup = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const groupLength = groupLengthTemp
      ? groupLengthTemp + 1
      : Math.floor(Math.random() * 2) + 3;

    if (
      currentGroup.split(" ").length < groupLength - 1 ||
      i === words.length - 1
    ) {
      currentGroup += (currentGroup === "" ? "" : " ") + word;
    } else {
      groups.push(currentGroup);
      currentGroup = word;
    }
  }

  if (currentGroup !== "") {
    groups.push(currentGroup);
  }

  groups = groups.filter((x) => Boolean(x)).sort(() => Math.random() - 0.5);

  return groups;
};

const getItemStyle = (isDragging, result, draggableStyle) => ({
  userSelect: "none",
  padding: `${grid * 2}px ${grid * 3}px`,
  margin: `0 ${grid}px ${grid}px 0`,
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#2d3748",
  cursor: "grab",
  border: "2px solid transparent",
  boxShadow: result !== null 
    ? Number(result) >= 0.99
      ? "0 4px 16px rgba(72, 187, 120, 0.3), 0 0 0 2px #48bb78"
      : Number(result) === 0
      ? "0 4px 16px rgba(245, 101, 101, 0.3), 0 0 0 2px #f56565"
      : "0 4px 16px rgba(251, 191, 36, 0.3), 0 0 0 2px #fbbf24"
    : isDragging
    ? "0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)"
    : "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
  background: result !== null
      ? Number(result) >= 0.99
      ? "linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)"
        : Number(result) === 0
      ? "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)"
      : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
      : isDragging
    ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, isMobile) => ({
  background: isDraggingOver 
    ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" 
    : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  padding: `${grid * 3}px`,
  borderRadius: "16px",
  border: isDraggingOver 
    ? "2px dashed #3b82f6" 
    : "2px solid #e2e8f0",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  overflow: "auto",
  minHeight: "120px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const EjercicioTipo8 = ({ ejercicio }) => {
  const initItems = separateSentence(
    ejercicio.answer,
    ejercicio.groupLength
  ).map((fragment, i) => ({
    id: `item-${i}`,
    content: fragment,
  }));
  const [verified, setVerified] = useState(false);
  const [items, setItems] = useState(initItems);
  const [result, setResult] = useState(null);
  const { isMobile } = useScreenSize();

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const showAndSaveGrade = (result) => {
    dispatch(setCurrent({ grade: result, gradeOpen: true }));
  };

  const handleVerify = () => {
    

    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill == EXERCISE_SKILLS.VOCABULARY
    );
    const userAnswer = items.map((item) => item.content).join(" ");
    const result = checkAnswer(
      userAnswer,
      ejercicio.answer,
      ejercicio.answer2,
      ejercicio.answer3,
      ejercicio.answer4,
      ejercicio.answer5,
      ejercicio.answer6,
      ejercicio.answer7,
      ejercicio.answer8,
      ejercicio.answer9,
      ejercicio.answer10,
      ejercicio.answer11,
      ejercicio.answer12,
      8
    );
    localStorage.removeItem("is_vocabulary_exercise");
    setResult(result);
    setVerified(true);
    showAndSaveGrade(result);
  };

  const handleReset = () => {
    setItems(initItems);
    setResult(null);
    setVerified(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const orderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(orderedItems);
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <h4 className="et8-spanish-sentence">{ejercicio.sentence}</h4>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="droppable"
            direction={isMobile ? "vertical" : "horizontal"}
          >
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, isMobile)}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          result,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {result !== null && (
            <p className="et8-answer-display" onClick={() => showExplanation(ejercicio.explanation)}>
              {getPlainValue(ejercicio.answer)}
            </p>
          )}
        </DragDropContext>
        <ExerciseControl
          handleReset={handleReset}
          handleVerify={handleVerify}
          verified={verified}
        />
      </div>
    </div>
  );
};
