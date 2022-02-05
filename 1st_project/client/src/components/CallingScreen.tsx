import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useSocketContext } from "./SocketContext";

export default function CallingScreen() {
  const context = useSocketContext();

  if (!context) {
    return null;
  }

  const { callStatus, name } = context;

  return (
    <Box
      aria-label="calling"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height:
          callStatus === "beforeCalling"
            ? "100%"
            : callStatus === "calling"
            ? "100%"
            : "0%",
        transition: "0.3s",
      }}
    >
      {callStatus === "calling" ? (
        <Box>Calling {name}</Box>
      ) : callStatus === "beforeCalling" ? (
        <CircularProgress />
      ) : null}
    </Box>
  );
}
