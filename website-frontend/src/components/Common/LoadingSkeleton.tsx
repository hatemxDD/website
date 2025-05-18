import React from "react";
import "./LoadingSkeleton.css";

interface LoadingSkeletonProps {
  type:
    | "text"
    | "title"
    | "paragraph"
    | "image"
    | "button"
    | "tag"
    | "card"
    | "avatar"
    | "circle"
    | "container";
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type,
  width,
  height,
  count = 1,
  className = "",
  style = {},
  fullWidth = false,
}) => {
  // Function to determine default dimensions based on type
  const getDefaultDimensions = () => {
    switch (type) {
      case "text":
        return { width: "100px", height: "15px" };
      case "title":
        return { width: "200px", height: "30px" };
      case "paragraph":
        return { width: fullWidth ? "100%" : "90%", height: "15px" };
      case "image":
        return { width: "100%", height: "300px" };
      case "button":
        return { width: "100px", height: "40px" };
      case "tag":
        return { width: "80px", height: "30px" };
      case "card":
        return { width: "300px", height: "200px" };
      case "avatar":
        return { width: "50px", height: "50px" };
      case "circle":
        return { width: "50px", height: "50px" };
      case "container":
        return { width: "100%", height: "100%" };
      default:
        return { width: "100px", height: "15px" };
    }
  };

  const defaultDimensions = getDefaultDimensions();
  const finalWidth = width || defaultDimensions.width;
  const finalHeight = height || defaultDimensions.height;

  // Base styles
  const baseStyle: React.CSSProperties = {
    width: finalWidth,
    height: finalHeight,
    ...style,
  };

  // Custom styles for specific types
  const getTypeSpecificStyle = () => {
    switch (type) {
      case "tag":
        return { borderRadius: "2rem" };
      case "circle":
      case "avatar":
        return { borderRadius: "50%" };
      case "button":
        return { borderRadius: "0.5rem" };
      default:
        return { borderRadius: "0.25rem" };
    }
  };

  const finalStyle = {
    ...baseStyle,
    ...getTypeSpecificStyle(),
  };

  // Generate multiple skeleton items if count > 1
  if (count > 1) {
    return (
      <div className={`skeleton-group ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`skeleton-loading loading-pulse ${
                type === "paragraph" && index === count - 1
                  ? "last-paragraph"
                  : ""
              }`}
              style={{
                ...finalStyle,
                width:
                  type === "paragraph" && index === count - 1
                    ? "60%"
                    : type === "paragraph" && index % 2 === 1
                      ? "90%"
                      : finalStyle.width,
              }}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton-loading loading-pulse ${className}`}
      style={finalStyle}
    />
  );
};

export default LoadingSkeleton;
