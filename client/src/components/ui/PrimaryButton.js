import { purple } from "@mui/material/colors"
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'


const PrimaryButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[900]),
  backgroundColor: purple[900],
  '&:hover': {
    backgroundColor: '#31005A',
  },
}))

export default PrimaryButton