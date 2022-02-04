import { Grid } from "@mui/material";
import { useSocketContext } from "./SocketContext";

export default function VideoPlayer() {
  const context = useSocketContext();

  return (
    <>
      <Grid sx={{ height: "100%", backgroundColor: "gray" }}>
        {context && (
          <video
            aria-label="my video"
            playsInline
            muted
            autoPlay
            ref={context.peerVideo}
            style={{ objectFit: "cover" }}
          />
        )}
      </Grid>
    </>
  );
}
