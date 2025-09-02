import { DotLottiePlayer } from "@dotlottie/react-player";

export const EXERCISE_ANIMATIONS = {
  GRAMMAR: "animations/grammar.lottie",
  LISTENING: "animations/listening.lottie",
  PRONUNCIATION: "animations/pronunciation.lottie",
  SPEAKING: "animations/speaking.lottie",
  READING: "animations/reading.lottie",
  WRITING: "animations/writing.lottie",
  VOCABULARY: "animations/vocabulary.lottie",
  TOTAL: "animations/full.lottie",
};

export const StatisticsShower = ({ statistics }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "90vw",
      }}
    >
      <StatisticSkill title={"Grammar"} statistics={statistics} />
      <StatisticSkill title={"Listening"} statistics={statistics} />
      <StatisticSkill title={"Pronunciation"} statistics={statistics} />
      <StatisticSkill title={"Reading"} statistics={statistics} />
      <StatisticSkill title={"Speaking"} statistics={statistics} />
      <StatisticSkill title={"Writing"} statistics={statistics} />
      <StatisticSkill title={"Vocabulary"} statistics={statistics} />
      <StatisticSkill title={"total"} statistics={statistics} />
    </div>
  );
};

const StatisticSkill = ({ title, statistics }) => {
  return (
    <div
      style={{
        width: "260px",
        border: "1px solid black",
        boxShadow: "0 10px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        margin: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <p
          className="poppins-semibold"
          style={{ fontSize: "1.3rem", margin: "0 10px", letterSpacing: 0 }}
        >
          {title !== "total"
            ? title
            : statistics?.unidad
            ? "Promedio Unidad"
            : "Promedio Global"}
        </p>
        <p
          className="poppins-bold"
          style={{
            fontSize: "1.3rem",
            margin: "0 10px",
            color: statistics[title] >= 0.6 ? "green" : "red",
          }}
        >
          {Number(Number(statistics[title]) * 100).toFixed(2)}%
        </p>
      </div>
      <DotLottiePlayer
        src={EXERCISE_ANIMATIONS[String(title).toUpperCase()]}
        autoplay
        loop
        style={{ height: "130px" }}
      />
    </div>
  );
};
