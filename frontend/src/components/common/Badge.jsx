import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Badge = ({
  children,
  variant = "default",
  icon = false,
  className = "",
}) => {
  const variants = {
    success: "badge-success",
    danger: "badge-danger",
    warning: "badge-warning",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const icons = {
    success: CheckCircle,
    danger: XCircle,
    warning: AlertCircle,
  };

  const Icon = icon && icons[variant];

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
};

export default Badge;
