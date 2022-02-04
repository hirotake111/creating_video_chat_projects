import { Box } from "@mui/material";
import { useSocketContext } from "./SocketContext";

export default function MyVideoPlayer() {
  const context = useSocketContext();

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "64px",
        right: "64px",
      }}
    >
      {context?.config.myVideoOn && (
        <Box
          sx={{
            border: "6px solid #fff",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "#222",
          }}
        >
          <video
            aria-label="my video"
            playsInline
            muted
            autoPlay
            ref={context.myVideo}
            width="240px"
            height="120px"
            style={{ objectFit: "cover" }}
          />
        </Box>
      )}
    </Box>
  );
}
