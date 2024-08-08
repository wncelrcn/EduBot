'use client';
import { useState, useEffect, useRef } from "react";
import { Box, Stack, TextField, Button, CircularProgress, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hello, I am your **Coding ChatBot**, how can I help you today?',
  }]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setMessage('');
    setIsLoading(true);
    setMessages((messages) => [
      ...messages,
      {
        role: 'user',
        content: message,
      },
      {
        role: 'assistant',
        content: '',
      }
    ]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then((res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          setIsLoading(false);
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [...otherMessages, { ...lastMessage, content: lastMessage.content + text }];
        });
        return reader.read().then(processText);
      });
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor='background.paper'
        color='text.primary'
      >
        <Stack
          direction="column"
          width="600px"
          height="700px"
          border="1px solid"
          borderColor='grey.300'
          borderRadius={2}
          p={2}
          spacing={3}
        >
          <Typography variant="h6" textAlign="center">Coding ChatBot</Typography>
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                  }
                  color="white"
                  borderRadius={10}
                  p={2}
                  maxWidth="80%"
                  sx={{ wordWrap: "break-word" }}
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
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
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
