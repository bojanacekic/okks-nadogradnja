import { Plus, Clock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import AllergenWarning from './AllergenWarning'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="card group flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative overflow-hidden h-48 shrink-0">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }}
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">Unavailable</span>
          </div>
        )}
        <span className="absolute top-3 left-3 badge bg-orange-100 text-orange-700">{product.category}</span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <AllergenWarning allergens={product.allergens} />

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Clock size={12} />
              <span>{product.preparationTime} min</span>
            </div>
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={!product.isAvailable}
            className="btn-primary flex items-center gap-1.5 py-2 px-3 text-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
