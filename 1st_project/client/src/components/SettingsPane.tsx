import { Box, Switch, Typography } from "@mui/material";
import { useState } from "react";
import { useSocketContecxt } from "./SocketContext";

export default function SettingsPane() {
  const context = useSocketContecxt();
  if (!context) return null;
  const { switchMediaDevice, config, setConfig } = context;

  const handleChange = () => {
    switchMediaDevice(!context.config.myVideoOn);
    setConfig({ ...config, myVideoOn: !config.myVideoOn });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "16px" }}>
      <Typography variant="h5">Settings</Typography>
      <Switch checked={config.myVideoOn} onChange={handleChange} />
    </Box>
  );
}
