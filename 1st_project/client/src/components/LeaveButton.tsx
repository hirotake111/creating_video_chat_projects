import { Box } from "@mui/material";
import Fab from "@mui/material/Fab";
import CancelIcon from "@mui/icons-material/Cancel";
import { pink } from "@mui/material/colors";

import { useSocketContext } from "./SocketContext";

export default function LeaveButton() {
  const context = useSocketContext();
  if (!context) return null;

  const { id, stream, callStatus, leaveCall, disableMedia } = context;
  if (callStatus.type !== "onCall" || !stream) return null;
  const peerId =
    callStatus.caller.id === id ? callStatus.callee.id : callStatus.caller.id;

  const handleClick = () => {
    console.log("leave now!");
    disableMedia(stream);
    leaveCall(peerId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        justifyContent: "center",
        width: "100%",
        bottom: "64px",
        zIndex: 100,
      }}
    >
      {callStatus.type === "onCall" && stream && (
        <Fab
          aria-label="cancel call"
          sx={{ backgroundColor: pink[400] }}
          onClick={handleClick}
        >
          <CancelIcon onClick={handleClick} />
        </Fab>
      )}
    </Box>
  );
}
