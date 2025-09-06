import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${className}`}
  >
    {children}
  </button>
);

export default Button;
