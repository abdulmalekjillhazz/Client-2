import React from "react";

const PageContainer = ({ children, className = "" }) => {
  return <div className={`page-container mx-auto w-full max-w-[1120px] ${className}`.trim()}>{children}</div>;
};

export default PageContainer;
