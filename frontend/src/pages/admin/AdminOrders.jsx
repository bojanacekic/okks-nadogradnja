import { useState, useEffect } from 'react'
import { ordersApi } from '../../services/api'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import toast from 'react-hot-toast'

const STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const load = () => ordersApi.getAll().then(r => setOrders(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status)
      toast.success(`Status updated to ${status}`)
      load()
    } catch { toast.error('Failed to update status') }
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
            }`}
          >
            {s} {s === 'All' ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No orders found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header row */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-xs text-gray-400">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="font-semibold text-gray-900">{order.userName}</p>
                    <p className="text-xs text-gray-400">{order.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="font-bold text-orange-500">${order.total.toFixed(2)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                  {/* Status changer */}
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t px-5 pb-5 pt-4 bg-gray-50">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Payment</p>
                      <p className="text-sm text-gray-700">{order.paymentMethod}</p>
                    </div>
                    {order.notes && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{order.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.productName} × {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-orange-500">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
