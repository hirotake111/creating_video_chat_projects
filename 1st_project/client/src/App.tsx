import { Typography, AppBar, Toolbar, Box } from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { createTheme } from "@mui/material/styles";
import { green, lightGreen } from "@mui/material/colors";
import { ThemeProvider } from "@mui/system";

import "./App.css";
import Notifications from "./components/Notifications";
import VideoPlayer from "./components/VideoPlayer";
import { useSocketContext } from "./components/SocketContext";
import SettingsPane from "./components/SettingsPane";
import MyVideoPlayer from "./components/MyVideoPlayer";
import Landing from "./components/Landing";
import VideoController from "./components/VideoController";
import UserList from "./components/Roster";

const theme = createTheme({
  palette: {
    primary: green,
    secondary: lightGreen,
  },
});

export default function App() {
  const context = useSocketContext();

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Landing />
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
            <Typography color="white">Hello {context?.name}</Typography>
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
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "360px" }}
            >
              <Box sx={{ flex: 1, transition: "1s" }}>
                <SettingsPane />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  borderTop: "1px solid #e0e0e0",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <UserList />
              </Box>
            </Box>
          </Box>
          <Box
            aria-label="controllers"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "128px",
            }}
          >
            <VideoController />
          </Box>
          <Box
            sx={{
              height: "128px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Notifications />
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
