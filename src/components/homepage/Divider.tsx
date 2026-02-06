interface DividerProps {
  text: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-sm font-medium text-gray-400">{text}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
