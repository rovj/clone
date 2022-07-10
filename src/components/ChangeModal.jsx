import React from "react";
import ReactDOM from "react-dom";
import "../styles/ChangeModal.css"

function ChangeModal({ open, resetEdit, children ,state }) {
  return ReactDOM.createPortal(
    <>
      {open == true && (
        <>
          <span className="close" onClick={resetEdit}>
            <i class="fa-regular fa-circle-xmark"></i>
          </span>
          <div className="back" />
          <div className={ (state.isEditMenu==true || state.isUpdateName==true || state.isUpdateEmail==true) ? "container-modal-change small-modal" : "container-modal-change large-modal"}>
            {children}
          </div>
        </>
      )}
    </>,
    document.getElementById("modal-change-root")
  );
}

export default ChangeModal;
