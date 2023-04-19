import React, { useEffect, useState } from "react"
import Paper from "@mui/material/Paper"
import MenuList from "@mui/material/MenuList"
import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ReportIcon from "@mui/icons-material/Report"
import { ClickAwayListener, Grow } from "@mui/material"
import { useSelector } from "react-redux"

function PostMenu({ handleClickAway, checked, postOwner, handleEditPost }) {
  const user = useSelector((state) => state.user)
  const [owner, setOwner] = useState(false)
  useEffect(() => {
    if (user._id === postOwner) {
      setOwner(true)
    }
  }, [postOwner])
  const editPostHandler = () => {
    handleEditPost()
  }
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Grow
        in={checked}
        style={{ transformOrigin: "0 0 0" }}
        {...(checked ? { timeout: 250 } : {})}
      >
        <Paper
          sx={{
            width: 140,
            maxWidth: "100%",
            position: "absolute",
            top: 50,
            right: 20,
          }}
        >
          <MenuList>
            {owner ? (
              <>
                <MenuItem onClick={editPostHandler}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </>
            ) : (
              <MenuItem>
                <ListItemIcon>
                  <ReportIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Report</ListItemText>
              </MenuItem>
            )}
          </MenuList>
        </Paper>
      </Grow>
    </ClickAwayListener>
  )
}

export default PostMenu
