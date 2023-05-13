import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import { useSelector } from "react-redux"
import { socket } from "../../socket"

const VideoCall = () => {
  const user = useSelector((state) => state.user)
  const { roomId } = useParams()

  useEffect(() => {
    socket.on("callRejected", () => {
      window.close()
    })
    return () => {
      socket.off("callRejected")
    }
  }, [])

  console.log(process.env.REACT_APP_ZEGOCLOUD_APPID)

  const myMeeting = async (element) => {
    const appID = 1341955450
    const serverSecret = process.env.REACT_APP_ZEGOCLOUD_SERVERSECRET
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user._id,
      user.username
    )
    const zc = ZegoUIKitPrebuilt.create(kitToken)
    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
    })
  }

  return (
    <div>
      {user && (
        <div
          ref={myMeeting}
          className="myCallContainer"
          style={{ width: "100vw", height: "100vh" }}
        ></div>
      )}
    </div>
  )
}

export default VideoCall
