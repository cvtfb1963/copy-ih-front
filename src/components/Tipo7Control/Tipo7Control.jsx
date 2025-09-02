import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setCurrent, setVerified } from "../../store/datosSlice";

export const Tipo7Control = ({ step, setStep, grades }) => {
  const dispatch = useDispatch();

  const handleVerify = () => {
    dispatch(setVerified(true));
    setStep(3);

    const gradeTotal = grades.reduce((a, b) => a + b, 0) / grades.length;
    const grade = grades[2];

    dispatch(setCurrent({ grade, gradeTotal, gradeOpen: true }));
  };

  const showPartialGrade = () => {
    const grade = (grades[0] + grades[1]) / 2;
    dispatch(setCurrent({ grade, gradeOpen: true, dontSaveGrade: true }));
  };

  return (
    <>
      {[1, 3].includes(step) && (
        <div style={{ margin: "10px" }}>
          <Button
            fullWidth
            onClick={() => {
              setStep(0);
              dispatch(setVerified(false));
            }}
          >
            REINICIAR
          </Button>
        </div>
      )}
      <div style={{ margin: "10px" }}>
        {step === 0 ? (
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setStep(1);
              dispatch(setVerified(true));
              showPartialGrade();
            }}
          >
            VERIFICAR
          </Button>
        ) : step === 1 ? (
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setStep(2);
              dispatch(setVerified(false));
            }}
          >
            IR A LA SEGUNDA PARTE
          </Button>
        ) : (
          step === 2 && (
            <Button variant="contained" fullWidth onClick={handleVerify}>
              VERIFICAR
            </Button>
          )
        )}
      </div>
    </>
  );
};
