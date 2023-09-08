import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Topic({ topic = "abc", type, setQueries }) {
  /* The topic component creates an h tag with an inline 
  background color based on the topic's characters */

  const [rgbColours, setRgbColours] = useState([0, 0, 0]);

  function handleQueryUpdate() {
    if (setQueries) {
      setQueries((queries) => {
        const newQueries = { ...queries };
        newQueries.topic = topic;
        return newQueries;
      });
    }
  }

  useEffect(() => {
    topic = topic.toLowerCase();
    const firstLetter = topic[0];
    const secondLetter = topic[1] || "a";
    const thirdLetter = topic[2] || "b";

    const firstNum = firstLetter.charCodeAt(0) - 96;
    const secondNum = secondLetter.charCodeAt(0) - 96;
    const thirdNum = thirdLetter.charCodeAt(0) - 96;

    // only go to 200 to limit overall brightness against white text
    let red = Math.floor((firstNum * 200) / 26);
    let green = Math.floor((secondNum * 200) / 26);
    let blue = Math.floor((thirdNum * 200) / 26);
    const rgb = [red, green, blue];

    // check brightness is not too high for white text
    let darkColor = false;
    for (let i = 0; i < 3; i++) {
      if (rgb[i] % 2 === 0) {
        rgb[i] = 0;
        darkColor = true;
      } else if (i === 2 && !darkColor) {
        // add a red lean to help seperate topics beginning with same letter
        rgb[2] = 0;
        rgb[0] = 235;
      }
      setRgbColours(rgb);
    }
  }, []);

  return (
    <Link to={`/?limit=10&topic=${topic}&sort_by=created_at&order=desc`}>
      <h3
        onClick={handleQueryUpdate}
        style={{
          backgroundColor: `rgba(${rgbColours[0]}, ${rgbColours[1]}, ${rgbColours[2]}, 0.8)`,
          padding: "6px",
          borderRadius: "12px",
          height: "fit-content",
        }}
        className={type}
      >
        {topic}
      </h3>
    </Link>
  );
}
