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
} from "@mui/material";
import { toast } from "react-toastify";

const APITriggerNode = (props) => {


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
        API Trigger
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        make below API call to trigger the automation. Include neccesary data in
        the body.
      </Typography>

      <code
        onClick={() => {
          navigator.clipboard.writeText(
            `https://${window.location.host}/api/autochat/${props.id}`
          );
          toast.success("Copied to clipboard");
        }}
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          margin: "10px 0",
        }}
      >
       
          POST {window.location.host}/api/autochat/{props.id}
     
      </code>

      <Handle type="source" position="bottom" id="to" />

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

export default APITriggerNode;
