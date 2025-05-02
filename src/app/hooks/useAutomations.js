"use client";

import { useQuery } from "@tanstack/react-query";

const fetchAutomations = async () => {
  const res = await fetch("/api/protected/automation", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch automations");
  }

  return res.json();
};

const  useAutomations = () => {
  const automationsQuery = useQuery({
    queryKey: ["automations"],
    queryFn: fetchAutomations,
  });

  return automationsQuery;
};

export default useAutomations;