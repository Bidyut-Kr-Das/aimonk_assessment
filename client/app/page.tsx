"use client";
import axios from "axios";
import { use, useCallback, useEffect, useState } from "react";
import { TreeNodes } from "./_components/tree-node";
import { TreeNode } from "@/types/interface";
import { TreeNodesContainer } from "./_components/tree-nodes-container";
import { toast } from "sonner";
import { TreeNodeSkeleton } from "./_components/tree-node-skeleton";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trees, setTrees] = useState<TreeNode[]>([]);
  const [output, setOutput] = useState<string>("");

  function revalidateTreeStructure(params: {
    tree: TreeNode[];
    updatedNode: TreeNode;
    type: "update" | "create";
    parentId?: number;
  }): TreeNode[] {
    const { tree, updatedNode, type } = params;
    if (type === "update") {
      const updateTree = tree.map((node) => {
        if (node.id === updatedNode.id) {
          return {
            ...node,
            ...updatedNode,
          };
        } else if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: revalidateTreeStructure({
              tree: node.children,
              updatedNode,
              type,
            }),
          };
        }
        return node;
      });
      return updateTree;
    }
    const updateTree = tree.map((node) => {
      if (node.id === params.parentId) {
        return {
          ...node,
          children: [...(node.children ?? []), updatedNode],
        };
      } else if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: revalidateTreeStructure({
            tree: node.children,
            type: "create",
            updatedNode: updatedNode,
            parentId: updatedNode.parent!,
          }),
        };
      }
      return node;
    });
    return updateTree;
  }

  function createTree(data: TreeNode[]) {
    const hashMap: Record<number, TreeNode> = {};
    data.forEach((node) => {
      node.children = [];
      hashMap[node.id] = node;
    });

    const root: TreeNode[] = [];

    for (const node of data) {
      const parentId = node.parent;
      if (parentId === null) {
        root.push(node);
      } else {
        const parent = hashMap[parentId];
        parent.children!.push(node);
      }
    }
    return root;
  }

  const updateNode = useCallback(async (data: Partial<TreeNode>) => {
    try {
      const res = await axios.put<TreeNode>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/node/`,
        { ...data },
      );
      const updatedNode = res.data;
      setTrees((prev) => {
        const updatedTrees = revalidateTreeStructure({
          type: "update",
          updatedNode: updatedNode,
          tree: prev,
        });
        return updatedTrees;
      });
    } catch (error) {
      throw new Error("Failed to update the node");
    }
  }, []);

  const createNode = useCallback(async (data: Partial<TreeNode>) => {
    try {
      const res = await axios.post<TreeNode>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/node/`,
        { ...data },
      );
      const updatedNode = res.data;
      if (!updatedNode.parent) {
        toast.error("Parent not found");
      }
      console.log(updatedNode);
      setTrees((prev) => {
        const updatedTrees = revalidateTreeStructure({
          type: "create",
          updatedNode: updatedNode,
          tree: prev,
          parentId: updatedNode.parent!,
        });
        return updatedTrees;
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create the node");
    }
  }, []);

  const createOutput = (
    tree: TreeNode[],
  ): (
    | Pick<TreeNode, "name" | "children">
    | Pick<TreeNode, "name" | "data">
  )[] => {
    const newTree = tree.map((node) => {
      return {
        name: node.name,
        ...(node.children && node.children.length > 0
          ? { children: createOutput(node.children) }
          : { data: node.data }),
      };
    });
    return newTree;
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<TreeNode[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/node/`,
          {
            withCredentials: true,
          },
        );
        console.log(response.data);
        setTrees(createTree(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trees:", error);
        setLoading(false);
        setError("Failed to fetch trees. Please try again later.");
      }
    })();

    return () => {
      setLoading(true);
      setError(null);
    };
  }, []);

  if (loading) {
    return (
      <div>
        <TreeNodeSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <TreeNodesContainer
        nodes={trees}
        updateNode={updateNode}
        createNode={createNode}
      />
      <button
        className="bg-white hover:bg-white/20 border shadow-lg w-24 border-black/50 px-4 py-1 whitespace-nowrap cursor-pointer rounded-lg font-medium"
        onClick={() => {
          const tree = createOutput(trees);
          setOutput(JSON.stringify(tree[0]));
        }}
      >
        Export
      </button>
      <h2>{output}</h2>
    </div>
  );
}
