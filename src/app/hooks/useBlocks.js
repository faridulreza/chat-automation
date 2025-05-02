import { useQuery } from "@tanstack/react-query";

const useBlocks = (id) => {
  const query = useQuery({
    queryKey: ["blocks", id],
    queryFn: async () => {
      const response = await fetch(`/api/protected/block?automationId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    },
  });

  return query
};

export default useBlocks;
