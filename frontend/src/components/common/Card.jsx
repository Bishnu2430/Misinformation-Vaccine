import React from "react";

const Card = ({
  children,
  variant = "depth",
  className = "",
  hover = false,
  ...props
}) => {
  const variants = {
    depth: "depth-card",
    glass: "glass-card",
    flat: "bg-white border border-gray-200",
  };

  const hoverEffect = hover
    ? "cursor-pointer hover:shadow-soft-xl transition-all duration-300"
    : "";

  return (
    <div
      className={`${variants[variant]} rounded-lg p-6 ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
