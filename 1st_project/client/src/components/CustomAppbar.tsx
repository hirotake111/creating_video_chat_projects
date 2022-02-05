import { AppBar, Toolbar, Typography } from "@mui/material";
import { useSocketContext } from "./SocketContext";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

export default function CustomAppBar() {
  const context = useSocketContext();

  return (
    <AppBar position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <VideoLibraryIcon sx={{ mr: 2, color: "#fff" }} />
          <Typography
            variant="h5"
            color="white"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Video Chat App
          </Typography>
        </div>
        <Typography color="white">
          {context?.name ? `Hello ${context.name}` : ""}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
