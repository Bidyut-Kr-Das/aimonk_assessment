export function TreeNodeSkeleton({ depth = 0 }: { depth?: number }) {
  return (
    <div className="w-full border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm shadow-lg shadow-black/20 overflow-hidden">
      {/* Header skeleton — mirrors the gradient header */}
      <div className="w-full bg-linear-to-r from-indigo-600/50 to-violet-600/50 flex gap-3 p-3 items-center">
        {/* Chevron button skeleton */}
        <div className="rounded-full h-6 aspect-square bg-white/20 animate-pulse shrink-0" />

        {/* Node name skeleton */}
        <div className="h-4 rounded-md bg-white/20 animate-pulse flex-1 max-w-[40%]" />

        {/* "Add Child" button skeleton */}
        <div className="h-7 w-24 rounded-lg bg-white/20 animate-pulse shrink-0" />
      </div>

      {/* Expanded body skeleton — show only for top-level to suggest depth */}
      {depth < 1 && (
        <div className="animate-in fade-in duration-300">
          <div className="p-3 pl-5 border-l-2 border-indigo-500/20 ml-3 mt-2 mb-2 flex flex-col gap-2">
            <TreeNodeSkeleton depth={depth + 1} />
            <TreeNodeSkeleton depth={depth + 1} />
          </div>
        </div>
      )}
    </div>
  );
}