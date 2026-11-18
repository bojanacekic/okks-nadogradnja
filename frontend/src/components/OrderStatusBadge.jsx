const statusConfig = {
  'Pending':          { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'Preparing':        { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Out for Delivery': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Delivered':        { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  'Cancelled':        { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
}

export default function OrderStatusBadge({ status }) {
  const cfg = statusConfig[status] ?? statusConfig['Pending']
  return (
    <span className={`badge ${cfg.bg} ${cfg.text} gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  )
}
