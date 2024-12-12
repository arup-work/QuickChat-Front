import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import UserService from "../../services/UserService";
import "../../assets/styles/Chat.css";
import ChatBox from "./ChatBox";
import { io, Socket } from "socket.io-client";
import { getSocket } from "../../helpers/utils/socket";
import { formatLastSeen } from "../../helpers/utils/lastseenFormat";
import MessageService from "../../services/MessageService";

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

interface UserStatus {
  userId: string;
  status: string; // "online" or "offline"
  lastSeen: string | null; // Null for online users
}

const Index: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isChatBoxOpen, setChatBoxOpen] = useState<boolean>(false);
  const [currentChatBox, setCurrentChatBox] = useState<User>({
    _id: "",
    name: "",
    email: "",
  });

  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>(
    {}
  );
  const [receivedMessage, setReceivedMessage] = useState<
    Record<string, Message[]>
  >({});

  const auth = useSelector((state: RootState) => state.auth.auth);
  const currentUser = auth.user?.id;

  // Define the type for your Socket.IO client
  // let socket: Socket = io("http://localhost:8000", {
  //   query: {
  //     userId: currentUser,
  //   },
  // });

  const fetchAllUsers = async () => {
    if (auth.token) {
      const response = await UserService.fetchAllUsers(auth.token);
      const users = response.filter((user: User) => user._id !== auth.user?.id);
      setUsers(users);

      // Map initial last seen status
      const initialStatuses = users.reduce(
        (
          acc: { [x: string]: { status: string; lastSeen: any } },
          user: { _id: string | number; lastSeen: any }
        ) => {
          acc[user._id] = { status: "offline", lastSeen: user.lastSeen }; // Assuming `lastSeen` is returned by your API
          return acc;
        },
        {} as Record<string, { status: string; lastSeen?: string }>
      );

      setUserStatuses(initialStatuses);
    }
  };

  const fetchAllMessagesForUsers = async () => {
    if (auth.token) {
      const response: Message[] = await MessageService.fetchAllUsersLatMessages(
        auth.token
      );
      console.log(response);
      

      // Extract the latest message for each user
      // const lastMessages = response.reduce<Record<string, Message | null>>(
      //   (acc, msg) => {
      //     if (
      //       !acc[msg.senderId] ||
      //       new Date(acc[msg.senderId]!.createdAt) < new Date(msg.createdAt)
      //     ) {
      //       acc[msg.senderId] = msg;
      //     }
      //     return acc;
      //   },
      //   {}
      // );

      // setReceivedMessage(lastMessages);
    }
  };

  const handleOpenChatBox = (
    user: User & { status: string; lastSeen?: string | null }
  ) => {
    setChatBoxOpen(true);
    setCurrentChatBox(user);
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllMessagesForUsers();
  }, []);

  useEffect(() => {
    const socket = getSocket(currentUser);

    if (socket) {
      // Listen for user statuses update
      const handleUserStatusesUpdate = (statuses: UserStatus[]) => {
        const updatedStatuses = statuses.reduce((acc, userStatus) => {
          acc[userStatus.userId] = userStatus;
          return acc;
        }, {} as Record<string, UserStatus>);
        setUserStatuses(updatedStatuses);
      };

      socket.on("userStatusesUpdate", handleUserStatusesUpdate);

      return () => {
        socket.off("userStatusesUpdate", handleUserStatusesUpdate);
      };
    }
  }, []);

  // Combine user data with their status
  const usersWithStatuses = users.map((user) => ({
    ...user,
    status: userStatuses[user._id]?.status || "unknown",
    lastSeen: userStatuses[user._id]?.lastSeen || null,
  }));

  return (
    <Box className="container">
      <Box className="userList">
        <List sx={{ padding: 0 }}>
          {usersWithStatuses.map((user, index) => (
            <ListItem
              key={index}
              className={`chatList ${
                currentChatBox._id === user._id ? "openChatBox" : ""
              }`}
              onClick={() => handleOpenChatBox(user)}
            >
              <Avatar alt={user.name} src={""} sx={{ marginRight: 2 }} />
              <ListItemText
                primary={user.name}
                secondary={
                  user.status === "online"
                    ? "Online"
                    : user.lastSeen
                    ? `Last seen ${formatLastSeen(new Date(user.lastSeen))}`
                    : "Offline"
                }
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box className="chatBox">
        {!isChatBoxOpen && (
          <>
            <Box className="emptyBox">
              <img
                src="src/assets/chat.jpg"
                alt=""
                style={{ width: "80px", height: "80px", marginBottom: 8 }}
              />
              <Typography variant="h4">QuickChat</Typography>
              <Typography variant="h6" sx={{ color: "grey", marginTop: 1 }}>
                Send & Receive message without any interrupt
              </Typography>
            </Box>
          </>
        )}
        {isChatBoxOpen && (
          <ChatBox
            recipientUser={currentChatBox}
            userStatus={
              userStatuses[currentChatBox._id] || {
                status: "unknown",
                lastSeen: null,
              }
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default Index;
