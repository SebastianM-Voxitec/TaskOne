interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  /** Thin underline; use underlineGray for light gray (RECENT PARTNERSHIPS), else white */
  underline?: boolean;
  underlineGray?: boolean;
}

export function SectionHeading({ children, className = "", underline, underlineGray }: SectionHeadingProps) {
  const borderClass = underline
    ? underlineGray
      ? "border-b border-white/30 pb-1"
      : "border-b border-white pb-1"
    : "";
  return (
    <h2
      className={`block w-full text-2xl font-bold tracking-wider text-white ${borderClass} ${className}`}
      style={underline ? { borderBottomWidth: "1px" } : undefined}
    >
      {children}
    </h2>
  );
}
