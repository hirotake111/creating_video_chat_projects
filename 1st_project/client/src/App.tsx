import { useState } from "react";
import { Typography, AppBar, Toolbar, Switch, Box } from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { createTheme } from "@mui/material/styles";
import { green, lightGreen } from "@mui/material/colors";
import "./App.css";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";
import { ThemeProvider } from "@mui/system";
import { useSocketContecxt } from "./components/SocketContext";
import SettingsPane from "./components/SettingsPane";
import MyVideoPlayer from "./components/MyVideoPlayer";

const theme = createTheme({
  palette: {
    primary: green,
    secondary: lightGreen,
  },
});

export default function App() {
  const [videoOn, setVideoOn] = useState(false);
  const context = useSocketContecxt();

  if (!context) return null;
  const { switchMediaDevice, name } = context;

  const handleChange = () => {
    switchMediaDevice(!videoOn);
    setVideoOn(!videoOn);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <VideoLibraryIcon sx={{ mr: 2, color: "#fff" }} />
              <Typography
                variant="h4"
                color="white"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Video Chat App
              </Typography>
            </div>
            <Typography color="white">Hello {name}</Typography>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 64px )",
          }}
        >
          <Box sx={{ display: "flex", height: "100%" }}>
            <Box sx={{ width: "100%" }}>
              <MyVideoPlayer />
              <VideoPlayer />
            </Box>
            <Box sx={{ width: "360px" }}>
              <SettingsPane />
            </Box>
          </Box>
          <Box
            aria-label="controllers"
            sx={{ height: "128px", backgroundColor: "yellow" }}
          >
            controllers
          </Box>
          <Box sx={{ height: "128px", color: "#fff", backgroundColor: "blue" }}>
            <Options>
              <Notifications />
            </Options>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
