import { useEffect, useState } from 'react'
import { getOrderCountdown } from '../utils/orderTiming'

export default function OrderEstimate({ order }) {
  const [now, setNow] = useState(Date.now)
  const countdown = getOrderCountdown(order, now)
  const deadline = countdown?.deadline
  const ticking = countdown?.seconds > 0

  useEffect(() => {
    setNow(Date.now())
    if (!ticking) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [deadline, ticking])

  const completed = order.status === 'Delivered' || order.status === 'Cancelled'
  const hasDurations = Number.isFinite(order.estimatedPreparationMinutes) && Number.isFinite(order.estimatedDeliveryMinutes)

  return (
    <div className="rounded-xl bg-orange-50 p-4 mb-4 text-sm text-gray-700">
      {completed ? <p className="font-semibold text-gray-900">{order.status === 'Delivered' ? 'Order delivered' : 'Order cancelled'}</p>
        : order.status === 'Pending' ? (
          <>
            <p className="font-semibold text-gray-900">Waiting for confirmation</p>
            {hasDurations && <p className="mt-1">Estimated preparation and delivery ~{order.estimatedPreparationMinutes + order.estimatedDeliveryMinutes} min after preparation starts</p>}
          </>
        ) : countdown ? (
          <>
            <p className="font-semibold text-gray-900">{countdown.label}</p>
            {countdown.seconds > 0 ? (
              <p role="timer" aria-label={countdown.label} className="text-2xl font-bold text-orange-600 tabular-nums mt-1">
                {String(Math.floor(countdown.seconds / 60)).padStart(2, '0')}:{String(countdown.seconds % 60).padStart(2, '0')}
              </p>
            ) : <p role="status" className="mt-1 text-amber-800">Estimate elapsed. Waiting for a status update.</p>}
            {order.status === 'Preparing' && Number.isFinite(order.estimatedDeliveryMinutes) && <p className="mt-1">Delivery ~{order.estimatedDeliveryMinutes} min after dispatch</p>}
          </>
        ) : <p className="text-gray-500">Phase start or estimated duration was not recorded for this order.</p>}
      {!completed && order.status !== 'Pending' && order.estimatedDeliveryAt && (
        <p className="mt-2 text-gray-500">Estimated arrival{' '}
          <time dateTime={order.estimatedDeliveryAt}>
            {new Date(order.estimatedDeliveryAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </time>
        </p>
      )}
    </div>
  )
}
