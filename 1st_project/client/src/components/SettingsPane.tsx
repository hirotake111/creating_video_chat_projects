import { Box, Switch, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useSocketContecxt } from "./SocketContext";

export default function SettingsPane() {
  const context = useSocketContecxt();
  if (!context) return null;
  const { switchMediaDevice, config, setConfig } = context;

  const handleVideo = () => {
    switchMediaDevice(!context.config.myVideoOn);
    setConfig({ ...config, myVideoOn: !config.myVideoOn });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "16px" }}>
      <Typography variant="h5">Settings</Typography>
      <Setting>
        <Typography>Video</Typography>
        <Switch checked={config.myVideoOn} onChange={handleVideo} />
      </Setting>
    </Box>
  );
}

const Setting = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>{children}</Box>
);
