import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import CallIcon from "@mui/icons-material/Call";
import CancelIcon from "@mui/icons-material/Cancel";
import { pink } from "@mui/material/colors";

import { useSocketContext } from "./SocketContext";

export default function CallingScreen() {
  const context = useSocketContext();

  if (!context) {
    return null;
  }

  const { callStatus, answerCall, cancelCall } = context;
  const statusTypes = ["beforeCalling", "calling", "receivingCall"];

  return (
    <Box
      aria-label="calling"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: statusTypes.includes(callStatus.type) ? "100%" : "0%",
        transition: "0.3s",
        backgroundColor: "#000",
      }}
    >
      {callStatus.type === "calling" || callStatus.type === "receivingCall" ? (
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
          {callStatus.type === "calling" ? (
            <Typography variant="h5" color="#fff">
              Calling {callStatus.callee.name}...
            </Typography>
          ) : (
            <>
              <Typography variant="h5" color="#fff">
                Call from {callStatus.caller.name}
              </Typography>
              <Box sx={{ marginTop: "32px" }}>
                <Fab
                  aria-label="answer call"
                  color="primary"
                  sx={{ marginRight: "64px" }}
                >
                  <CallIcon onClick={() => answerCall(callStatus.caller)} />
                </Fab>
                <Fab
                  aria-label="cancel call"
                  sx={{ backgroundColor: pink[400] }}
                >
                  <CancelIcon
                    onClick={() => cancelCall(callStatus.caller.id)}
                  />
                </Fab>
              </Box>
            </>
          )}
          :
        </Box>
      ) : callStatus.type === "beforeCalling" ? (
        <CircularProgress />
      ) : null}
    </Box>
  );
}
