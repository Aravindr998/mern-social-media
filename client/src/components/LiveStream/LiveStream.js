import React, { useEffect, useState } from "react"
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "../../axios"

const LiveStream = () => {
  const { roomId } = useParams()
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const [live, setLive] = useState(null)
  useEffect(() => {
    ;(async () => {
      if (roomId) {
        const { data } = await axios.get(`/api/call/live/${roomId}`, {
          headers: { Authorization: auth },
        })
        setLive(data)
      }
    })()
  }, [roomId, auth])
  let role
  const appID = 1724834124
  const serverSecret = process.env.REACT_APP_ZEGOCLOUD_LIVE_SERVERSECRET
  let kitToken
  let myMeeting
  if (live && user) {
    if (live.from.toString() === user._id.toString()) {
      role = ZegoUIKitPrebuilt.Host
    } else {
      role = ZegoUIKitPrebuilt.Audience
    }
    kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user._id,
      user.username
    )
    myMeeting = async (element) => {
      console.log(kitToken)
      const zp = ZegoUIKitPrebuilt.create(kitToken)
      console.log(zp)
      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role,
          },
        },
        showPreJoinView: false,
      })
    }
  }

  return (
    <div>
      {user && live && (
        <div
          className="myCallContainer"
          ref={myMeeting}
          style={{ width: "100vw", height: "100vh" }}
        ></div>
      )}
    </div>
  )
}

export default LiveStream
