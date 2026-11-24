import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api'

export default function AdminCouriers() {
  const [couriers, setCouriers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    adminApi.getCouriers().then(({ data }) => setCouriers(data))
      .catch(() => setError('Unable to load couriers. Please try again.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Couriers</h1>
          <p className="text-sm text-gray-500 mt-1">Simulated couriers with demonstration contact details</p>
        </div>
        <button onClick={load} disabled={loading} className="btn-secondary">Refresh</button>
      </div>
      {loading ? <p role="status">Loading couriers...</p> : error ? <p role="alert" className="text-red-600">{error}</p> : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {couriers.map(courier => (
            <div key={courier.id} className="card p-6">
              <div className="flex justify-between gap-3 items-center mb-3">
                <h2 className="font-semibold text-gray-900">{courier.name}</h2>
                <span className={`badge ${courier.isAvailable ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {courier.isAvailable ? 'Available' : 'Busy'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{courier.phone}</p>
              <p className="text-sm font-medium text-gray-600 mt-3">Active orders — {courier.activeOrderCount}</p>
              <ul className="text-sm text-gray-500 mt-2 space-y-1">
                {courier.activeOrderIds.map(id => <li key={id}>Order #{id.slice(-8).toUpperCase()}</li>)}
              </ul>
            </div>
          ))}
          {couriers.length === 0 && <p className="text-gray-500">No couriers available.</p>}
        </div>
      )}
      <Link to="/admin/orders" className="inline-block text-orange-600 text-sm mt-6 hover:underline">Assign couriers in Orders</Link>
    </div>
  )
}
