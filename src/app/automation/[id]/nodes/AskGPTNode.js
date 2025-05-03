import useAccounts from "@/app/hooks/useAccounts";
import { Add, Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ControlButton, Controls, Handle } from "@xyflow/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Typography,
  Box,
  Select,
  IconButton,
  MenuItem,
  FormControl,
  TextField,
  Button,
} from "@mui/material";

const AskGPTNode = (props) => {
  const [gptData, setGptData] = useState({});
  const queryClient = useQueryClient();
  const blockUpdateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/protected/block/" + props.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    mutationKey: ["blockUpdate", props.id],
  });

  const blockDeleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/protected/block/" + props.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blocks", props.data.automationId]);
    },
    mutationKey: ["blockDelete", props.id],
  });

  useEffect(() => {
    if (!props.dragging) {
      blockUpdateMutation.mutate({
        position: {
          x: props.positionAbsoluteX,
          y: props.positionAbsoluteY,
        },
      });
    }
  }, [props.dragging, props.positionAbsoluteX, props.positionAbsoluteY]);

  useEffect(() => {
    if (props.data.data) {
      setGptData(props.data.data);
    }
  }, [props.data.data]);
  
  const handleSave = () => {
    blockUpdateMutation.mutate({
      data: {
        ...gptData,
      },
    });
  };

  return (
    <Box
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "white",
        minWidth: "250px",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
        Ask GPT
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        GPT prompt
      </Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        value={gptData.prompt ?? props.data.data.prompt}
        onChange={(e) => setGptData({ ...gptData, prompt: e.target.value })}
      />

      <Typography variant="body2" sx={{ mb: 1 }}>
        Expected response
      </Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        value={gptData.response ?? props.data.data.response}
        onChange={(e) => setGptData({ ...gptData, response: e.target.value })}
      />

      <Button
        disabled={blockUpdateMutation.isPending}
        variant="text"
        onClick={handleSave}
        sx={{ mt: 2 }}
        fullWidth
      >
        Save
      </Button>

      <Handle type="source" position="bottom" id="to" />
      <Handle type="target" position="top" />

      <Box sx={{ position: "absolute", top: "5px", right: "5px" }}>
        <ControlButton
          onClick={() => blockDeleteMutation.mutate()}
          disabled={blockDeleteMutation.isPending}
        >
          <Delete color="error" />
        </ControlButton>
      </Box>
    </Box>
  );
};

export default AskGPTNode;
