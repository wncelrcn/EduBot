"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const systemPrompts = {
    "Coding Bot":
      "You are an expert in programming. Provide clear, concise, and accurate answers solely related to programming questions. Use examples to illustrate concepts as needed. Do not address topics outside of programming. Provide answers in text only.",
    "Grammar Helper":
      "You are an expert in grammar. Provide precise, clear, and accurate answers only for grammar and writing questions. Use examples to illustrate rules where applicable. Do not address topics outside of grammar. Provide answers in text only.",
    "Research Assistant":
      "You are an expert in research. Provide clear, concise, and accurate answers solely for research-related questions. Use examples to explain processes and concepts as needed. Do not address topics outside of research. Provide answers in text only.",
  };

  const [chatBot, setChatBot] = useState("Coding Bot");
  const [systemPrompt, setSystemPrompt] = useState(systemPrompts["Coding Bot"]);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello, I am your ${chatBot}, how can I help you today?`,
    },
  ]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hello, I am your ${chatBot}, how can I help you today?`,
      },
    ]);
  }, [chatBot]);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setMessage("");
    setIsLoading(true);
    setMessages((messages) => [
      ...messages,
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: message }],
        systemPrompt,
      }),
    }).then((res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          setIsLoading(false);
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBotClick = (button) => {
    setChatBot(button);
    setSystemPrompt(systemPrompts[button]);
    console.log(`${button} clicked`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="row"
        bgcolor="background.paper"
        color="text.primary"
      >
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          }}
        >
          <List>
            {Object.keys(systemPrompts).map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleBotClick(text)}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction="column"
            width="600px"
            height="700px"
            border="1px solid"
            borderColor="grey.300"
            borderRadius={2}
            p={2}
            spacing={3}
          >
            <Typography variant="h6" textAlign="center">
              {chatBot}
            </Typography>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              overflow="auto"
              maxHeight="100%"
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={
                      message.role === "assistant"
                        ? "primary.main"
                        : "secondary.main"
                    }
                    color="white"
                    borderRadius={10}
                    p={2}
                    maxWidth="80%"
                    sx={{ wordWrap: "break-word" }}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Enter your message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
