import React from "react";
import './Button.css';

function Button({
    children,
    className,
    disabled = false,
    onClick,
    type = "button",
    visual = "button",
    id,
}) {
    let buttonClass = "button";
    if (visual === "link") {
        buttonClass = "button-link";
    }
    return (
        <button
            className={`${buttonClass} ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick}
            id={id}
        >
            {children}
        </button>
    );
}

export default Button;


