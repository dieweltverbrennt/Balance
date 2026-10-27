import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

import './Categories.scss'

import { getCategories } from '@/api/categories'
import { Button } from '@/components/ui/button'
import { IncomeExpenseSwitch } from '@/components/Category/IncomeExpenseSwitch'
import { CategoryCard } from '@/components/Category/CategoryCard'
import { CategoryForm } from '@/components/Category/CategoryForm/CategoryForm'
import type { CategoryToEdit, TransactionType } from '@/types/category'

export const Categories = () => {
  const [type, setType] = useState<TransactionType>('expense')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryToEdit | undefined
  >(undefined)

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const visibleCategories = categories.filter(
    (category) => category.type === type,
  )

  const openCreateForm = () => {
    setSelectedCategory(undefined)
    setIsFormOpen(true)
  }

  const openEditForm = (category: CategoryToEdit) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedCategory(undefined)
  }

  return (
    <div className="categories">
      <div className="categories__header mb-6">
        <div>
          <h1 className="categories__title">Категории</h1>

          <p className="categories__subtitle">
            Управляйте своими категориями расходов и доходов.
          </p>

          <p className="categories__subtitle">
            Создайте подкатегории для более детального учета.
          </p>
        </div>

        <Button
          variant="accent"
          className="categories__add"
          type="button"
          onClick={openCreateForm}
        >
          <Plus />
          Добавить категорию
        </Button>
      </div>

      <motion.div
        className={`categories__container ${
          isFormOpen ? 'categories__container--form-open' : ''
        }`}
      >
        <motion.div className="categories__main">
          <IncomeExpenseSwitch value={type} onChange={setType} />

          <div
            className={`categories__items ${
              isFormOpen ? 'categories__items--form-open' : ''
            }`}
          >
            {isLoading && (
              <p className="categories__message">Загружаем категории...</p>
            )}

            {isError && (
              <div className="categories__message">
                <p>Не удалось загрузить категории.</p>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => void refetch()}
                >
                  Повторить
                </Button>
              </div>
            )}

            {!isLoading && !isError && visibleCategories.length === 0 && (
              <p className="categories__message">
                {type === 'expense'
                  ? 'Категорий расходов пока нет.'
                  : 'Категорий доходов пока нет.'}
              </p>
            )}

            {!isLoading &&
              !isError &&
              visibleCategories.map((category) => (
                <motion.div key={category.id} layout>
                  <CategoryCard category={category} onEdit={openEditForm} />
                </motion.div>
              ))}
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {isFormOpen && (
            <motion.div
              key="category-form"
              className="categories__adding"
              initial={{
                opacity: 0,
                x: 24,
                scaleX: 0.92,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scaleX: 1,
              }}
              exit={{
                opacity: 0,
                x: 24,
                scaleX: 0.92,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: 'right center' }}
            >
              <CategoryForm category={selectedCategory} onClose={closeForm} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
