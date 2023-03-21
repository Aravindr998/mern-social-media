import React from "react"

function TypographyBody({ children, className }) {
  const style = `${className || ""}`
  return <p className={`typography-body ${style}`}>{children}</p>
}

export default TypographyBody
