import Link from "next/link";

export default function LinkButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl bg-blue px-3 py-1.5 w-fit text-white hover:underline active:opacity-25"
    >
      {children}
    </Link>
  );
}
