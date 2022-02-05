import { Box, Typography } from "@mui/material";
import { useSocketContext } from "./SocketContext";

export default function Notifications() {
  const context = useSocketContext();
  if (!context) return null;
  const { call, callAccepted } = context;

  return (
    <Box>
      {call?.isReceivedCall && !callAccepted && (
        <Typography>Incoming call from {call.caller.name}</Typography>
      )}
    </Box>
  );
}
