import { Box, useMediaQuery } from "@mui/material";

import { useSocketContext } from "./SocketContext";

export default function MyVideoPlayer() {
  const context = useSocketContext();
  const mobile = useMediaQuery("(max-width:480px)");

  return (
    <Box
      sx={{
        position: "absolute",
        top: mobile ? "64px" : "96px",
        right: mobile ? "24px" : "32px",
      }}
    >
      <Box
        sx={{
          border: "6px solid #fff",
          borderRadius: mobile ? "24px" : "16px",
          overflow: "hidden",
          backgroundColor: "#222",
          display: context?.config.video ? "block" : "none",
          WebkitBackfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <video
          aria-label="my video"
          playsInline
          muted
          autoPlay
          ref={context?.myVideo}
          width={mobile ? "100px" : "240px"}
          height={mobile ? "180px" : "120px"}
          style={{
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
          }}
        />
      </Box>
    </Box>
  );
}
