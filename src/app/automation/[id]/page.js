"use client";
import useBlocks from "@/app/hooks/useBlocks";
import Loading from "@/components/Loading";
import { Box, Stack, Typography } from "@mui/material";
import {
  addEdge,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import { addEdges, buildGraph, updateConnection } from "./utility";
import TriggerButtons from "./node_buttons/TriggerButtons";
import { BlockType } from "@/models/Block";
import TelegramRecieveMessageNode from "./nodes/TelegramRecieveMessageNode";
import APITriggerNode from "./nodes/APITriggerNode";
import TerminalButtons from "./node_buttons/TerminalButtons";
import TelegramSendMessageNode from "./nodes/TelegramSendMessageNode";
import AskGPTNode from "./nodes/AskGPTNode";
import IntermediateButtons from "./node_buttons/IntermediateButtons";
import LogicButtons from "./node_buttons/logicButtons";
import ConditionNode from "./nodes/ConditionNode";

const FLOW_NODE_TYPES = {
  [BlockType.TelegramRecieveMessage]: TelegramRecieveMessageNode,
  [BlockType.APITrigger]: APITriggerNode,
  [BlockType.TelegramSendMessage]: TelegramSendMessageNode,
  [BlockType.AskGPT]: AskGPTNode,
  [BlockType.ConditionChecker]: ConditionNode
};

const AutomationEditor = () => {
  const param = useParams();
  const { data: blocks, isLoading, isFetched } = useBlocks(param.id);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => {
      updateConnection(params)
      setEdges((eds) => addEdges(params, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    if (!blocks) return;
    const data = buildGraph(blocks);
    setNodes(data.nodes);
    setEdges(data.edges);
  }, [blocks]);

  if (isLoading && !isFetched) {
    return <Loading />;
  }

  return (
    <Box sx={{ width: "100%", height: "90vh", backgroundColor: "#f0f0f0" }}>
      <Stack
        style={{
          width: "100%",
          height: "5vh",
          backgroundColor: "#f0f0f0",
          display: "flex",
          flexDirection: "row",
          borderBottom: "1px solid #ccc",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            backgroundColor: "#f0f0f0",
            color: "#333",
          }}
        >
          Automation Editor
        </Typography>
      </Stack>

      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Box
          sx={{
            borderRight: "1px solid #ccc",
            width: "30%",
            maxWidth: "400px",
            padding: "8px 10px",
            height: "100%",
            display: "flex",
            backgroundColor: "#f0f0f0",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <TriggerButtons automationId={param.id} setNodes={setNodes} />
          <TerminalButtons automationId={param.id} setNodes={setNodes} />
          <IntermediateButtons automationId={param.id} setNodes={setNodes} />
          <LogicButtons automationId={param.id} setNodes={setNodes} />
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "95%",
            display: "flex",
            backgroundColor: "#f0f0f0",
          }}
        >
          <ReactFlow
            width="100%"
            height="100%"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={FLOW_NODE_TYPES}
          >
            <Controls />
          </ReactFlow>
        </Box>
      </Box>
    </Box>
  );
};

export default AutomationEditor;
