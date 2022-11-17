export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="rounded-xl bg-blue px-3 py-1.5 text-white hover:underline active:opacity-25"
    >
      {children}
    </button>
  );
}
