import { Box, Switch, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useSocketContext } from "./SocketContext";

export default function SettingsPane() {
  const context = useSocketContext();
  if (!context) return null;
  const { config, switchVideo } = context;

  const handleVideo = () => {
    switchVideo(!context.config.video);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "16px" }}>
      <Typography variant="h5">Settings</Typography>
      <Setting>
        <Typography>Video</Typography>
        <Switch checked={config.video} onChange={handleVideo} />
      </Setting>
    </Box>
  );
}

const Setting = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>{children}</Box>
);
