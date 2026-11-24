export function getOrderCountdown(order, now) {
  let startedAt
  let minutes
  let label
  if (order.status === 'Preparing') {
    startedAt = order.preparationStartedAt
    minutes = order.estimatedPreparationMinutes
    label = 'Preparation remaining'
  } else if (order.status === 'Out for Delivery') {
    startedAt = order.deliveryStartedAt
    minutes = order.estimatedDeliveryMinutes
    label = 'Delivery remaining'
  } else {
    return null
  }
  if (!startedAt || !Number.isFinite(minutes) || minutes < 0) return null
  const deadline = Date.parse(startedAt) + minutes * 60000
  if (!Number.isFinite(deadline)) return null
  return { label, deadline, seconds: Math.max(0, Math.ceil((deadline - now) / 1000)) }
}
