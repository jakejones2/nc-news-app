import { useState } from "react";

export function ItemDropDown({ header, image, children }) {
  const [showItems, setShowItems] = useState(false);

  function toggleItemView() {
    setShowItems((bool) => !bool);
  }

  return (
    <>
      <div className="info-bar info-bar--margin">
        <div className="info-bar__stat" onClick={toggleItemView}>
          <p className="info-bar__header">{header}</p>
          <img className="info-bar__logo" src={image}></img>
        </div>
        <button onClick={toggleItemView}>
          <div
            className={
              showItems ? "dropdown dropdown--down" : "dropdown dropdown--up"
            }
          ></div>
        </button>
      </div>
      {showItems && children}
    </>
  );
}
