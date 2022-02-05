import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useSocketContext } from "./SocketContext";

export default function CallingScreen() {
  const context = useSocketContext();

  if (!context) {
    return null;
  }

  const { callStatus, call } = context;

  return (
    <Box
      aria-label="calling"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height:
          callStatus.type === "beforeCalling"
            ? "100%"
            : callStatus.type === "calling"
            ? "100%"
            : "0%",
        transition: "0.3s",
        backgroundColor: "#000",
      }}
    >
      {callStatus.type === "calling" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justfiyContent: "center",
              backgroundColor: "#009688",
              padding: "16px",
              borderRadius: "100%",
              border: "5px solid #fff",
              marginBottom: "16px",
            }}
          >
            <img src="/me.png" alt="person" width="128px" />
          </Box>
          <Typography variant="h5" color="#fff">
            Calling {callStatus.callee.name}...
          </Typography>
        </Box>
      ) : callStatus.type === "beforeCalling" ? (
        <CircularProgress />
      ) : null}
    </Box>
  );
}
