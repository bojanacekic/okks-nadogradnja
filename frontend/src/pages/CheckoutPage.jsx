import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../services/api'
import toast from 'react-hot-toast'

const DELIVERY_FEE = 2.99

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState(user?.address || '')
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [placed, setPlaced] = useState(false)

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!address.trim()) { toast.error('Delivery address is required'); return }
    if (items.length === 0) { toast.error('Your cart is empty'); return }

    setLoading(true)
    try {
      await ordersApi.place({
        deliveryAddress: address,
        paymentMethod,
        notes,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      })
      clearCart()
      setPlaced(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <CheckCircle size={72} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Placed!</h2>
          <p className="text-gray-500 mb-8">Your order is being prepared. We'll deliver it soon!</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/orders')} className="btn-primary px-6 py-2.5">View Orders</button>
            <button onClick={() => navigate('/menu')} className="btn-secondary px-6 py-2.5">Order More</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Enter your full address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select className="input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option>Cash on Delivery</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    className="input resize-none"
                    rows={3}
                    placeholder="Any special requests or notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Placing Order...' : `Place Order • $${(subtotal + DELIVERY_FEE).toFixed(2)}`}
            </button>
          </form>

          {/* Summary */}
          <div className="card p-6 h-fit">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span><span>${DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span className="text-orange-500">${(subtotal + DELIVERY_FEE).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
