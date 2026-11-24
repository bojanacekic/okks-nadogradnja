export default function OrderEmailStatus({ order }) {
  if (order.confirmationEmailStatus === 'Sent') {
    return <p className="text-sm text-gray-500 mb-4">Confirmation email sent to {order.userEmail}.</p>
  }
  if (order.confirmationEmailStatus === 'Pending') {
    return <p className="text-sm text-gray-500 mb-4">Confirmation email is queued for {order.userEmail}.</p>
  }
  if (order.confirmationEmailStatus === 'Failed') {
    return <p className="text-sm text-amber-800 mb-4">The confirmation email could not be sent. Your order is saved and can be tracked here.</p>
  }
  return null
}
