import { SpeedDial } from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

import { useSocketContext } from "./SocketContext";

export default function CustomSpeedDial() {
  const context = useSocketContext();

  return (
    <SpeedDial
      ariaLabel="options"
      sx={{ position: "absolute", bottom: 64, right: 64 }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction
        icon={
          context?.config.myVideoOn ? <VideocamIcon /> : <VideocamOffIcon />
        }
        tooltipTitle="video"
        onClick={() => {
          context?.setConfig({
            ...context.config,
            myVideoOn: !context.config.myVideoOn,
          });
          context?.switchVideo(!context.config.myVideoOn);
        }}
      />
    </SpeedDial>
  );
}
