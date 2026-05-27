export function ImageDots() {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
      {[0, 1, 2, 3].map((d) => (
        <span key={d} className={`w-1.5 h-1.5 rounded-full ${d === 0 ? "bg-white" : "bg-white/50"}`} />
      ))}
    </div>
  );
}