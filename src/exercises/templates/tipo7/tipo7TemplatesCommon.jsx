import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TIPO7_BLUE } from "../../Tipo7/formulasPage/Tipo7FormulasPage";

export const T7TTitleNode = (props) => {
  const {
    content,
    data: { color, tachado },
  } = props;

  return (
    <div
      style={{
        fontSize: "25px",
        color,
        background: "white",
      }}
    >
      <h3 style={{ width: "100%", textAlign: "center", lineHeight: 1 }}>
        {tachado ? <del>{content}</del> : content}
      </h3>
    </div>
  );
};

export const T7TMultiSelectNode1 = (props) => {
  let {
    data: { options, responses, onGradeChange, iStart, small },
  } = props;

  if (!iStart) iStart = 0;

  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  const [selected, setSelected] = useState(["Elegir", "Elegir", "Elegir"]);

  const onChange = (i, v) => {
    setSelected((old) => {
      const data = [...old];
      data[i] = v;

      const grade = v === responses[i] ? 1 : 0;
      onGradeChange(i + iStart, grade);

      return data;
    });
  };

  useEffect(() => {
    if (!verified) setSelected(["Elegir", "Elegir", "Elegir"]);
  }, [verified]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <CustomSelect
          selected={selected[0]}
          isCorrect={selected[0] === responses[0]}
          onChange={(v) => onChange(0, v)}
          options={options}
          small={small}
        />
        <div style={{ width: small ? "6px" : "20px" }}></div>
        <CustomSelect
          selected={selected[1]}
          isCorrect={selected[1] === responses[1]}
          onChange={(v) => onChange(1, v)}
          options={options}
          small={small}
        />
      </div>
      <p
        style={{
          transform: "rotate(-90deg)",
          fontSize: !small ? "150px" : "110px",
          color: TIPO7_BLUE,
          lineHeight: !small ? "45px" : "25px",
          fontFamily: `"Major Mono Display", monospace`,
          zIndex: 1,
          marginLeft: 15,

          position: small && "relative",
          top: small && -3,
        }}
      >{`{`}</p>
      <CustomSelect
        selected={selected[2]}
        isCorrect={selected[2] === responses[2]}
        onChange={(v) => onChange(2, v)}
        options={options}
        small={small}
      />
    </div>
  );
};

export const T7TSimpleSelectNode = (props) => {
  const {
    data: { options, response, onGradeChange, small },
  } = props;

  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  const [selected, setSelected] = useState("Elegir");

  useEffect(() => {
    const grade = selected === response ? 1 : 0;
    onGradeChange(grade);
  }, [selected]);

  useEffect(() => {
    if (!verified) setSelected("Elegir");
  }, [verified]);

  return (
    <CustomSelect
      options={options}
      isCorrect={selected === response}
      onChange={setSelected}
      selected={selected}
      small={small}
    />
  );
};

export const T7TCompleteVerboTotal = ({
  left,
  right,
  options,
  onGradeChange,
}) => {
  const corrects = Array.isArray(right)
    ? [left, ...right, "Auxiliar", "Verbo Restante (Vr)", "Verbo Total (Vt)"]
    : [left, right, "Auxiliar", "Verbo Restante (Vr)", "Verbo Total (Vt)"];

  const initialState = Array.isArray(right)
    ? ["Elegir", ...right.map(() => "Elegir"), "Elegir", "Elegir", "Elegir"]
    : ["Elegir", "Elegir", "Elegir", "Elegir", "Elegir"];

  const [selecteds, setSelecteds] = useState(initialState);

  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  useEffect(() => {
    if (!verified) setSelecteds(initialState);
  }, [verified]);

  const onChange = (i, v) => {
    setSelecteds((old) => {
      const data = [...old];
      data[i] = v;

      const total = selecteds.length;

      let correctsCount = 0;
      corrects.forEach((res, i) => {
        if (res === data[i]) correctsCount++;
      });

      const grade = correctsCount / total;

      onGradeChange(grade);

      return data;
    });
  };

  const getRightEnd = () => (Array.isArray(right) ? right.length : 1);

  const verboOptions = ["Auxiliar", "Verbo Restante (Vr)", "Verbo Total (Vt)"];

  return (
    <div className="t7fp-vt-container">
      <div>
        <div>
          <CustomSelect
            large
            isCorrect={selecteds[0] === corrects[0]}
            onChange={(v) => onChange(0, v)}
            options={options}
            selected={selecteds[0]}
          />
          <CustomSelect
            large
            isCorrect={
              selecteds[getRightEnd() + 1] === corrects[getRightEnd() + 1]
            }
            onChange={(v) => onChange(getRightEnd() + 1, v)}
            options={verboOptions}
            selected={selecteds[getRightEnd() + 1]}
            bold
          />
          <hr style={{ width: "100%", marginTop: 4 }} />
        </div>
        <p style={{ margin: "20px" }}>+</p>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {Array.isArray(right) ? (
              right.map((value, i, arr) => (
                <>
                  <CustomSelect
                    large
                    key={`right-${i}`}
                    isCorrect={selecteds[i + 1] === corrects[i + 1]}
                    onChange={(v) => onChange(i + 1, v)}
                    options={options}
                    selected={selecteds[i + 1]}
                  />
                  {i + 1 < arr.length && <div style={{ width: 5 }}></div>}
                </>
              ))
            ) : (
              <CustomSelect
                large
                isCorrect={selecteds[1] === corrects[1]}
                onChange={(v) => onChange(1, v)}
                options={options}
                selected={selecteds[1]}
              />
            )}
          </div>
          <CustomSelect
            large
            isCorrect={
              selecteds[getRightEnd() + 2] === corrects[getRightEnd() + 2]
            }
            onChange={(v) => onChange(getRightEnd() + 2, v)}
            options={verboOptions}
            selected={selecteds[getRightEnd() + 2]}
            bold
          />
          <hr style={{ width: "100%", marginTop: 4 }} />
        </div>
      </div>
      <div style={{ height: 8 }}></div>
      <CustomSelect
        large
        isCorrect={selecteds[getRightEnd() + 3] === corrects[getRightEnd() + 3]}
        onChange={(v) => onChange(getRightEnd() + 3, v)}
        options={verboOptions}
        selected={selecteds[getRightEnd() + 3]}
        bold
      />
    </div>
  );
};

const CustomSelect = ({
  isCorrect,
  onChange,
  options,
  selected,
  bold,
  large,
  small,
}) => {
  const {
    current: { verified },
  } = useSelector((state) => state.datos);

  return (
    <div
      style={{
        background: "white",
        zIndex: 10,
      }}
    >
      <select
        disabled={verified}
        style={{
          position: small && "relative",
          top: small && -3,
          border: `${verified ? "2px" : "1px"} solid ${
            !verified ? "gray" : !isCorrect ? "red" : "green"
          }`,
          background: !verified
            ? "transparent"
            : !isCorrect
            ? "rgb(255, 0, 0, 0.1)"
            : "rgb(0, 255, 0, 0.1)",
          width: !large ? (!small ? "100px" : "75px") : "150px",
          fontSize: !bold ? "10px" : "15px",
          minHeight: small ? "15px" : "20px",
        }}
        className="tipo7Select"
        onChange={({ target: { value } }) => onChange(value)}
        value={selected}
      >
        <option value={"Elegir"} style={{ display: "none" }}>
          Elegir
        </option>
        {options.map((option, i) => (
          <option key={`o-${i}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
