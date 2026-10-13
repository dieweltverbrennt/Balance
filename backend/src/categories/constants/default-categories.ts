import { CategoryType } from '../entities/category.entity';

export const DEFAULT_CATEGORIES = [
  {
    name: 'Продукты',
    type: CategoryType.EXPENSE,
    color: '#75f2b8',
    icon: 'ShoppingCart',
  },
  {
    name: 'Транспорт',
    type: CategoryType.EXPENSE,
    color: '#5B9CF6',
    icon: 'Car',
  },
  {
    name: 'Жильё',
    type: CategoryType.EXPENSE,
    color: '#bd8eff',
    icon: 'Home',
  },
  {
    name: 'Здоровье',
    type: CategoryType.EXPENSE,
    color: '#e3766e',
    icon: 'HeartPulse',
  },
  {
    name: 'Зарплата',
    type: CategoryType.INCOME,
    color: '#bafb76',
    icon: 'BriefcaseBusiness',
  },
  {
    name: 'Переводы',
    type: CategoryType.INCOME,
    color: '#f5999a',
    icon: 'BanknoteArrowUp',
  },
];
