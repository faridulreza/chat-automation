"use client";

import { useQuery } from "@tanstack/react-query";

const fetchAccounts = async () => {
  const res = await fetch("/api/protected/telegram", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return res.json();
};

const useAccounts = () => {
  const accoutsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  return accoutsQuery;
};

export default useAccounts;