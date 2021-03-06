import { Box } from "@mui/material";
import List from "@mui/material/List";
import { ListItemButton, Typography } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { useSocketContext } from "./SocketContext";

export default function UserList() {
  const context = useSocketContext();
  if (!context) return null;
  const { roster, id, callUser, callStatus } = context;
  const userIds = Object.keys(roster || {});

  return (
    <>
      <Box
        aria-label="user list"
        sx={{
          display: "flex",
          justifyContent: "center",
          height: callStatus.type === "available" ? "100vh" : "0vh",
          transition: "0.3s",
        }}
      >
        {callStatus.type === "available" ? (
          <List sx={{ width: "50%", paddingTop: "128px" }}>
            <Box sx={{ padding: "8px" }}>
              <Typography variant="h6" sx={{ paddingBottom: "16px" }}>
                Available user list:
              </Typography>
              {userIds
                .filter((userId) => userId !== id)
                .map((userId, i) => (
                  <div key={i}>
                    <ListItemButton
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      onClick={() =>
                        callUser({ id: userId, name: roster[userId] })
                      }
                    >
                      <Typography variant="h6">{roster[userId]}</Typography>
                      <LocalPhoneIcon />
                    </ListItemButton>
                    <Divider />
                  </div>
                ))}
              {userIds.length <= 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </List>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
