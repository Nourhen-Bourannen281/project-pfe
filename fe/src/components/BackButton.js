// components/BackButton.jsx
import React from "react";
import "../styles/BackButton.css";

const BackButton = () => {
  return (
    <div className="back-button-wrapper" onClick={() => window.history.back()}>
      <svg width="18px" height="17px" viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(8.5, 8.5) scale(-1, 1) translate(-8.5, -8.5)">
          <polygon className="arrow" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
          <polygon className="arrow-fixed" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
          <path d="M0,0.56 L0,16.19 L9.70,8.34 L0,0.56 Z M1.33,3.30 L7.62,8.34 L1.33,13.43 L1.33,3.30 Z"></path>
        </g>
      </svg>
    </div>
  );
};

export default BackButton;
