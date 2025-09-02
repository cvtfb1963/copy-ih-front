import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useState } from "react";
import { useSelector } from "react-redux";
import { PALETTE } from "../../common/palette";
import { EXERCISE_SKILLS } from "../../constants/ejerciciosData";
import { EXERCISE_SKILLS_COLORS } from "../DescriptionRenderer/DescriptionRenderer";

export const UnidadIndice = ({ onNavigate }) => {
  const { unidadIndice, user } = useSelector((state) => state.datos);

  const [containerExpaned, setContainerExpaned] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const skillsAllowedByPlan = user?.profileApplied?.skills;

  return (
    unidadIndice && (
      <div style={{ width: "95%", margin: "0 auto 10px auto" }}>
        <Accordion
          expanded={containerExpaned}
          onChange={() => setContainerExpaned(!containerExpaned)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <p className="poppins-bold">Índice de la unidad</p>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            {Object.values(EXERCISE_SKILLS).map((skill, iSkill) =>
              unidadIndice.some((x) => x.skill === skill) ? (
                <SkillIndice
                  key={`skill-${iSkill}`}
                  name={skill}
                  list={unidadIndice.filter((x) => x.skill === skill)}
                  expanded={expanded}
                  handleChange={handleChange}
                  skillAllowedByPlan={!skillsAllowedByPlan || skillsAllowedByPlan.includes(skill.toLowerCase())}
                  navigateTo={(exercise) => {
                    setExpanded("");
                    setContainerExpaned(false);
                    onNavigate(exercise.indicePosition);
                  }}
                />
              ) : (
                <></>
              )
            )}
          </AccordionDetails>
        </Accordion>
      </div>
    )
  );
};

const SkillIndice = ({ name, list, expanded, handleChange, navigateTo, skillAllowedByPlan }) => {
  const {
    current: { displayUnidad },
    user,
  } = useSelector((state) => state.datos);

  return (
    <Accordion
      expanded={skillAllowedByPlan && expanded === name}
      onChange={skillAllowedByPlan ? handleChange(name) : undefined}
      sx={{ 
        m: 1,
        ...(skillAllowedByPlan ? {} : {
          backgroundColor: '#f5f5f5',
          opacity: 0.6,
          border: '1px solid #ddd',
          cursor: skillAllowedByPlan ? 'pointer' : 'not-allowed',
        })
      }}
      TransitionProps={{
        timeout: {
          appear: 600,
          enter: 600,
          exit: 200,
        },
      }}
    >
      <AccordionSummary 
        expandIcon={skillAllowedByPlan ? <ExpandMoreIcon /> : <LockIcon sx={{ color: "#999" }} />}
        sx={{
          cursor: skillAllowedByPlan ? 'pointer' : 'not-allowed',
          '&:hover': {
            backgroundColor: skillAllowedByPlan ? undefined : 'transparent'
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <p
            className="poppins-semibold"
            style={{ 
              color: skillAllowedByPlan ? EXERCISE_SKILLS_COLORS[name] : "#999",
              margin: 0,
              flex: 1
            }}
          >
            {name}
          </p>
          {!skillAllowedByPlan && (
            <span style={{
              fontSize: '12px',
              color: '#666',
              fontWeight: 'bold',
              marginLeft: '10px'
            }}>
              No disponible en tu plan
            </span>
          )}
        </div>
      </AccordionSummary>
      {skillAllowedByPlan && (
        <AccordionDetails>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {list.map((exercise, i) => (
              <div
                key={`${name}-${i}`}
                style={{
                  margin: "0 0 5px 0",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
                onClick={() =>
                  (exercise.completedByUser ||
                    displayUnidad <= 4 ||
                    user?.freeNavigation) &&
                  navigateTo(exercise)
                }
              >
                <p
                  className="poppins-medium"
                  style={{
                    fontSize: "20px",
                    width: "50px",
                    display: "inline-block",
                    textAlign: "end",
                    marginRight: 10,
                  }}
                >
                  {i + 1}.
                </p>
                <p
                  style={{
                    textDecoration:
                      (exercise.completedByUser ||
                        displayUnidad <= 4 ||
                        user?.freeNavigation) &&
                      "underline",
                    cursor:
                      (exercise.completedByUser ||
                        displayUnidad <= 4 ||
                        user?.freeNavigation) &&
                      "pointer",
                    display: "inline",
                  }}
                >
                  {exercise.title}
                </p>
                <span
                  style={{
                    fontSize: "10px",
                    margin: "6px",
                    background: [18, 30].includes(exercise.type)
                      ? PALETTE.tertiary_color
                      : PALETTE.quaternaryColor,
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "30px",
                  }}
                  className="poppins-semibold"
                >
                  {exercise.type === 18
                    ? "VIDEO"
                    : exercise.type === 30
                    ? "LECTURA"
                    : "PRÁCTICA"}
                </span>
                {![18, 30, 31].includes(exercise.type) &&
                  exercise.gradeByUser && (
                    <span
                      style={{
                        fontSize: "10px",
                        margin: "6px 6px 6px 0",
                        background: exercise.gradeByUser > 0.6 ? "green" : "red",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "30px",
                      }}
                      className="poppins-bold"
                    >
                      {Math.round(exercise.gradeByUser * 100)}%
                    </span>
                  )}
              </div>
            ))}
          </div>
        </AccordionDetails>
      )}
    </Accordion>
  );
};
