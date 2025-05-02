"use client";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CreateTelegram = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/protected/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      router.push("/dashboard?tab=accounts");
    } else {
      toast.error("Error adding telegram bot");
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      flexDirection="column"
      gap={2}
    >
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        maxWidth="600px"
      >
        {loading && (
          <>
            <Typography variant="h4" gutterBottom>
              Adding Telegram Bot...
            </Typography>
            <CircularProgress />
          </>
        )}
        {!loading && (
          <>
            <Typography variant="h4" gutterBottom>
              Enter Your Telegram Bot Token
            </Typography>
            <TextField
              label="Token"
              variant="outlined"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!token}
            >
              Add Bot
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CreateTelegram;
