import { Dispatch, SetStateAction } from "react";

export function ConfirmationModal({
  message,
  setShowState,
  confirmFunction,
  args,
}: {
  message: string;
  setShowState: Dispatch<SetStateAction<boolean>>;
  confirmFunction: Function;
  args: any;
}) {
  function handleYes() {
    confirmFunction(...args);
    setShowState(false);
  }

  function handleNo() {
    setShowState(false);
  }

  return (
    <div className="darken-screen">
      <div className="modal">
        <h4 className="modal__title">{message}</h4>
        <div className="modal__btn-container">
          <button
            className="modal__button modal__button--yes"
            onClick={handleYes}
          >
            Yes
          </button>
          <button
            className="modal__button modal__button--no"
            onClick={handleNo}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
