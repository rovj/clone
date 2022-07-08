import React from "react";
import "../styles/FollowModal.css";
import UserItem from "./userItem/UserItem";
import ReactDOM from "react-dom";

function FollowModal(props) {
  let {isFollowerList, modalList, isOpen , resetFollow} = props;
  return ReactDOM.createPortal(
    <>
      {isOpen == true && (
        <>
          {modalList === null ? (
            <div class="loader">
              <svg className="circular">
                <circle
                  className="path"
                  cx="50"
                  cy="50"
                  r="0"
                  fill="none"
                  stroke-width="5"
                  stroke-miterlimit="10"
                ></circle>
              </svg>
            </div>
          ) : (
            <>
              <span className="close" onClick={() => resetFollow()}>
                <i class="fa-regular fa-circle-xmark"></i>
              </span>
              <div className="back"/>
              <div className='container'>
                <div className="modal-follow-title">
                    {isFollowerList ? <b>Followers</b> : <b>Following</b>}
                </div>
                <div className="modal-follow-body">
                    {modalList.map((user,index)=>{
                        return <UserItem user={user}  />
                    })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>,
    document.getElementById("modal-follow-root")
  );
}

export default FollowModal;
