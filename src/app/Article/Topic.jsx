export function Topic({ topic, type }) {
  topic = topic.toLowerCase();
  const firstLetter = topic[0];
  const secondLetter = topic[1] || "a";
  const thirdLetter = topic[2] || "b";
  const firstNum = firstLetter.charCodeAt(0) - 96;
  const secondNum = secondLetter.charCodeAt(0) - 96;
  const thirdNum = thirdLetter.charCodeAt(0) - 96;
  const firstRgb = Math.floor((firstNum * 255) / 26);
  const secondRgb = Math.floor((secondNum * 255) / 26);
  const thirdRgb = Math.floor((thirdNum * 255) / 26);
  return (
    <h3
      style={{
        backgroundColor: `rgba(${firstRgb}, ${secondRgb}, ${thirdRgb}, 0.6)`,
        padding: "6px",
        borderRadius: "8px",
        height: "fit-content",
      }}
      className={type}
    >
      {topic}
    </h3>
  );
}

// types: article-topic, preview-topic
