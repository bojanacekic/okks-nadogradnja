import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { productsApi, categoriesApi, profileApi } from '../../services/api'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true, preparationTime: 15, allergens: null }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [allergenOptions, setAllergenOptions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  const load = () => productsApi.getAll().then(r => setProducts(r.data))

  useEffect(() => {
    load()
    categoriesApi.getAll().then(r => setCategories(r.data))
    profileApi.get().then(r => setAllergenOptions(r.data.allergenOptions))
      .catch(() => toast.error('Unable to load allergen options'))
  }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, imageUrl: p.imageUrl, isAvailable: p.isAvailable, preparationTime: p.preparationTime, allergens: p.allergens ?? null })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = { ...form, price: parseFloat(form.price), preparationTime: parseInt(form.preparationTime) }
      if (editing) {
        await productsApi.update(editing.id, data)
        toast.success('Product updated')
      } else {
        await productsApi.create(data)
        toast.success('Product created')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productsApi.delete(id)
      toast.success('Product deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=40' }} />
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.category}</td>
                <td className="px-6 py-4 font-bold text-orange-500">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-lg">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required className="input" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input resize-none" rows={2} value={form.description} onChange={set('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input required type="number" step="0.01" min="0" className="input" value={form.price} onChange={set('price')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input type="number" min="1" className="input" value={form.preparationTime} onChange={set('preparationTime')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input" value={form.category} onChange={set('category')}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input className="input" placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')} />
              </div>
              <fieldset className="border rounded-xl p-4">
                <legend className="text-sm font-medium text-gray-700 px-1">Allergens</legend>
                <label className="flex items-center gap-2 text-sm mb-3">
                  <input type="checkbox" checked={form.allergens !== null} disabled={allergenOptions.length === 0}
                    onChange={e => setForm(current => ({ ...current, allergens: e.target.checked ? [] : null }))} />
                  Allergen information provided
                </label>
                {form.allergens !== null && (
                  <div className="grid grid-cols-2 gap-2">
                    {allergenOptions.map(option => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={form.allergens.includes(option)}
                          onChange={e => setForm(current => ({ ...current, allergens: e.target.checked
                            ? [...current.allergens, option] : current.allergens.filter(value => value !== option) }))} />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isAvailable} onChange={set('isAvailable')} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-700">Available for ordering</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5">
                  {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
