import { Box, useMediaQuery } from "@mui/material";

import { useSocketContext } from "./SocketContext";

export default function MyVideoPlayer() {
  const context = useSocketContext();
  const mobile = useMediaQuery("(max-width:480px)");

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: mobile ? "24px" : "64px",
        left: mobile ? "24px" : "64px",
      }}
    >
      <Box
        sx={{
          border: "6px solid #fff",
          borderRadius: mobile ? "24px" : "10px",
          overflow: "hidden",
          backgroundColor: "#222",
          display: context?.config.video ? "block" : "none",
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
          style={{ objectFit: "cover" }}
        />
      </Box>
    </Box>
  );
}
