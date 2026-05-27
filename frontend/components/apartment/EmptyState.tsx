import { LuSearchX } from "react-icons/lu";

interface EmptyStateProps {
  onClear: () => void;
}

export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="text-center py-24 text-gray-400">
      <LuSearchX className="mx-auto mb-4 opacity-30" size={48} />

      <p className="text-lg font-medium">
        No apartments found
      </p>

      <button
        onClick={onClear}
        className="mt-4 text-blue-500 text-sm hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}