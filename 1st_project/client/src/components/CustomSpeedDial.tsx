import { SpeedDial } from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import { useSocketContext } from "./SocketContext";

export default function CustomSpeedDial() {
  const context = useSocketContext();
  if (!context) return null;
  const {
    config: { audio, video },
    switchVideo,
    switchAudio,
    stream,
    callStatus,
  } = context;

  return (
    <>
      {!["notSignedIn", "available", "receivingCall"].includes(
        callStatus.type
      ) && (
        <SpeedDial
          ariaLabel="options"
          sx={{ position: "absolute", bottom: 64, right: 64 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={video ? <VideocamIcon /> : <VideocamOffIcon />}
            tooltipTitle="video"
            onClick={() => {
              switchVideo(!video);
            }}
          />
          <SpeedDialAction
            icon={audio ? <MicIcon /> : <MicOffIcon />}
            tooltipTitle="audio"
            onClick={() => {
              console.log("clicked", !audio);
              switchAudio(!audio);
            }}
          />
        </SpeedDial>
      )}
    </>
  );
}
