import { Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { teal, lightGreen } from "@mui/material/colors";
import { ThemeProvider } from "@mui/system";

import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import MyVideoPlayer from "./components/MyVideoPlayer";
import SignIn from "./components/SignIn";
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
        <SignIn />
        <UserList />
        <CallingScreen />
        <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
          <CustomSpeedDial />
          <MyVideoPlayer />
          <VideoPlayer />
        </Box>
      </div>
    </ThemeProvider>
  );
}
