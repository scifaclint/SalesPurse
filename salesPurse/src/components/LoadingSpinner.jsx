const LoadingSpinner = ({
  size = "md",
  color = "indigo",
  text = "Loading...",
  fullScreen = false,
  showText = true,
}) => {
  // Size variants
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  // Color variants
  const colorClasses = {
    indigo: "border-indigo-600",
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    yellow: "border-yellow-600",
    purple: "border-purple-600",
  };

  const spinnerClasses = `
    inline-block rounded-full 
    border-solid border-t-transparent 
    animate-spin
    ${sizeClasses[size] || sizeClasses.md}
    ${colorClasses[color] || colorClasses.indigo}
  `;

  const containerClasses = `
    flex flex-col items-center justify-center
    ${fullScreen ? "fixed inset-0 bg-black bg-opacity-50 z-50" : ""}
  `;

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} />
      {showText && (
        <p
          className={`mt-4 text-${color}-600 font-medium ${
            fullScreen ? "text-white" : ""
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
