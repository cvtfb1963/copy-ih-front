import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
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
import { useScreenSize } from "../../hooks/useScreenSize";
import { setCurrent } from "../../store/datosSlice";
import { checkAnswer } from "../../utils/exercises.utils";

export const ejemploTipo14 = {
  skill: EXERCISE_SKILLS.LISTENING,
  type: 14,
  number: 23,
  unidad: 3,
  audio: "2.1.1",
  title: "Titulo del ejercicio",
  description: "descipcion o consigna...",
  sentences: [
    {
      sentence: "What kind of shoes is the customer looking for?",
      answer: "large shoes",
      explanation: "Esta es la explicación de esta respuesta",
      shown: true,
    },
    {
      sentence: "How much is he willing to spend",
      answer: "$150",
    },
    {
      sentence: "What is the price that the seller is talking about?",
      answer: "$230",
    },
    {
      sentence: "Where does the customer live?",
      answer: "In london",
    },
    {
      sentence: "Where it is located the store",
      answer: "In Mánchester",
    },
  ],
};

const grid = 8;

const shuffleArray = (array) => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const getItemStyle = (isDragging, result, inBase, draggableStyle) => ({
  userSelect: "none",
  padding: "5px",
  fontSize: "14px",
  margin: "2px",
  color: isDragging
    ? "gray"
    : inBase
    ? "white"
    : result === ""
    ? "black"
    : "white",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver
    ? PALETTE.secondary_color
    : PALETTE.secondary_color,
  padding: grid,
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "row",
  overflow: "auto",
  minHeight: "40px",
  margin: "10px",
  borderRadius: "30px",
  flexWrap: "wrap",
});

const getPlaceHolderStyle = (isDraggingOver, result, isMobile) => ({
  background: isDraggingOver
    ? "lightblue"
    : result === ""
    ? "lightgrey"
    : !result
    ? "red"
    : "green",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "row",
  margin: "10px 10px 0 10px",
  padding: "10px",
  minWidth: "120px",
  height: "50px",
  overflow: "hidden",
  borderRadius: "20px",
  width: isMobile ? "96%" : "fit-content",
});

export const EjercicioTipo14 = ({ ejercicio }) => {
  const initItems = ejercicio.sentences.map(({ answer }, i) => ({
    id: `item-${i}`,
    index: i,
    content: answer,
    droppableId: null,
  }));
  const initResponses = ejercicio.sentences.map(() => "");

  const dispatch = useDispatch();
  const showExplanation = (text) =>
    dispatch(setCurrent({ explanation: text, explanationOpen: true }));

  const [verified, setVerified] = useState(false);
  const [items, setItems] = useState(initItems);
  const [responses, setResponses] = useState(initResponses);
  const { isMobile } = useScreenSize();

  const showAndSaveGrade = (results) => {
    const total = results.length;
    const successes = results.filter((x) => x).length;

    const grade = successes / total;

    dispatch(setCurrent({ grade, gradeOpen: true }));
  };

  const handleVerify = () => {
    localStorage.setItem(
      "is_vocabulary_exercise",
      ejercicio.skill === EXERCISE_SKILLS.VOCABULARY
    );
    const userResponses = [];

    const answers = ejercicio.sentences.map(({ answer }) => {
      userResponses.push(null);
      return answer;
    });

    Object.values(items).forEach((item) => {
      if (item.droppableId === null) return;
      userResponses[item.droppableId] = item.content;
    });

    const resultResponses = [];
    answers.forEach((answer, i) =>
      resultResponses.push(checkAnswer(answer, userResponses[i], 14))
    );

    localStorage.removeItem("is_vocabulary_exercise");

    setResponses(resultResponses);
    setVerified(true);

    showAndSaveGrade(resultResponses);
  };

  const handleReset = () => {
    setItems(initItems);
    setResponses(initResponses);
    setVerified(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    let movedItem = Number(result.draggableId.substring(5));

    const itemsCopy = [...items];

    if (result.destination.droppableId === "droppable-items") {
      itemsCopy[movedItem] = { ...itemsCopy[movedItem], droppableId: null };
      setItems(itemsCopy);
      return;
    }

    const droppableId = Number(result.destination.droppableId.substring(10));
    const itemInTargetPosition = itemsCopy.findIndex(
      (x) => x.droppableId === droppableId
    );
    itemsCopy[movedItem] = { ...itemsCopy[movedItem], droppableId };
    if (itemInTargetPosition !== -1) {
      itemsCopy[itemInTargetPosition] = {
        ...itemsCopy[itemInTargetPosition],
        droppableId: null,
      };
    }
    setItems(itemsCopy);
  };

  return (
    <div className="gramatica-page">
      <div className="gramatica-container">
        <TitleRenderer />
        <FloatingVideo videoID={EXPLANATION_VIDEOS[ejercicio.type]} />
        <DescriptionRenderer ejercicio={ejercicio} />
        <h4 style={{ textAlign: "center" }}>{ejercicio.sentence}</h4>
        {ejercicio.audio && (
          <AudioPlayer audioName={ejercicio.audio} justEnglish />
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="droppable-items"
            direction={isMobile ? "vertical" : "horizontal"}
          >
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, isMobile)}
              >
                {shuffleArray(items)
                  .filter((x) => x.droppableId === null)
                  .map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            responses[index],
                            true,
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
          {items.map((_, iDrop) => (
            <div
              key={`drop-${iDrop}`}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "" : "center",
                justifyContent: isMobile ? "center" : "space-between",
                width: "95%",
                background: "#faa864",
                color: "white",
                margin: "10px auto",
                borderRadius: "20px",
              }}
            >
              <p style={{ margin: "10px" }}>
                {ejercicio.sentences[iDrop].sentence}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "70px",
                }}
              >
                <Droppable droppableId={`droppable-${iDrop}`}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getPlaceHolderStyle(
                        snapshot.isDraggingOver,
                        responses[iDrop],
                        isMobile
                      )}
                    >
                      {items
                        .filter((x) => x.droppableId === iDrop)
                        .map((item) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={item.index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  responses[iDrop],
                                  false,
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
                {verified && (
                  <p
                    style={{
                      lineHeight: 1.5,
                      fontSize: "13px",
                      color: responses[iDrop] ? "green" : "red",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      showExplanation(ejercicio.sentences[iDrop].explanation)
                    }
                  >
                    {ejercicio.sentences[iDrop].answer}
                  </p>
                )}
              </div>
            </div>
          ))}
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
