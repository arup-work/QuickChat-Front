import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../../redux";
import MessageService from "../../services/MessageService";
import {
  formatDateLabel,
  formatTimeLabel,
} from "../../helpers/utils/dateUtils";

interface Message {
  senderId: string;
  content: string;
  createdAt: string;
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

// Utility function to group messages by date
const groupMessagesByDate = (messages: Message[]) => {
  return messages.reduce((groups, msg) => {
    const date = new Date(msg.createdAt).toISOString().split("T")[0]; // format as 'YYYY-MM-DD'
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
    return groups;
  }, {} as Record<string, Message[]>);
};

const ChatBox: React.FC<ChatBoxProps> = ({ recipientUser }) => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<
    Record<string, Message[]>
  >({});
  const endOfMessageRef = useRef<HTMLDivElement>(null); // Create a ref for scrolling

  const auth = useSelector((state: RootState) => state.auth.auth);
  const currentUser = auth.user?.id;
  const recipientUserId = recipientUser._id;
  // const recipientUserName = recipientUser.name;
  const currentUserName = auth.user?.name;

  // Send message to the socket server
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

  // Handle when "Enter" button pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessageToServer();
    }
  };

  const fetchAllMessages = async () => {
    if (auth.token) {
      const response: Message[] = await MessageService.fetchAllMessage(
        auth.token,
        recipientUserId
      );

      // Map response to include date-based grouping
      const groupedMessages = groupMessagesByDate(
        response.map((msg: Message) => ({
          senderId: msg.senderId,
          content: msg.content,
          createdAt: msg.createdAt,
        }))
      );

      // Set the grouped messages as the state
      setReceivedMessage(groupedMessages);
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
      const date = new Date(message.createdAt).toISOString().split("T")[0];
      setReceivedMessage((prevMessages) => {
        //Copy the existing groups
        const newMessages = { ...prevMessages };

        // Check if the date group already exist, otherwise create it
        if (!newMessages[date]) {
          newMessages[date] = [];
        }

        // Append the new messages to the corrected date group
        newMessages[date].push(message);

        return newMessages;
      });
    });

    return () => {
      socket.off("message");
    };
  }, [currentUser, recipientUserId]);

  // Scroll to the bottom of the message list when messages change
  useEffect(() => {
    endOfMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessage]);
  return (
    <Box className="chatContainer">
      <Box className="chatBoxNavbar">
        <Avatar alt={currentUserName} src={""} sx={{ marginRight: 2, marginLeft:2 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold'}}>
            {currentUserName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray'}}>
              Available
          </Typography>
        </Box>
      </Box>
      <List className="messageList">
        {Object.keys(receivedMessage).map((date) => (
          <div key={date}>
            <Typography variant="h6" sx={{ marginTop: 2, textAlign: "center" }}>
              {formatDateLabel(date)}
            </Typography>
            {receivedMessage[date].map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    msg.senderId === currentUser ? "flex-end" : "flex-start",
                }}
              >
                <ListItemText
                  primary={
                    <span>
                      {msg.content}{" "}
                      <Typography variant="caption" className="messageTime">
                        {formatTimeLabel(msg.createdAt)}
                      </Typography>
                    </span>
                  }
                  className="messageText"
                  sx={{
                    textAlign: msg.senderId === currentUser ? "right" : "left",
                    backgroundColor:
                      msg.senderId === currentUser ? "#e1ffc7" : "#f0f0f0",
                  }}
                />
              </ListItem>
            ))}
          </div>
        ))}
        <div ref={endOfMessageRef} />
        {/* This div will be used for scrolling */}
      </List>
      <Box className="inputContainer">
        <TextField
          label="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{ flex: 1 }}
        />
        <Button
          onClick={sendMessageToServer}
          sx={{ minWidth: "auto", padding: "12px", ml: 1 }}
        >
          {message && <SendIcon />}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
