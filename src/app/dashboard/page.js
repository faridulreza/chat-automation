"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { format } from "date-fns";
import { SmartToy, Telegram } from "@mui/icons-material";
import Link from "next/link";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const BigAddButton = ({ text, icon, link }) => {
  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          width: 200,
          height: 150,
          "&:hover": {
            backgroundColor: "#f5f5f5",
            boxShadow: 6,
          },
        }}
      >
        {icon}
        <Typography variant="h6" sx={{ mt: 1 }}>
          {text}
        </Typography>
      </Paper>
    </Link>
  );
};
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Stack
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          marginBottom: 20,
        }}
      >
        <BigAddButton
          text="Create Flow"
          icon={<SmartToy fontSize="large" />}
          link="/automation/create"
        />

        <BigAddButton
          text="Add Telegram"
          icon={<Telegram fontSize="large" />}
          link="/telegram/create"
        />
      </Stack>
      <Typography variant="h4" gutterBottom>
        Your Flows
      </Typography>
      <Divider sx={{ mb: 4 }} />
    </Container>
  );
}
