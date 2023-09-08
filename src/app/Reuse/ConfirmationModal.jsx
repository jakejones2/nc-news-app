export function ConfirmationModal({
  message,
  setShowState,
  confirmFunction,
  args,
}) {
  function handleYes() {
    confirmFunction(...args);
    setShowState(false);
  }

  function handleNo() {
    setShowState(false);
  }

  return (
    <div id="darken-screen">
      <div id="modal">
        <h4 id="modal-title">{message}</h4>
        <div id="modal-button-container">
          <button
            className="login-button modal-buttons"
            id="modal-yes-button"
            onClick={handleYes}
          >
            Yes
          </button>
          <button
            className="login-button modal-buttons"
            id="modal-no-button"
            onClick={handleNo}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
