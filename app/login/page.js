"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Input,
} from "@mui/material";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log(res);
      setEmail("");
      setPassword("");
      sessionStorage.setItem("user", true);

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        minHeight: "100vh",
        backgroundColor: "#f8f1ff",
        backgroundImage: 'url("/images/EduBot.png")',
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: { xs: "100%", md: "50%", lg: "40%" },
          mr: { xs: 0, md: 0, lg: 5 },
          height: "95vh",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#5a189a",
          padding: 10,
          justifyContent: "center", // Center the login form
          alignItems: "center", // Center the login form
        }}
      >
        {/* Right side login form */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <img
            src="/images/logo-white.png"
            alt="EduBot Logo"
            style={{ width: "50px", height: "auto", margin: "20px" }}
          />

          <Typography
            component="h1"
            variant="h3"
            sx={{ color: "#ffffff", marginBottom: 4, fontSize: "35px" }}
          >
            Login to EduBot
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
            }}
          >
            <Input
              placeholder="Email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: 1,
                padding: "12px",
                marginBottom: "16px",
                "& label": { color: "#615dfa" },
                "& input": { color: "#615dfa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffffff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffffff",
                  },
                },
              }}
            />
            <Input
              placeholder="Password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: 1,
                padding: "12px",
                marginBottom: "16px",
                "& label": { color: "#615dfa" },
                "& input": { color: "#615dfa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffffff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffffff",
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 3,
                marginBottom: 2,
                backgroundColor: "#ffffff",
                color: "#5a189a",
                fontWeight: "bold",
                padding: "10px 0",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Login
            </Button>
            <Link
              href="/signup"
              variant="body2"
              sx={{
                color: "#ffffff",
                display: "block",
                textAlign: "center",
                marginTop: 2,
              }}
            >
              Don’t have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
