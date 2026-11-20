import { useEffect } from 'react'
import { useProductStore } from '../store/useProductStore'

function HomePage() {
  const { fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div>
      HomePage
    </div>
  )
}

export default HomePage
