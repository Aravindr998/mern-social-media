import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Fab, Typography } from "@mui/material"
import CallEndIcon from "@mui/icons-material/CallEnd"
import MicIcon from "@mui/icons-material/Mic"
import VideocamIcon from "@mui/icons-material/Videocam"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"
import MicOffIcon from "@mui/icons-material/MicOff"
import { socket } from "../socket"
import { useParams } from "react-router-dom"
import axios from "../axios"
import { useSelector } from "react-redux"
import peer from "../services/peer"

const VideoCallPage = () => {
  const [userJoined, setUserJoined] = useState(false)
  const [myStream, setMyStream] = useState()
  const { callId } = useParams()
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const offer = useSelector((state) => state.offer)
  const videoRef = useRef()

  console.log(offer)

  useEffect(() => {
    ;(async () => {
      try {
        if (user) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          })
          const offer = await peer.getOffer()
          socket.emit("setOffer", { callId, offer, user })
          setMyStream(stream)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [user])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/call/video/${callId}`, {
          headers: { Authorization: auth },
        })
        if (user?._id === data?.to) {
          setUserJoined(true)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [callId, user])

  const handleIncomingCall = ({ from, offer }) => {
    console.log("recieved")
    console.log(from, offer)
  }

  const handleCallAccepted = ({ from, ans }) => {
    peer.setLocalDescription(ans)
    console.log("call accepted")
  }

  useEffect(() => {
    socket.on("userJoined", (socket) => {
      console.log("userJoined")
      setUserJoined(true)
    })
    socket.on("callConnected", handleCallAccepted)
    return () => {
      socket.off("userJoined")
      socket.off("callConnected")
    }
  }, [])

  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream
    }
  }, [myStream])

  useEffect(() => {
    ;(async () => {
      console.log("in use effect before if")
      if (offer && callId) {
        console.log("in use effect")
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })
        setMyStream(stream)
        const ans = await peer.getAnswer(offer)
        console.log(callId)
        socket.emit("callConnected", { ans, callId })
      }
    })()
  }, [offer, callId])

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {userJoined ? (
        <Box
          component={"video"}
          width={"95%"}
          height={"90%"}
          bgcolor={"red"}
          sx={{
            borderRadius: "1rem",
          }}
        ></Box>
      ) : (
        <Box
          width={"95%"}
          height={"90%"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography color={"white"} fontWeight={500} fontSize={"1.5rem"}>
            Calling
          </Typography>
          <Button variant="contained" color="error" sx={{ margin: "1rem" }}>
            Cancel
          </Button>
        </Box>
      )}
      <Box
        component={"video"}
        width={"15rem"}
        height={"10rem"}
        sx={{
          borderRadius: "1rem",
          position: "absolute",
          bottom: 45,
          right: 45,
        }}
        autoPlay
        ref={videoRef}
      ></Box>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            backgroundColor: "rgba(89, 89, 89, 0.5)",
            minWidth: "30%",
            padding: "1rem",
            borderRadius: "5rem",
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translate(-50%, 0)",
          }}
        >
          <Fab sx={{ marginRight: "2.5rem" }}>
            <MicOffIcon />
          </Fab>
          <Fab sx={{ marginRight: "2.5rem" }}>
            <VideocamOffIcon />
          </Fab>
          <Fab color="error">
            <CallEndIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  )
}

export default VideoCallPage
