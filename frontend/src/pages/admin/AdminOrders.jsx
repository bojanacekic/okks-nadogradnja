import { useState, useEffect } from 'react'
import { ordersApi, adminApi } from '../../services/api'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import OrderEstimate from '../../components/OrderEstimate'
import OrderChat from '../../components/OrderChat'
import toast from 'react-hot-toast'

const STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
const SELECT_CLASS_NAME = 'h-10 w-full sm:w-72 max-w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-50'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [couriers, setCouriers] = useState([])
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const load = () => Promise.all([ordersApi.getAll(), adminApi.getCouriers()])
    .then(([ordersResponse, couriersResponse]) => {
      setOrders(ordersResponse.data)
      setCouriers(couriersResponse.data)
      setError('')
    })
    .catch(() => setError('Unable to load orders and couriers. Please refresh.'))
    .finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleStatusChange = async (orderId, status) => {
    setUpdating(true)
    try {
      await ordersApi.updateStatus(orderId, status)
      toast.success(`Status updated to ${status}`)
      await load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status') }
    finally { setUpdating(false) }
  }

  const handleCourierChange = async (orderId, courierId) => {
    setUpdating(true)
    try {
      await ordersApi.assignCourier(orderId, courierId || null)
      toast.success('Courier assignment updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to assign courier')
    } finally {
      await load()
      setUpdating(false)
    }
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      <button onClick={load} disabled={updating} className="btn-secondary mb-4">Refresh</button>
      {error && <p role="alert" className="text-red-600 mb-4">{error}</p>}

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
                className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-5 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div>
                    <p className="font-mono text-xs text-gray-400">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="font-semibold text-gray-900">{order.userName}</p>
                    <p className="text-xs text-gray-400 break-all">{order.userEmail}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                  <div className="w-24 shrink-0 text-right hidden sm:block">
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="font-bold text-orange-500">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="w-32 shrink-0"><OrderStatusBadge status={order.status} /></div>
                  {/* Status changer */}
                  <select
                    disabled={updating}
                    value={order.status}
                    aria-label={`Status of order ${order.id.slice(-8).toUpperCase()}`}
                    onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className={SELECT_CLASS_NAME}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s} disabled={s === 'Out for Delivery' && !order.courierId}>
                        {s}{s === 'Out for Delivery' && !order.courierId ? ' — assign courier first' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t px-5 pb-5 pt-4 bg-gray-50">
                  <OrderEstimate order={order} />
                  <OrderChat order={order} readOnly />
                  <div className="mb-4">
                    <label htmlFor={`courier-${order.id}`} className="block text-sm font-medium text-gray-700 mb-2">Courier</label>
                    {order.status === 'Delivered' || order.status === 'Cancelled' ? (
                      <p className="text-sm text-gray-600">{order.courierName || 'No courier assigned'}</p>
                    ) : (
                      <select id={`courier-${order.id}`} className={SELECT_CLASS_NAME} value={order.courierId || ''}
                        disabled={updating || !!error} onChange={event => handleCourierChange(order.id, event.target.value)}>
                        <option value="" disabled={order.status === 'Out for Delivery'}>Unassigned</option>
                        {couriers.map(courier => (
                          <option key={courier.id} value={courier.id}>
                            {courier.name} — {courier.activeOrderCount} active orders
                          </option>
                        ))}
                      </select>
                    )}
                    {order.courierPhone && <p className="text-xs text-gray-500 mt-2">Demo contact {order.courierPhone}</p>}
                  </div>
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
