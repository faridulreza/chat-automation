"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { format } from "date-fns";
import { SmartToy, Telegram } from "@mui/icons-material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import AutomationsTab from "./AutomationsTab";
import AccountsTab from "./AccountsTab";

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
  const [selectedTab, setSelectedTab] = useState("automations");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setSelectedTab(tab);
    }
  }, [searchParams]);
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (loading) {
    return <Loading />;
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
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Automations" value="automations" />
              <Tab label="Accounts" value="accounts" />
            </TabList>
          </Box>
          <TabPanel value="automations">
            <AutomationsTab />
          </TabPanel>
          <TabPanel value="accounts">
            <AccountsTab />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
