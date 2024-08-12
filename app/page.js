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
import { BsRobot } from "react-icons/bs";
import { FaPaperPlane } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function Home() {
  const systemPrompts = {
    "Coding Bot":
      "You are an expert in programming. Provide clear, concise, and accurate answers solely related to programming questions. Use examples to illustrate concepts as needed. Do not address topics outside of programming. Provide answers in text only.",
    "Grammar Helper":
      "You are an expert in grammar. Provide precise, clear, and accurate answers only for grammar and writing questions. Use examples to illustrate rules where applicable. Do not address topics outside of grammar. Provide answers in text only.",
    "Research Assistant":
      "You are an expert in research. Provide clear, concise, and accurate answers solely for research-related questions. Use examples to explain processes and concepts as needed. Do not address topics outside of research. Provide answers in text only.",
    "Plagiarism Checker":
      "You are an expert in plagiarism. Provide clear, concise, and accurate answers solely for plagiarism-related questions. Analyze the given text to determine if it contains any plagiarized content by comparing it to existing sources. Provide a report indicating whether the text is original, partially plagiarized, or fully plagiarized. Include specific references to any matched sources. f any part of the text is found to be plagiarized, paraphrase those sections to make the text original while maintaining the original meaning. Provide a report indicating whether the text was plagiarized and include both the original and paraphrased versions of any problematic sections. Use examples to explain concepts as needed. Do not address topics outside of plagiarism. Provide answers in text only.",
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
  const [user] = useAuthState(auth);
  const router = useRouter();
  //const userSession = sessionStorage.getItem("user");

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
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      //sessionStorage.removeItem("user");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const getProfile = (text) => {
    return (
      <img
        src={`images/${text}.png`}
        alt="EduBot Logo"
        style={{ width: "70px", height: "auto", margin: "20px" }}
      />
    );
  };

  const getIcon = (text) => {
    switch (text) {
      case "Coding Bot":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#8C1AF6"
          >
            <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
          </svg>
        );
      case "Grammar Helper":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#8C1AF6"
          >
            <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
          </svg>
        );
      case "Research Assistant":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#8C1AF6"
          >
            <path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
          </svg>
        );
      case "Plagiarism Checker":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8C1AF6"><path d="M458-280q18 0 35.5-4.5T526-298l98 98 56-56-98-98q9-15 13.5-32.5T600-422q0-58-41-98t-99-40q-58 0-99 41t-41 99q0 58 40 99t98 41Zm2-80q-25 0-42.5-17.5T400-420q0-25 17.5-42.5T460-480q25 0 42.5 17.5T520-420q0 25-17.5 42.5T460-360ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg> )
      default:
        return null;
    }
  };

  console.log("user:", user);
  //console.log("userSession:", userSession);

  if (!user) {
    router.push("/login");
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="row"
        bgcolor="background.default"
        color="text.primary"
      >
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
              bgcolor: "background.paper",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              mb: 2,
            }}
          >
            <Box ml={1}></Box>

            <Typography variant="h6">EduBot</Typography>
          </Box>

          <List>
            {Object.keys(systemPrompts).map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleBotClick(text)}>
                  {getIcon(text)}
                  <ListItemText sx={{ mx: 2 }} primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Current User and Log Out Section */}
          {user && (
            <Box
              sx={{
                mt: "auto",
                p: 2,
              }}
            >
              {/* User Info Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2, // Adds some space between the user info and the logout button
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5a189a"
                >
                  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>
                <Typography variant="body1" sx={{ ml: 1, fontSize: "12px" }}>
                  {user.email}
                </Typography>
              </Box>

              {/* Logout Button */}
              <Button
                variant="text"
                fullWidth
                color="inherit"
                onClick={handleLogout}
                startIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5a189a"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                  </svg>
                }
                sx={{
                  justifyContent: "flex-start",
                  color: "text.primary",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Log out
              </Button>
            </Box>
          )}
        </Drawer>

        {/* Main Chat Area */}

        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction="column"
            width="100%"
            height="100%"
            border="1px solid"
            borderColor="grey.300"
            borderRadius={2}
            // p={2}
            spacing={3}
          >
            <Stack
              direction="row"
              backgroundColor="#5a189a"
              width="100%"
              height="10%"
              alignItems={"center"}
            >
              {getProfile(chatBot)}

              <Stack direction="column" alignItems={"flex-start"}>
                <Typography
                  variant="h6"
                  textAlign="center"
                  color={"#ffffff"}
                  sx={{ fontWeight: "bold" }}
                >
                  {chatBot}
                </Typography>
                <Typography textAlign="center" color={"#ffffff"}>
                  Ask me anything!
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              overflow="auto"
              maxHeight="100%"
              px={4}
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
                    bgcolor={message.role === "assistant" ? "#f2f2f2" : "#ded1eb"}
                    color={message.role === "assistant" ? "#000000" : "#5a189a"}
                    borderRadius={10}
                    p={2}
                    sx={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "85%",  // Increased from 75%
                      mx: 1,
                      boxShadow: 3,
                      overflowX: "auto",  // Allow horizontal scroll if content overflows
                    }}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>


            {/* Message Input */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              px={2}
              pb={2}
            >
              <TextField
                autoComplete="off"
                label="Message EduBot"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#5a189a",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "#5a189a",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
                sx={{
                  width: 48,
                  height: 48,
                  minWidth: 48,
                  backgroundColor: "#5a189a",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "#7b2cbf",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <FaPaperPlane size={16} />
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
