import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../../redux";

interface Message {
  sender: string;
  message: string;
}
interface User {
  _id: string;
  name: string;
  email: string;
}

interface ChatBoxProps {
  recipientUser: User;
}

// Define the type for your Socket.IO client
let socket: Socket = io("http://localhost:8000");

const ChatBox: React.FC<ChatBoxProps> = ({ recipientUser }) => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<Message[]>([]);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const currentUser = auth.user?.id;
  const recipientUserId = recipientUser._id;
  const recipientUserName = recipientUser.name;

  const sendMessageToServer = () => {
    if (message.trim()) {
      socket.emit("message", {
        sender: auth.user?.id,
        recipient: recipientUserId,
        message,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    
    // Join the room for one-to-one chat
    socket.emit("joinRoom", { sender: currentUser, recipient: recipientUserId });

    // Listen for incoming changes
    socket.on("message", (message: Message) => {
      setReceivedMessage((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [currentUser, recipientUserId]);
  return (
    <Box className="chatBox">
      <List sx={{ height: 300, overflowY: "auto", mb: 2 }}>
        {receivedMessage.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={msg.message}
              secondary={msg.sender == currentUser ? "You" : recipientUserName}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        label="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        sx={{ mb: 2, mr: 2 }}
      />
      <Button variant="contained" color="primary" onClick={sendMessageToServer}>
        Send Message
      </Button>
    </Box>
  );
};

export default ChatBox;
