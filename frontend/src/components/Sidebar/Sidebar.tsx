import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  CreditCard,
  ArrowLeftRight,
  ChartPie,
  ChartNoAxesCombined,
  Settings,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { logout } from "@/api/auth";
import "./Sidebar.scss";
import logo from "@/assets/logo.png";

type NavigationItem = {
  label: string;
  path: string;
  icon: typeof House;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Главная",
    path: "/",
    icon: House,
  },
  {
    label: "Счета",
    path: "/accounts",
    icon: CreditCard,
  },
  {
    label: "Транзакции",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Категории",
    path: "/categories",
    icon: ChartPie,
  },
  {
    label: "Аналитика",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      toast.error("Не удалось завершить сессию на сервере");
    } finally {
      navigate("/auth", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} className="sidebar__image" alt="logo" />
        Balance
      </div>

      <nav className="sidebar__nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
            >
              <Icon className="sidebar__icon" />

              <span className="sidebar__text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
          }
        >
          <Settings className="sidebar__icon" />
          <span className="sidebar__text">Настройки</span>
        </NavLink>

        <button
          type="button"
          className="sidebar__link sidebar__logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-busy={isLoggingOut}
        >
          <LogOut size="22" className="sidebar__icon" />
          <span className="sidebar__text">
            {isLoggingOut ? "Выходим..." : "Выйти"}
          </span>
        </button>
      </div>
    </aside>
  );
};
