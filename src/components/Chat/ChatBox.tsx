import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../../redux";
import MessageService from "../../services/MessageService";

interface Message {
  senderId: string;
  content: string;
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

  const fetchAllMessages = async () => {
    if (auth.token) {
      const response: Message[] = await MessageService.fetchAllMessage(
        auth.token,
        recipientUserId
      );
      setReceivedMessage((prevMessages) => [
        ...prevMessages,
        ...response.map((msg: Message) => ({
          senderId: msg.senderId,
          content: msg.content,
        })),
      ]);
    }
  };

  useEffect(() => {
    fetchAllMessages();

    // Join the room for one-to-one chat
    socket.emit("joinRoom", {
      sender: currentUser,
      recipient: recipientUserId,
    });

    // Listen for incoming changes
    socket.on("message", (message: Message) => {
      setReceivedMessage((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [currentUser, recipientUserId]);
  return (
    <Box className="chatContainer">
      <List className="messageList">
        {receivedMessage.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={msg.content}
              secondary={
                msg.senderId == currentUser ? "You" : recipientUserName
              }
            />
          </ListItem>
        ))}
      </List>
      <Box className="inputContainer">
        <TextField
          label="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          sx={{ flex: 1 }}
        />
        <Button
          onClick={sendMessageToServer}
          sx={{ minWidth: "auto", padding: "12px", ml: 1 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
