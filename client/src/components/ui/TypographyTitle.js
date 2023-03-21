import React from "react"
import "./TypographyTitle.css"

function TypographyTitle({ children, className }) {
  const style = `${className || ""}`
  return <h1 className={`typography-title ${style}`}>{children}</h1>
}

export default TypographyTitle
