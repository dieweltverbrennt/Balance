import './Categories.scss'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import {
  IncomeExpenseSwitch,
  type TransactionType,
} from '@/components/IncomeExpenseSwitch'
import { getCategories } from '@/api/categories'
import { useQuery } from '@tanstack/react-query'
import { CategoryCard } from '@/components/Category/CategoryCard'
import { CategoryForm } from '@/components/Category/CategoryForm'
import { AnimatePresence, motion } from 'framer-motion'

export const Categories = () => {
  const [type, setType] = useState<TransactionType>('expense')
  const [isFormOpen, setIsFormOpen] = useState(false)

  // const {
  //   data: categories = [],
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ['categories'],
  //   queryFn: getCategories,
  // })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const openForm = () => {
    setIsFormOpen(true)
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
          onClick={openForm}
        >
          <Plus />
          Добавить категорию
        </Button>
      </div>

      {/* <div
        className={`categories__container ${
          isFormOpen ? 'categories__container--form-open' : ''
        }`}
      >
        <div className="categories__main">
          <IncomeExpenseSwitch value={type} onChange={setType} />
          <div className="categories__items">
            {categories
              .filter((category) => category.type === type)
              .map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  color={category.color}
                  icon={category.icon}
                  subcategories={category.subcategories}
                />
              ))}
          </div>
        </div>
        {isFormOpen && (
          <div className="categories__adding">
            <CategoryForm onClose={() => setIsFormOpen(false)} />
          </div>
        )}
      </div> */}

      <motion.div
        className={`categories__container ${
          isFormOpen ? 'categories__container--form-open' : ''
        }`}
        layout
        transition={{
          layout: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      >
        <motion.div className="categories__main" layout>
          <IncomeExpenseSwitch value={type} onChange={setType} />

          <div className="categories__items">
            {categories
              .filter((category) => category.type === type)
              .map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  color={category.color}
                  icon={category.icon}
                  subcategories={category.subcategories}
                />
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
              <CategoryForm onClose={() => setIsFormOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
