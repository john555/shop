import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="Vercel Logo"
        className="dark:invert mb-4"
        width={150}
        height={32.5}
        priority
      />
    </Link>
  );
};
