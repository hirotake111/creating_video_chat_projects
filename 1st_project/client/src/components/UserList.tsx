import { Box, Button } from "@mui/material";
import List from "@mui/material/List";
import { ListItemButton, Typography } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Divider from "@mui/material/Divider";
import { useSocketContext } from "./SocketContext";
import { useState } from "react";

export default function UserList() {
  const context = useSocketContext();
  if (!context) return null;
  const { roster, id, name, callUser, callAccepted, callStatus } = context;
  const userIds = Object.keys(roster || {});
  return (
    <>
      <Box
        aria-label="user list"
        sx={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
          height: callStatus === "available" ? "100vh" : "0vh",
          // height: `${h}vh`,
          transition: "0.3s",
        }}
      >
        {callStatus === "available" ? (
          <List sx={{ width: "50%", padding: "64px" }}>
            {userIds.length < 2 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Waiting for other users to join
              </Box>
            ) : (
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
              </Box>
            )}
          </List>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
