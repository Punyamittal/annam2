import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/index.css";

const navItems = [
  { label: "Dashboard", path: "/cattlefarmmanagement" },
  { label: "Cow Management", path: "/cattlefarmmanagement/cows" },
  { label: "Data Entry", path: "/cattlefarmmanagement/data-entry" },
  { label: "Reports", path: "/cattlefarmmanagement/reports" },
  { label: "Analytics", path: "/cattlefarmmanagement/analytics" },
];

const CattleNavbar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="cattle-navbar-horizontal"
      aria-label="Cattle Farm Management Navigation"
    >
      <ul className="cattle-navbar-list-horizontal">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={
                pathname === item.path
                  ? "cattle-navbar-link-horizontal active"
                  : "cattle-navbar-link-horizontal"
              }
              aria-current={pathname === item.path ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CattleNavbar;