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
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { RootState } from "../../redux";
import UserService from "../../services/UserService";
import "../../assets/styles/Chat.css";
import ChatBox from "./ChatBox";
import { getSocket } from "../../helpers/utils/socket";
import { formatLastSeen } from "../../helpers/utils/lastseenFormat";
import MessageService from "../../services/MessageService";
import Profile from "./Profile";

interface LastMessage {
  conversationId: string;
  lastMessage: string;
  createdAt: string; // ISO string for date
  users: string[]; // Array of user IDs (sender and recipient)
}

interface MessagesMap {
  [conversationId: string]: {
    lastMessage: string;
    createdAt: string;
    users: string[];
  };
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
  const [lastMessages, setLastMessages] = useState<MessagesMap>({});
  const [activeMenu, setActiveMenu] = useState("chat");
  const [activeSubMenu, setActiveSubMenu] = useState("");

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

  // Handle latest message
  const handleSendMessage = (message: string, recipientId: string) => {
    // Send the message to the server
    const socket = getSocket(currentUser);
    if (socket) {
      socket.emit("message", {
        sender: currentUser,
        recipient: recipientId,
        message,
        createdAt: new Date().toISOString(),
      });
    }

    // Update the local state for lastMessages
    updateLastMessage(recipientId, message);
  };

  const updateLastMessage = (recipientId: string, message: string) => {
    if (currentUser) {
      const conversationId =
        Object.keys(lastMessages).find(
          (key) =>
            lastMessages[key].users.includes(recipientId) &&
            lastMessages[key].users.includes(currentUser)
        ) || "";

      const newMessageData = {
        lastMessage: message,
        createdAt: new Date().toISOString(),
        users: [currentUser, recipientId],
      };

      setLastMessages((prevLastMessages) => ({
        ...prevLastMessages,
        [conversationId || `new-${recipientId}`]: conversationId
          ? { ...prevLastMessages[conversationId], ...newMessageData }
          : newMessageData,
      }));
    }
  };

  const fetchAllMessagesForUsers = async () => {
    if (auth.token) {
      const response: LastMessage[] =
        await MessageService.fetchAllUsersLatMessages(auth.token);

      // Transform array into an object for quick lookup
      const messagesMap = response.reduce(
        (
          acc: MessagesMap,
          { conversationId, lastMessage, createdAt, users }: LastMessage
        ) => ({
          ...acc,
          [conversationId]: { lastMessage, createdAt, users },
        }),
        {} as MessagesMap // Initial empty object
      );

      setLastMessages(messagesMap);
    }
  };

  const handleOpenChatBox = (
    user: User & { status: string; lastSeen?: string | null }
  ) => {
    setChatBoxOpen(true);
    setCurrentChatBox(user);
  };

  const handleIconClick = (menu: string) => {
    setActiveMenu(menu);
    setActiveSubMenu("");
  };

  const handleSubMenuClick = (menu: string) => {
    setActiveSubMenu(menu);
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
  const usersWithStatuses = users.map((user) => {
    const conversation = Object.values(lastMessages).find(
      ({ users }) =>
        users.includes(user._id) && users.includes(auth.user?.id as string)
    );

    return {
      ...user,
      status: userStatuses[user._id]?.status || "unknown",
      lastSeen: userStatuses[user._id]?.lastSeen || null,
      lastMessage: conversation?.lastMessage || null,
      messageTime: conversation?.createdAt || null,
    };
  });

  return (
    <Box className="container">
      <Box className="sidebar">
        <Box className="sidebar__menu">
          <Box
            className={`sidebar__menu-item ${
              activeMenu === "chat" ? "sidebar__menu-item--active" : ""
            }`}
            onClick={() => handleIconClick("chat")}
          >
            <ChatIcon />
          </Box>
        </Box>
        <Box className="sidebar__menu-bottom">
          <Box
            className={`sidebar__menu-item ${
              activeMenu === "settings" ? "sidebar__menu-item--active" : ""
            }`}
            onClick={() => handleIconClick("settings")}
          >
            <SettingsIcon />
          </Box>
        </Box>
      </Box>

      {activeMenu === "chat" && (
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
                    user.lastMessage
                      ? `${user.lastMessage}`
                      : user.status === "online"
                      ? "Online"
                      : user.lastSeen
                      ? `Last seen ${formatLastSeen(
                          new Date(user.lastSeen),
                          false
                        )}`
                      : "Offline"
                  }
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {activeMenu === "settings" && !activeSubMenu && (
        <Box className="sidebar__settings">
          <Typography variant="h6" className="sidebar__settings-title">
            Settings
          </Typography>

          <Box
            className="sidebar__settings-item"
            onClick={() => handleSubMenuClick("profile")}
          >
            <AccountCircleIcon className="sidebar__settings-icon" />
            <Box className="sidebar__settings-item-text-container">
              <Typography className="sidebar__settings-item-text">
                Profile
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {activeSubMenu === "profile" && (
        <Profile handleMenuClick={handleIconClick} />
      )}

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
            onSendMessage={(message) =>
              handleSendMessage(message, currentChatBox._id)
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default Index;
