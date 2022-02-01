import { Typography, AppBar } from "@mui/material";
import "./App.modules.css";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";

export default function App() {
  return (
    <div className="app">
      <AppBar position="static" color="transparent">
        <Typography variant="h3" align="center">
          Video Chat
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
}
