import { Box, Grid, Typography } from "@mui/material";
import { useSocketContecxt } from "./SocketContext";

export default function VideoPlayer() {
  const context = useSocketContecxt();
  if (!context) return null;

  return (
    <>
      <Grid sx={{ height: "100%", backgroundColor: "gray" }}></Grid>
    </>
  );
}
