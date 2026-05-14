"use client";

import { TreeNode } from "@/types/interface";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";
import { TreeNodes } from "./tree-node";
import axios from "axios";

export const TreeNodesContainer = memo(function TreeNodesContainer({
  nodes,
  updateNode,
  createNode,
}: {
  nodes: TreeNode[];
  updateNode: (data: Partial<TreeNode>) => Promise<void>;
  createNode: (data: Partial<TreeNode>) => Promise<void>;
}) {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedNodes((prev) => {
      const updatedSet = new Set(prev);

      if (updatedSet.has(id)) {
        updatedSet.delete(id);
      } else {
        updatedSet.add(id);
      }
      return updatedSet;
    });
  };
  return (
    <section className="flex flex-col gap-2">
      {nodes.map((node) => {
        return (
          <TreeNodes
            key={node.id}
            node={node}
            isExpanded={expandedNodes.has(node.id)}
            toggleExpanded={toggleExpanded}
            updateNode={updateNode}
            createNode={createNode}
          />
        );
      })}
    </section>
  );
});
