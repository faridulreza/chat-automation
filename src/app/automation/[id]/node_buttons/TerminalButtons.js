import { BlockType } from "@/models/Block";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const TerminalButtons = ({ automationId, setNodes }) => {
  const addTriggerMutation = useMutation({
    mutationKey: ["addTerminalNode", automationId],
    mutationFn: async (type) => {
      const response = await fetch("/api/protected/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          automationId,
          position: { x: 0, y: 0 },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setNodes((prev) => [
        ...prev,
        {
          id: data._id,
          type: data.type,
          position: data.position,
          data: { ...data },
        },
      ]);
    },
    onError: (error) => {
      toast.error("Error adding trigger");
      console.error("Error adding Telegram message trigger:", error);
    },
  });

  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        Terminal Nodes
      </Typography>

      <Stack direction="row" spacing={2} overflow="auto">
        <Button
          disabled={addTriggerMutation.isPending}
          onClick={() =>
            addTriggerMutation.mutate(BlockType.TelegramSendMessage)
          }
          variant="contained"
          color="primary"
        >
          Send Message to Telegram
        </Button>
      </Stack>
    </Box>
  );
};

export default TerminalButtons;
