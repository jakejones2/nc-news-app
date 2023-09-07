import { useState } from "react";
import { Comments } from "../Article/Comments";

export function ItemDropDown({ header, component, image }) {
  const [showItems, setShowItems] = useState(false);

  function toggleItemView() {
    setShowItems((bool) => !bool);
  }

  return (
    <div className="user-content-bar">
      <div id="article-stats">
        <div className="article-stat" onClick={toggleItemView}>
          <p className="history-text">{header}</p>
          <img className="article-logo" src={image}></img>
        </div>
        <button id="drop-down-comments" onClick={toggleItemView}>
          <div className={showItems ? "drop-down" : "drop-up"}></div>
        </button>
      </div>
      {showItems && component}
    </div>
  );
}
