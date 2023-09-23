import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Topic({ topic = "abc", type, setQueries }) {
  const [rgbColours, setRgbColours] = useState([0, 0, 0]);

  useEffect(() => {
    topic = topic.toLowerCase();
    const firstLetter = topic[0];
    const secondLetter = topic[1] || "a";
    const thirdLetter = topic[2] || "b";

    const firstNum = firstLetter.charCodeAt(0) - 96;
    const secondNum = secondLetter.charCodeAt(0) - 96;
    const thirdNum = thirdLetter.charCodeAt(0) - 96;

    // only go to 200 to limit overall brightness
    let red = Math.floor((firstNum * 200) / 26);
    let green = Math.floor((secondNum * 200) / 26);
    let blue = Math.floor((thirdNum * 200) / 26);
    const rgb = [red, green, blue];

    // check brightness
    let darkColor = false;
    for (let i = 0; i < 3; i++) {
      if (rgb[i] % 2 === 0) {
        rgb[i] = 0;
        darkColor = true;
      } else if (i === 2 && !darkColor) {
        // add a red bias
        rgb[2] = 0;
        rgb[0] = 235;
      }
      setRgbColours(rgb);
    }
  }, []);

  function handleQueryUpdate() {
    if (setQueries) {
      setQueries((queries) => {
        const newQueries = { ...queries };
        newQueries.topic = topic;
        newQueries.page = 1;
        return newQueries;
      });
    }
  }

  if (type.includes("inline")) {
    return (
      <span
        style={{
          color: `rgba(${rgbColours[0]}, ${rgbColours[1]}, ${rgbColours[2]}`,
        }}
      >
        {topic}
      </span>
    );
  }

  return (
    <Link to={`/?limit=10&topic=${topic}&sort_by=created_at&order=desc`}>
      <h3
        onClick={handleQueryUpdate}
        style={{
          backgroundColor: `rgba(${rgbColours[0]}, ${rgbColours[1]}, ${rgbColours[2]}, 0.8)`,
        }}
        className={type}
      >
        {topic}
      </h3>
    </Link>
  );
}
