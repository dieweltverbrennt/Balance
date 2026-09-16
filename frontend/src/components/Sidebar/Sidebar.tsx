import { NavLink } from 'react-router-dom'
import type { NavigationItem } from '@/types/navigation'
import {
  House,
  CreditCard,
  ArrowLeftRight,
  ChartPie,
  ChartNoAxesCombined,
  Settings,
} from 'lucide-react'
import './Sidebar.scss'
import logo from '@/assets/logo.png'

const navigationItems: NavigationItem[] = [
  {
    label: 'Главная',
    path: '/',
    icon: House,
  },
  {
    label: 'Счета',
    path: '/accounts',
    icon: CreditCard,
  },
  {
    label: 'Транзакции',
    path: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    label: 'Категории',
    path: '/categories',
    icon: ChartPie,
  },
  {
    label: 'Аналитика',
    path: '/analytics',
    icon: ChartNoAxesCombined,
  },
]

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} className="sidebar__image" alt="logo" />
        Balance
      </div>

      <nav className="sidebar__nav">
        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'sidebar__link sidebar__link--active'
                  : 'sidebar__link'
              }
            >
              <Icon className="sidebar__icon" />

              <span className="sidebar__text">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar__bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
          }
        >
          <Settings className="sidebar__icon" />
          <span className="sidebar__text">Настройки</span>
        </NavLink>
      </div>
    </aside>
  )
}
