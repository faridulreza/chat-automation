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
  Stack,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

const ConditionNode = (props) => {
  const queryClient = useQueryClient();
  const [conditionData, setConditionData] = useState({});
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
        Condition Checker
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        <code>data</code> is the data received from upstream. You can use it to
        as object and access the properties of the data. For example, if you
        have a data object like this:
        <pre>{`{ "name": "John", "age": 30, "city": "New York" }`}</pre>
        <br />
        You can access the properties like this:
        <pre>
          {`
          data.name // "John"
          data.age // 30
          data.city // "New York"`}
        </pre>
        Anything else will be first tried to parse as number and if it fails, it
        will be treated as string.
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        overflow="auto"
        justifyContent={"space-between"}
      >
        <TextField
          style={{ maxWidth: "200px", margin: "10px" }}
          label="lhs"
          variant="outlined"
          size="small"
          value={conditionData.lhs ?? props.data.data.lhs}
          onChange={(e) =>
            setConditionData({ ...conditionData, lhs: e.target.value })
          }
          sx={{ flexGrow: 1 }}
        />

        <select
          style={{
            width: "100px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "white",
          }}
          value={conditionData.operator ?? props.data.data.operator}
          onChange={(e) =>
            setConditionData({ ...conditionData, operator: e.target.value })
          }
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <option value="" disabled>
            <em>Select operator</em>
          </option>
          <option value="==">==</option>
          <option value="===">===</option>
          <option value="!=">!=</option>
          <option value="!==">!==</option>
          <option value="<">&lt;</option>
          <option value="<=">&lt;=</option>
          <option value=">">&gt;</option>
          <option value=">=">&gt;=</option>
        </select>

        <TextField
          style={{ maxWidth: "200px", margin: "10px" }}
          label="rhs"
          variant="outlined"
          size="small"
          value={conditionData.rhs ?? props.data.data.rhs}
          onChange={(e) =>
            setConditionData({ ...conditionData, rhs: e.target.value })
          }
        />
      </Stack>

      <Button
        disabled={blockUpdateMutation.isPending}
        variant="text"
        onClick={() => {
          blockUpdateMutation.mutate({
            data: {
              ...conditionData,
            },
          });
        }}
        sx={{ mt: 2 }}
      >
        Save
      </Button>

      <Handle type="source" position="right" id="yes" />
      <Handle type="source" position="left" id="no" />
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

export default ConditionNode;
