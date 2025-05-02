import { Circle, Delete, Edit } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const { default: Loading } = require("@/components/Loading");
const { default: useAccounts } = require("../hooks/useAccounts");
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

const deleteAccount = async (id) => {
  const response = await fetch(`/api/protected/telegram/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete the account");
  }
};

const AccountTableRow = ({ data }) => {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: handleDelete } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts"]);
    },
    onError: (error) => {
      toast.error("Error deleting account");
      console.error("Error deleting account:", error);
    },
  });

  return (
    <TableRow>
      <TableCell width="50%">
        <Typography variant="h6">{data.name}</Typography>

        <Typography variant="body2">@{data.username}</Typography>
      </TableCell>
      <TableCell width="50%" align="right">
        <IconButton
          onClick={() => handleDelete(data._id)}
          disabled={isDeleting}
          aria-label="delete"
        >
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
const AccountsTab = () => {
  const { loading, error, data } = useAccounts();

  if (loading) return <Loading />;
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            {data?.map((account) => (
              <AccountTableRow key={account._id} data={account} />
            ))}

            {data?.length === 0 && (
              <Box>
                <Typography variant="h6" align="center">
                  No accounts found
                </Typography>
              </Box>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccountsTab;
