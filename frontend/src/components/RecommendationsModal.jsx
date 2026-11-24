import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { productsApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function RecommendationsModal({ product, onClose }) {
  const dialog = useRef(null)
  const titleId = useId()
  const { addItem } = useCart()
  const { user, dietaryProfile } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    dialog.current.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    setSelected([])
    productsApi.getRecommendations(product.id)
      .then(({ data }) => { if (active) setRecommendations(data) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [product.id, user?.userId, dietaryProfile])

  const total = product.price + recommendations.filter(item => selected.includes(item.id)).reduce((sum, item) => sum + item.price, 0)
  const addSelected = () => {
    addItem(product)
    recommendations.filter(item => selected.includes(item.id)).forEach(addItem)
    onClose()
  }
  const continueWithoutExtras = () => {
    addItem(product)
    onClose()
  }

  return createPortal(
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={onClose} onClose={onClose}
      className="rounded-2xl p-0 w-[calc(100%_-_2rem)] max-w-lg max-h-[90vh] backdrop:bg-black/50">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-gray-900">Complete your meal</h2>
            <p className="text-sm text-gray-500 mt-1">{product.name} · ${product.price.toFixed(2)}</p>
          </div>
          <button onClick={onClose} aria-label="Close recommendations" className="p-1 rounded-lg hover:bg-gray-100"><X size={22} /></button>
        </div>
        {loading ? <p role="status" className="text-gray-500 py-4">Loading suggestions...</p>
          : error ? <p role="alert" className="text-gray-500 py-4">Suggestions are unavailable. Continue to add your meal.</p>
          : recommendations.length === 0 ? <p className="text-gray-500 py-4">No suitable additions available for this meal.</p>
          : (
            <fieldset className="space-y-3">
              <legend className="text-sm text-gray-600 mb-3">Choose optional additions</legend>
              {recommendations.map(item => (
                <label key={item.id} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300">
                  <input type="checkbox" className="w-4 h-4 accent-orange-500" checked={selected.includes(item.id)}
                    onChange={event => setSelected(current => event.target.checked ? [...current, item.id] : current.filter(id => id !== item.id))} />
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium text-sm text-gray-900">{item.name}</span>
                    <span className="block text-xs text-gray-500">{item.category}</span>
                  </div>
                  <span className="text-orange-500 font-semibold text-sm">${item.price.toFixed(2)}</span>
                </label>
              ))}
            </fieldset>
          )}
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={continueWithoutExtras} className="btn-secondary flex-1">Continue without extras</button>
          <button onClick={addSelected} disabled={loading || error || selected.length === 0} className="btn-primary flex-1">
            Add selected · ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </dialog>, document.body
  )
}
