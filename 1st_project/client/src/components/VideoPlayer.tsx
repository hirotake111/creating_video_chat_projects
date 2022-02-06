import { Grid } from "@mui/material";
import { useSocketContext } from "./SocketContext";

export default function VideoPlayer() {
  const context = useSocketContext();

  return (
    <>
      <Grid
        aria-label="peer video"
        sx={{ width: "100%", height: "100%", backgroundColor: "blue" }}
      >
        {context && (
          <video
            playsInline
            muted
            autoPlay
            ref={context.peerVideo}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </Grid>
    </>
  );
}
