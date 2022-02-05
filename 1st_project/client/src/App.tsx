import { Box, SpeedDial } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { green, lightGreen } from "@mui/material/colors";
import { ThemeProvider } from "@mui/system";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

import "./App.css";
import Notifications from "./components/Notifications";
import VideoPlayer from "./components/VideoPlayer";
import { useSocketContext } from "./components/SocketContext";
import SettingsPane from "./components/SettingsPane";
import MyVideoPlayer from "./components/MyVideoPlayer";
import Landing from "./components/Landing";
import VideoController from "./components/VideoController";
import UserList from "./components/UserList";
import CustomAppBar from "./components/CustomAppbar";

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
        <CustomAppBar />
        <Landing />
        <UserList />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 64px )",
          }}
        >
          <Box sx={{ display: "flex", height: "100%" }}>
            <Box sx={{ width: "100%" }}>
              <SpeedDial
                ariaLabel="options"
                sx={{ position: "absolute", bottom: 64, right: 64 }}
                icon={<SpeedDialIcon />}
              >
                <SpeedDialAction
                  icon={
                    context?.config.myVideoOn ? (
                      <VideocamIcon />
                    ) : (
                      <VideocamOffIcon />
                    )
                  }
                  tooltipTitle="video"
                  onClick={() => {
                    context?.setConfig({
                      ...context.config,
                      myVideoOn: !context.config.myVideoOn,
                    });
                    context?.switchMediaDevice(!context.config.myVideoOn);
                  }}
                />
              </SpeedDial>
              <MyVideoPlayer />
              <VideoPlayer />
            </Box>
            {/* <Box
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
            </Box> */}
          </Box>
          {/* <Box
            aria-label="controllers"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "128px",
            }}
          >
            <VideoController />
          </Box> */}
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
