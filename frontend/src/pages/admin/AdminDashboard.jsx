import { useState, useEffect } from 'react'
import { ShoppingBag, Package, Users, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { adminApi } from '../../services/api'
import OrderStatusBadge from '../../components/OrderStatusBadge'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats()
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag className="text-blue-500" size={24} />, bg: 'bg-blue-50' },
    { label: 'Pending', value: stats.pendingOrders, icon: <Clock className="text-yellow-500" size={24} />, bg: 'bg-yellow-50' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: <CheckCircle className="text-green-500" size={24} />, bg: 'bg-green-50' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign className="text-orange-500" size={24} />, bg: 'bg-orange-50' },
    { label: 'Products', value: stats.totalProducts, icon: <Package className="text-purple-500" size={24} />, bg: 'bg-purple-50' },
    { label: 'Customers', value: stats.totalUsers, icon: <Users className="text-pink-500" size={24} />, bg: 'bg-pink-50' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 font-medium">{order.userName}</td>
                    <td className="py-3 text-orange-500 font-bold">${order.total.toFixed(2)}</td>
                    <td className="py-3"><OrderStatusBadge status={order.status} /></td>
                    <td className="py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
