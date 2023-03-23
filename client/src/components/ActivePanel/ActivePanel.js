import { Card, CardContent, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

function ActivePanel() {
  return (
    <Card
      sx={{
        position: "fixed",
        top: 100,
        right: 20,
        width: "23%",
        height: "82vh",
        padding: "1rem",
        display: { xs: "none", lg: "block" },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography sx={{ color: "green", fontWeight: 700 }}>
            Active
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActivePanel
