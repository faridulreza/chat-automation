import { Circle, Delete, Edit } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const { default: Loading } = require("@/components/Loading");
const { default: useAutomations } = require("../hooks/useAutomations");
const {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  IconButton,
  Box,
  TableRow,
  Stack,
  Typography,
} = require("@mui/material");

const deleteAutomation = async (id) => {
  const response = await fetch(`/api/protected/automation/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete the automation");
  }
};

const updateAutomation = async (id, data) => {
  const response = await fetch(`/api/protected/automation/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update the automation");
  }
};

const AutomationTableRow = ({ data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleEdit = () => {
    router.push(`/automation/${data._id}`);
  };

  const { isPending: isDeleting, mutate: handleDelete } = useMutation({
    mutationFn: deleteAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries(["automations"]);
    },
    onError: (error) => {
      toast.error("Error deleting automation");
      console.error("Error deleting automation:", error);
    },
  });

  const { isPending: isUpdating, mutate: handleUpdate } = useMutation({
    mutationFn: (updateData) => updateAutomation(data._id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(["automations"]);
    },
    onError: (error) => {
      toast.error("Error updating automation");
      console.error("Error updating automation:", error);
    },
  });

  return (
    <TableRow>
      <TableCell width="40%">
        <Typography variant="h6">{data.name}</Typography>
      </TableCell>
      <TableCell width="20%" align="center">
        <label
          style={{
            color: data.status === "active" ? "#4caf50" : "#f44336",
          }}
        >
          {data.status === "active" ? "Active" : "Inactive"}
        </label>
      </TableCell>
      <TableCell width="50%" align="right">
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <IconButton
            onClick={() =>
              handleUpdate({
                status: data?.status === "active" ? "inactive" : "active",
              })
            }
            disabled={isUpdating}
            aria-label="activate"
          >
            {data.status === "active" ? (
              <Circle color="success" />
            ) : (
              <Circle color="error" />
            )}
          </IconButton>
          <IconButton onClick={handleEdit} aria-label="edit">
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(data._id)}
            disabled={isDeleting}
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
const AutomationsTab = () => {
  const { loading, error, data } = useAutomations();

  if (loading) return <Loading />;
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            {data?.map((automation) => (
              <AutomationTableRow key={automation._id} data={automation} />
            ))}

            {data?.length === 0 && (
              <Box>
                <Typography variant="h6" align="center">
                  No automations found
                </Typography>
              </Box>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AutomationsTab;
