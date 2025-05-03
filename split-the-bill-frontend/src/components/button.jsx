
import React from "react";

const Button = ({ type = "button", className = "", id, onClick, children }) => {
  return (
    <button
      type={type}
      className={`btn-component ${className}`}
      id={id}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
