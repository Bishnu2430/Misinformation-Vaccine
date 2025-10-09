import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  const types = {
    success: {
      bg: "bg-success-50",
      border: "border-success-200",
      text: "text-success-800",
      icon: CheckCircle,
      iconColor: "text-success-600",
    },
    error: {
      bg: "bg-danger-50",
      border: "border-danger-200",
      text: "text-danger-800",
      icon: XCircle,
      iconColor: "text-danger-600",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: AlertCircle,
      iconColor: "text-amber-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: Info,
      iconColor: "text-blue-600",
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} ${config.border} ${config.text} border rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
