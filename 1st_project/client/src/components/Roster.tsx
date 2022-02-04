// import { List } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ListItemButton, Typography } from "@mui/material";
import { Button } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Divider from "@mui/material/Divider";
import { useSocketContext } from "./SocketContext";
import { Box } from "@mui/material";

export default function UserList() {
  const context = useSocketContext();
  if (!context) return null;
  const { roster, name } = context;

  const users = Object.keys(roster || {}).map((key) => roster[key]);

  return (
    <List sx={{ height: "100%", padding: 0 }}>
      {users.length < 2 ? (
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
          {users
            .filter((user) => user !== name)
            .map((user, index) => (
              <>
                <ListItemButton
                  key={index}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  onClick={() => console.log("clicked")}
                >
                  <Typography>{user}</Typography>
                  <LocalPhoneIcon />
                </ListItemButton>
                <Divider />
              </>
            ))}
        </Box>
      )}
    </List>
  );
}
