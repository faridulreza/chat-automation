import useAccounts from "@/app/hooks/useAccounts";
import { Add, Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ControlButton, Controls, Handle } from "@xyflow/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Typography,
  Box,
} from "@mui/material";

const TelegramRecieveMessageNode = (props) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [messageType, setMessageType] = useState(10);

  const queryClient = useQueryClient();
  const router = useRouter();
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

  const telegrams = useAccounts();

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

  // Handle account selection change
  const handleAccountChange = (event) => {
    const value = event.target.value;

    if (value === "create") {
      router.push("/telegram/create");
      return;
    }

    setSelectedAccount(value);
    blockUpdateMutation.mutate({
      data: {
        accountId: value,
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
        Telegram Message Trigger
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Select an account to receive messages from
      </Typography>

      <select
        value={selectedAccount || props.data.data?.accountId}
        onChange={handleAccountChange}
        displayEmpty
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="" disabled>
          <em>Select an account</em>
        </option>

        {telegrams?.data?.map((account) => (
          <option key={account._id} value={account._id}>
            {account.name} @{account.username}
          </option>
        ))}

        <option
          value="create"
          onClick={(e) => {
            e.preventDefault();
            router.push("/telegram/create");
          }}
        >
          Create New Account
        </option>
      </select>

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

export default TelegramRecieveMessageNode;
