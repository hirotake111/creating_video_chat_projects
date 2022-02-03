import { Grid } from "@mui/material";
import { useSocketContecxt } from "./SocketContext";

export default function VideoPlayer() {
  const context = useSocketContecxt();

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
