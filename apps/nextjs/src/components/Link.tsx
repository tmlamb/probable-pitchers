export default function Button({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="rounded-xl bg-blue px-3 py-1.5 text-white hover:underline active:opacity-25"
    >
      {children}
    </a>
  );
}
