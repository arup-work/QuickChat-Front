import { Avatar, Box, List, ListItem, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import UserService from "../../services/UserService";
import "../../assets/styles/Chat.css";
import ChatBox from "./ChatBox";

interface User {
  _id: string;
  name: string;
  email: string;
}

const Index: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isChatBoxOpen, setChatBoxOpen] = useState<boolean>(false);
  const [currentChatBox, setCurrentChatBox] = useState<User>({ _id: '', name: '', email: ''});

  const auth = useSelector((state: RootState) => state.auth.auth);

  const fetchAllUsers = async () => {
    if (auth.token) {
      const response = await UserService.fetchAllUsers(auth.token);
      const users = response.filter((user: User) => user._id !== auth.user?.id);
      setUsers(users);
    }
  };

  const handleOpenChatBox = (user: User) => {
    setChatBoxOpen(true);
    setCurrentChatBox(user);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Box className="chatBox">
      {!isChatBoxOpen && (
        <List sx={{ padding: 0 }}>
          {users.map((user, index) => (
            <ListItem
              key={index}
              className="chatList"
              onClick={() => handleOpenChatBox(user)}
            >
              <Avatar alt={user.name} src={""} sx={{ marginRight: 2 }} />
              <ListItemText
                primary={user.name}
                secondary={"Available"}
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
            </ListItem>
          ))}
        </List>
      )}
      {isChatBoxOpen && <ChatBox recipientUser={currentChatBox} />}
    </Box>
  );
};

export default Index;
