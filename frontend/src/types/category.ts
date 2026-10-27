export type TransactionType = 'income' | 'expense'

/** Категория и её вложенные элементы, полученные с сервера */
export interface CategoryTreeItem {
  id: string
  name: string
  color: string | null
  icon: string | null
  subcategories?: CategoryTreeItem[]
}

/** Категория верхнего уровня */
export interface Category extends CategoryTreeItem {
  type: TransactionType
  parentCategoryId: string | null
}

/** Подкатегория в форме */
export interface CategorySubcategoryForm {
  id?: string
  name: string
  color?: string | null
  icon?: string | null
  subcategories?: CategorySubcategoryForm[]
}

/** Категория, выбранная для редактирования */
export interface CategoryToEdit {
  id: string
  name: string
  type: TransactionType
  icon: string | null
  color: string | null
  subcategories?: CategorySubcategoryForm[]
}

/** Данные для создания или обновления категории */
export interface CategoryData {
  name: string
  type: TransactionType
  icon: string
  color: string
  subcategories: CategorySubcategoryForm[]
}

/** Fields accepted by the category update endpoint. */
export interface UpdateCategoryData {
  name: string
  icon: string
  color: string
  type: TransactionType
  subcategories: UpdateSubcategoryData[]
}

export interface UpdateSubcategoryData {
  id?: string
  name: string
  subcategories: UpdateSubcategoryData[]
}
