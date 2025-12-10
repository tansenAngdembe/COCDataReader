import React, { useState } from 'react'

function OrderHistory({ orders }) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      return dateString
    }
  }

  const getDocumentTypeColor = (type) => {
    if (!type) return 'bg-gray-100 text-gray-800'
    switch (type) {
      case 'Subscription':
        return 'bg-purple-100 text-purple-800'
      case 'In App Item':
        return 'bg-blue-100 text-blue-800'
      case 'Android Apps':
        return 'bg-green-100 text-green-800'
      case 'Book':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodColor = (method) => {
    if (!method) return 'bg-gray-100 text-gray-800'
    if (method?.includes('Google Play balance')) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (method?.includes('PayPal')) {
      return 'bg-blue-100 text-blue-800'
    }
    if (method?.includes('Visa') || method?.includes('Mastercard') || method?.includes('DEBIT')) {
      return 'bg-indigo-100 text-indigo-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const documentTypes = [...new Set(
    orders
      .map(order => order.orderHistory?.lineItem?.[0]?.doc?.documentType)
      .filter(Boolean)
  )]

  const filteredOrders = orders.filter(item => {
    const order = item.orderHistory
    if (!order) return false

    const matchesFilter = filter === 'all' || 
      (order.lineItem?.[0]?.doc?.documentType || 'Other') === filter
    
    const matchesSearch = 
      (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.lineItem?.[0]?.doc?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.billingInstrument?.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.totalPrice || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  // Calculate totals
  const totalSpent = orders.reduce((sum, item) => {
    try {
      const price = parseFloat(item.orderHistory?.totalPrice?.replace('$', '') || '0')
      return sum + price
    } catch (error) {
      return sum
    }
  }, 0)

  const totalRefunded = orders.reduce((sum, item) => {
    try {
      const refund = parseFloat(item.orderHistory?.refundAmount?.replace('$', '') || '0')
      return sum + refund
    } catch (error) {
      return sum
    }
  }, 0)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
          <div className="flex gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
              <div className="text-sm">Total Spent</div>
              <div className="text-xl font-bold">${totalSpent.toFixed(2)}</div>
            </div>
            {totalRefunded > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg">
                <div className="text-sm">Total Refunded</div>
                <div className="text-xl font-bold">${totalRefunded.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {documentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredOrders.map((item, index) => {
          const order = item.orderHistory
          if (!order) return null

          const lineItem = order.lineItem?.[0]
          const doc = lineItem?.doc
          const billingInstrument = order.billingInstrument
          const contact = order.associatedContact?.[0] || order.billingContact

          return (
            <div
              key={order.orderId || index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {doc?.documentType && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getDocumentTypeColor(
                          doc.documentType
                        )}`}
                      >
                        {doc.documentType}
                      </span>
                    )}
                    {billingInstrument?.displayName && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(
                          billingInstrument.displayName
                        )}`}
                      >
                        {billingInstrument.displayName}
                      </span>
                    )}
                    {order.preorder && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        Preorder
                      </span>
                    )}
                  </div>
                  <div className="text-gray-800 font-medium text-lg">
                    {doc?.title || 'Unknown Item'}
                  </div>
                  {order.orderId && (
                    <div className="text-sm text-gray-500 mt-1 font-mono">
                      Order ID: {order.orderId}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">
                    {order.totalPrice === '$0.00' ? 'Free' : order.totalPrice}
                  </div>
                  {order.discount && parseFloat(order.discount.replace('$', '')) > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      Discount: {order.discount}
                    </div>
                  )}
                  {order.refundAmount && parseFloat(order.refundAmount.replace('$', '')) > 0 && (
                    <div className="text-sm text-red-600 mt-1">
                      Refunded: {order.refundAmount}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100 text-sm">
                <div>
                  <div className="text-gray-500">Order Date</div>
                  <div className="text-gray-800 font-medium">
                    {formatDate(order.creationTime)}
                  </div>
                </div>
                {contact && (
                  <div>
                    <div className="text-gray-500">Contact</div>
                    <div className="text-gray-800 font-medium">
                      {contact.name || 'N/A'}
                      {contact.city && contact.state && (
                        <span className="block text-xs text-gray-500">
                          {contact.city}, {contact.state} {contact.postalCode}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500">Details</div>
                  <div className="text-gray-800 font-medium">
                    {order.tax && parseFloat(order.tax.replace('$', '')) > 0 && (
                      <span className="block">Tax: {order.tax}</span>
                    )}
                    {lineItem?.quantity && (
                      <span className="block">Quantity: {lineItem.quantity}</span>
                    )}
                    {order.ipCountry && (
                      <span className="block text-xs text-gray-500">
                        IP Country: {order.ipCountry}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderHistory

