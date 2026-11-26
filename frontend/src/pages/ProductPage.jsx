import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, RotateCcwIcon, SaveIcon } from 'lucide-react'
import { useProductStore } from '../store/useProductStore'

const toForm = (product) => ({
  name: product.name,
  price: Number(product.price).toFixed(2),
  image: product.image,
})

function ProductPage() {
  const { id } = useParams()
  const { currentProduct, productError, loading, fetchProduct } = useProductStore()

  useEffect(() => {
    fetchProduct(id)
  }, [id, fetchProduct])

  const ready = currentProduct && String(currentProduct.id) === id

  if (loading || (!ready && !productError)) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      </main>
    )
  }

  if (productError) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="btn btn-ghost mb-8">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to products
        </Link>
        <div role="alert" className="alert alert-error">{productError}</div>
      </main>
    )
  }

  return <EditProductView key={currentProduct.id} product={currentProduct} />
}

// El formulario parte del último dato confirmado (product). Si un guardado
// falla, product no cambia: se conserva el dato confirmado y lo que el
// usuario escribió sigue en el formulario para poder corregirlo.
function EditProductView({ product }) {
  const navigate = useNavigate()
  const { saving, updateProduct } = useProductStore()

  const [form, setForm] = useState(() => toForm(product))
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    const result = await updateProduct(product.id, form)
    if (result.ok) navigate('/')
    else setFormError(result.message)
  }

  const handleRestore = () => {
    setForm(toForm(product))
    setFormError(null)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ÚLTIMO DATO CONFIRMADO */}
        <div className="card bg-base-100 shadow-xl self-start">
          <figure className="relative pt-[56.25%]">
            <img
              src={product.image}
              alt={product.name}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </figure>
          <div className="card-body">
            <span className="text-xs uppercase tracking-wide text-base-content/60">
              Last saved data
            </span>
            <h2 className="card-title text-lg font-semibold">{product.name}</h2>
            <p className="text-2xl font-bold text-primary">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <div className="card bg-base-100 shadow-xl">
          <form onSubmit={handleSubmit} className="card-body space-y-4">
            <h3 className="font-bold text-xl">Edit Product</h3>

            {formError && (
              <div role="alert" className="alert alert-error">
                {formError}
              </div>
            )}

            <label className="form-control w-full">
              <span className="label-text text-base font-medium">Product Name</span>
              <input
                type="text"
                required
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text text-base font-medium">Price</span>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                className="input input-bordered w-full"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text text-base font-medium">Image URL</span>
              <input
                type="text"
                required
                className="input input-bordered w-full"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </label>

            <div className="card-actions justify-end pt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleRestore}
                disabled={saving}
              >
                <RotateCcwIcon className="size-4 mr-2" />
                Restore
              </button>
              <button type="submit" className="btn btn-primary min-w-[140px]" disabled={saving}>
                {saving ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <SaveIcon className="size-4 mr-2" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default ProductPage
