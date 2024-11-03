import { Avatar, Box, List, ListItem, ListItemText, Typography } from "@mui/material";
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
  const [currentChatBox, setCurrentChatBox] = useState<User>({
    _id: "",
    name: "",
    email: "",
  });

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
    <Box className="container">
      <Box className="userList">
        <List sx={{ padding: 0 }}>
          {users.map((user, index) => (
            <ListItem
              key={index}
              className={`chatList ${currentChatBox === user ? 'openChatBox' : ''}`}
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
      </Box>
      <Box className="chatBox">
        {!isChatBoxOpen && <>
          <Box className="emptyBox">
              <img src="src/assets/react.svg" alt=""  style={{ width: '80px', height: '80px', marginBottom: 8 }}/>
              <Typography variant="h4">QuickChat</Typography>
              <Typography variant="h6" sx={{ color: 'grey', marginTop: 1}}>Send & Receive message without any interrupt</Typography>
          </Box>
        </>}
        {isChatBoxOpen && <ChatBox recipientUser={currentChatBox} />}
      </Box>
    </Box>
  );
};

export default Index;
