import { Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { teal, lightGreen } from "@mui/material/colors";
import { ThemeProvider } from "@mui/system";

import "./App.css";
import Notifications from "./components/Notifications";
import VideoPlayer from "./components/VideoPlayer";
import MyVideoPlayer from "./components/MyVideoPlayer";
import Landing from "./components/Landing";
import UserList from "./components/UserList";
import CustomAppBar from "./components/CustomAppbar";
import CustomSpeedDial from "./components/CustomSpeedDial";
import CallingScreen from "./components/CallingScreen";

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: lightGreen,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <CustomAppBar />
        <Landing />
        <UserList />
        <CallingScreen />
        <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
          <CustomSpeedDial />
          <MyVideoPlayer />
          <VideoPlayer />
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
        <Notifications />
      </div>
    </ThemeProvider>
  );
}
