// import { List } from "@mui/icons-material";
import List from "@mui/material/List";
import { ListItemButton, Typography } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Divider from "@mui/material/Divider";
import { useSocketContext } from "./SocketContext";
import { Box } from "@mui/material";

export default function UserList() {
  const context = useSocketContext();
  if (!context || context.calling) return null;
  const { roster, id, name, calling, callUser } = context;
  const userIds = Object.keys(roster || {});

  return (
    <>
      {calling ? null : (
        <List sx={{ height: "100%", padding: 0 }}>
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
              <Typography>Available user list:</Typography>
              {userIds
                .filter((userId) => userId !== id)
                .map((userId, i) => (
                  <div key={i}>
                    <ListItemButton
                      sx={{ display: "flex", justifyContent: "space-between" }}
                      onClick={() =>
                        callUser({ id: userId, name: roster[userId] })
                      }
                    >
                      <Typography>{roster[userId]}</Typography>
                      <LocalPhoneIcon />
                    </ListItemButton>
                    <Divider />
                  </div>
                ))}
            </Box>
          )}
        </List>
      )}
    </>
  );
}
