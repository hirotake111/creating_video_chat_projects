import { Grid, Box } from "@mui/material";
import Fab from "@mui/material/Fab";
import CancelIcon from "@mui/icons-material/Cancel";
import { pink } from "@mui/material/colors";

import { useSocketContext } from "./SocketContext";
import LeaveButton from "./LeaveButton";

export default function VideoPlayer() {
  const context = useSocketContext();
  if (!context) return null;

  const { peerVideo } = context;

  return (
    <>
      <LeaveButton />
      <Grid
        aria-label="peer video"
        sx={{ width: "100%", height: "100%", backgroundColor: "#000" }}
      >
        <video
          playsInline
          autoPlay
          ref={peerVideo}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>
    </>
  );
}
