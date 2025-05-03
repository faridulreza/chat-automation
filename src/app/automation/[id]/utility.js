import { BlockType } from "@/models/Block";

export const buildGraph = (blocks) => {
  let edges = [];
  let nodes = blocks.map((block) => {
    const { _id, type, position, data } = block;
    const { x, y } = position;

    return {
      id: _id,
      type,
      position: { x, y },
      data: { ...block },
    };
  });

  blocks.forEach((block) => {
    if (
      [
        BlockType.TelegramRecieveMessage,
        BlockType.APITrigger,
        BlockType.AskGPT,
      ].includes(block.type)
    ) {
      if (block.connections) {
        edges.push({
          id: `${block._id}-${block.connections.to}`,
          source: block._id,
          target: block.connections.to,
          sourceHandle: "to",
        });
      }
    } else if ([BlockType.ConditionChecker].includes(block.type)) {
      if (block.connections?.yes) {
        edges.push({
          id: `${block._id}-${block.connections.yes}`,
          source: block._id,
          target: block.connections.yes,
          sourceHandle: "yes",
          label: "yes",
        });
      }

      if (block.connections?.no) {
        edges.push({
          id: `${block._id}-${block.connections.no}`,
          source: block._id,
          target: block.connections.no,
          sourceHandle: "no",
          label: "no",
        });
      }
    }
  });
  return {
    edges,
    nodes,
  };
};

export const addEdges = (params, edges) => {
  const newEdge ={
    id: `${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle,
  }
  console.log("new: ", newEdge);
  console.log("edges: ", edges);

  let filteredEdges = edges.filter(
    (edge) => !(edge.source === params.source && edge.sourceHandle === params.sourceHandle)
  );

  return filteredEdges.concat(newEdge);
}

export const updateConnection = async (params) => {
  const response = await fetch("/api/protected/block/connect", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
