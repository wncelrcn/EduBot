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
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log(res);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Failed to create an account");
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
            Sign Up for EduBot
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
            }}
          >
            <Input
              placeholder="Enter Email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: "#ffffff",
                borderRadius: 1,
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
              placeholder="Enter Password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: "#ffffff",
                borderRadius: 1,
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
              placeholder="Confirm Password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: "#ffffff",
                borderRadius: 1,
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
              Sign Up
            </Button>
            <Link
              href="/login"
              variant="body2"
              sx={{
                color: "#ffffff",
                display: "block",
                textAlign: "center",
                marginTop: 2,
              }}
            >
              Already have an account? Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
