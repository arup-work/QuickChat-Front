import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for your Socket.IO client
let socket: Socket;

const Index: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");

  const sendMessageToServer = () => {
    if (message.trim()) {
        socket.emit('messageFromClient', message);
        setMessage('');
    }
  }
  useEffect(() => {
    // Connect to the socket.io server
    socket = io("http://localhost:8000");

    // Listen from the message from the server
    socket.on("message", (data: string) => {
      setReceivedMessage(data);
    });

    // Clean up the component unmount
    return () => {
      socket.off("message");
    };
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
      }}
    >

      <TextField
        label="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2, width: "300px" }}
      />
      <Button variant="contained" color="primary" onClick={sendMessageToServer}>
        Send Message
      </Button>

      <Typography variant="h6" sx={{ mt:4 }}>
      Received Message:
      </Typography>
      <Typography variant="body1" >{receivedMessage}</Typography>
    </Box>
  );
};

export default Index;
