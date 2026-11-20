export default function OrderEstimate({ order }) {
  if (!order.estimatedDeliveryAt) {
    return <p className="text-sm text-gray-500 mb-4">No estimate recorded for this order.</p>
  }

  const completed = order.status === 'Delivered' || order.status === 'Cancelled'
  const arrival = new Date(order.estimatedDeliveryAt)

  return (
    <div className="rounded-xl bg-orange-50 p-4 mb-4 text-sm text-gray-700">
      <p className="font-semibold text-gray-900">
        {completed ? 'Original estimated arrival' : 'Estimated arrival'}{' '}
        <time dateTime={order.estimatedDeliveryAt}>
          {arrival.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </time>
      </p>
      <p className="mt-1">
        Preparation ~{order.estimatedPreparationMinutes} min · Delivery ~{order.estimatedDeliveryMinutes} min
      </p>
      <p className="mt-1 text-gray-500">
        Estimated total from ordering ~{order.estimatedPreparationMinutes + order.estimatedDeliveryMinutes} min
      </p>
    </div>
  )
}
