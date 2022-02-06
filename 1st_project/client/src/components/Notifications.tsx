import { Box, Typography } from "@mui/material";
import { useSocketContext } from "./SocketContext";

export default function Notifications() {
  const context = useSocketContext();
  if (!context) return null;
  const { call } = context;

  return (
    <Box>
      {call?.isReceivedCall && (
        <Typography>Incoming call from {call.caller.name}</Typography>
      )}
    </Box>
  );
}
