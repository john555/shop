import {
  House,
  LucideIcon,
  Tags,
  Settings,
  Package2,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DASHBOARD_ROOT_PATH = "/dashboard";

type HeaderNavItem = Readonly<{
  title: string;
  href: string;
  icon: LucideIcon;
  subItems?: Pick<HeaderNavItem, "title" | "href">[];
}>;

export const navItems: HeaderNavItem[] = [
  {
    title: "Home",
    href: DASHBOARD_ROOT_PATH,
    icon: House,
  },
  {
    title: "Products",
    href: `${DASHBOARD_ROOT_PATH}/products`,
    icon: Tags,
    subItems: [
      {
        title: "Collections",
        href: `${DASHBOARD_ROOT_PATH}/collections`,
      },
      {
        title: "Inventory",
        href: `${DASHBOARD_ROOT_PATH}/inventory`,
      },
    ],
  },
  {
    title: "Orders",
    href: `${DASHBOARD_ROOT_PATH}/orders`,
    icon: Package2
  },
  {
    title: "Customers",
    href: `${DASHBOARD_ROOT_PATH}/customers`,
    icon: Users2,
  },
];

export const footerNavItems: HeaderNavItem[] = [
  {
    title: "Settings",
    href: `${DASHBOARD_ROOT_PATH}/settings`,
    icon: Settings,
  },
];

export function NavItems() {
  return (
    <div className="md:flex relative flex-col md:w-60 min-h-screen max-h-screen overflow-y-auto">
      <div className="flex flex-col px-4 pb-28 md:pb-48 pt-6">
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
        <nav className="flex flex-col gap-0">
          {navItems.map((item) => (
            <div key={item.title}>
              <Link
                href={item.href}
                className="flex items-center text-muted-foreground gap-2 text-sm p-2 rounded-md active:bg-gray-200 hover:bg-gray-100"
              >
                <item.icon size={20} strokeWidth={1.2} />
                {item.title}
              </Link>
              {item.subItems ? (
                <nav className="flex flex-col gap-0 pl-7">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="border-l flex items-center text-muted-foreground gap-2 text-sm p-2 active:bg-gray-200 hover:bg-gray-100"
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </nav>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
      <nav className="fixed left-0 bottom-0 w-72 md:w-60 p-4 h-20 md:h-40 bg-white">
        {footerNavItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center text-muted-foreground gap-2 text-sm p-2 rounded-md active:bg-gray-200 hover:bg-gray-100"
          >
            <item.icon size={20} strokeWidth={1.2} />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
