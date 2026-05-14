"use client";

import { TreeNode } from "@/types/interface";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";
import { TreeNodesContainer } from "./tree-nodes-container";
import { toast } from "sonner";

export const TreeNodes = memo(function TreeNodes({
  node,
  isExpanded,
  toggleExpanded,
  updateNode,
  createNode,
}: {
  node: TreeNode;
  isExpanded: boolean;
  toggleExpanded: (id: number) => void;
  updateNode: (data: Partial<TreeNode>) => Promise<void>;
  createNode: (data: Partial<TreeNode>) => Promise<void>;
}) {
  const [data, setData] = useState(node.data ?? "");

  const [name, setName] = useState(node.name ?? "");

  const [editMode, setEditMode] = useState<Boolean>(false);

  async function onEnterPress(
    event: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> {
    // console.log(event.key);
    if (event.key === "Enter") {
      // console.log(data, node.data);
      if (node.data !== data) {
        const loadingToast = toast.loading("Updating data...");
        await updateNode({
          id: node.id,
          data,
        });
        toast.success("Data updated successfully");
        toast.dismiss(loadingToast);
      } else if (node.name !== name) {
        const loadingToast = toast.loading("Updating name...");
        await updateNode({
          id: node.id,
          name,
        });
        toast.success("Name updated successfully");
        toast.dismiss(loadingToast);
      }
      setEditMode(false);
      (event.target as HTMLInputElement).blur();
    }
  }

  return (
    <div
      key={node.id}
      className="w-full border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-lg shadow-black/20 overflow-hidden transition-all duration-300"
    >
      {/* Heading */}
      <div className="w-full bg-linear-to-r from-indigo-600/80 to-violet-600/80 flex gap-3 p-3 items-center">
        <button
          className="rounded-full h-6 aspect-square bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center text-white text-xs font-bold transition-all duration-200 shrink-0 shadow-inner"
          onClick={() => {
            toggleExpanded(node.id);
          }}
        >
          <span
            className={`inline-block transition-transform duration-200 ${isExpanded ? "rotate-90" : "rotate-0"}`}
          >
            {/* {isExpanded ? "v" : ">"} for better UI this part is commented out */}
            <ChevronRight className="h-4 aspect-square" />
          </span>
        </button>
        {!editMode ? (
          <h1
            className="text-white w-full font-semibold text-sm tracking-wide capitalize"
            onClick={() => {
              setEditMode(true);
            }}
          >
            {node.name}
          </h1>
        ) : (
          <input
            type="text"
            defaultValue={name}
            className="flex-1 bg-white border rounded-lg px-3 py-1.5 text-sm text-blue-500 focus:outline-none border-indigo-500/40 focus:border-indigo-500/60 focus:bg-white transition-all duration-200 placeholder-white/30"
            onChange={(e) => {
              setName(e.target.value.trim());
            }}
            onKeyUp={onEnterPress}
          />
        )}
        <button
          className="bg-[#e9e9e9] hover:bg-white px-4 py-1 whitespace-nowrap cursor-pointer rounded-lg font-medium"
          onClick={() => {
            createNode({
              name: "New Child",
              data: "Data",
              parent: node.id,
            });
          }}
        >
          Add Child
        </button>
      </div>
      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          {node.children && node.children.length > 0 ? (
            <div className="p-3 pl-5 border-l-2 border-indigo-500/30 ml-3 mt-2 mb-2">
              <TreeNodesContainer
                nodes={node.children}
                updateNode={updateNode}
                createNode={createNode}
              />
            </div>
          ) : (
            <div className="flex gap-2 p-3 items-center">
              <label
                htmlFor="data"
                className="text-indigo-300 text-xs font-semibold uppercase tracking-widest shrink-0"
              >
                Data
              </label>
              <input
                type="text"
                defaultValue={data}
                className="flex-1 bg-white/5 border rounded-lg px-3 py-1.5 text-sm text-blue-500 focus:outline-none border-indigo-500/40 focus:border-indigo-500/60 focus:bg-white/10 transition-all duration-200 placeholder-white/30"
                onChange={(e) => {
                  setData(e.target.value.trim());
                }}
                onKeyUp={onEnterPress}
              />
              {data !== node.data && (
                <h2 className="text-black/50 text-sm">
                  Press "Enter" to save.
                </h2>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
