"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateAutiomation = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const createAutomation = async () => {
      try {
      } catch (error) {
        router.replace("/dashboard");
        console.error("Error creating automation:", error);
      }
    };

    createAutomation();
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h4" gutterBottom>
        Creating Automation...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default CreateAutiomation;
