import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import Navbar from '../components/Navbar'
import OrderStatusBadge from '../components/OrderStatusBadge'
import OrderEstimate from '../components/OrderEstimate'
import { ordersApi } from '../services/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = () => ordersApi.getMyOrders()
      .then(r => { if (active) { setOrders(r.data); setError('') } })
      .catch(() => { if (active) setError('Unable to refresh orders. Retrying shortly.') })
      .finally(() => { if (active) setLoading(false) })
    load()
    const interval = setInterval(load, 10000)
    return () => { active = false; clearInterval(interval) }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        {error && <p role="alert" className="text-red-600 mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-400">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <OrderEstimate order={order} />
                <div className="text-sm text-gray-600 mb-4">
                  {order.courierName ? (
                    <><p className="font-medium">Courier — {order.courierName}</p><p className="text-xs text-gray-500 mt-1">Demo contact {order.courierPhone}</p></>
                  ) : <p>Courier not yet assigned</p>}
                </div>
                <div className="space-y-1 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.productName} × {item.quantity}</span>
                      <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    📍 {order.deliveryAddress}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-bold text-orange-500 text-lg">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
