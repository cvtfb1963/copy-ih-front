import { PALETTE } from "../../common/palette";
import "./progressBar.css";

export const Progressbar = ({ filled, mobile }) => {
  return (
    <div className="progressbar" style={{ width: mobile && "94%" }}>
      <div
        style={{
          height: "100%",
          width: `${filled}%`,
          backgroundColor: PALETTE.quaternaryColor,
          transition: "width 0.5s",
        }}
      ></div>
      <span className="progressPercent popins-regular">{filled}%</span>
    </div>
  );
};
