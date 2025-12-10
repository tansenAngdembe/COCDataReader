import React, { useState } from 'react'

function PurchaseHistory({ purchases }) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'Subscription':
        return 'bg-purple-100 text-purple-800'
      case 'In App Item':
        return 'bg-blue-100 text-blue-800'
      case 'Android Apps':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodColor = (method) => {
    if (method?.includes('Google Play balance')) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (method?.includes('PayPal')) {
      return 'bg-blue-100 text-blue-800'
    }
    if (method?.includes('Visa') || method?.includes('Mastercard')) {
      return 'bg-indigo-100 text-indigo-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const documentTypes = [...new Set(purchases.map(p => p.doc?.documentType || 'Other'))]
  
  const filteredPurchases = purchases.filter(item => {
    const matchesFilter = 
      filter === 'all' || 
      (item.doc?.documentType || 'Other') === filter
    const matchesSearch = 
      (item.doc?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.paymentMethodTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.invoicePrice || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Calculate totals
  const totalSpent = purchases.reduce((sum, p) => {
    const price = parseFloat(p.invoicePrice?.replace('$', '') || '0')
    return sum + price
  }, 0)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Purchase History</h2>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
            <div className="text-sm">Total Spent</div>
            <div className="text-xl font-bold">${totalSpent.toFixed(2)}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search purchases..."
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
          Showing {filteredPurchases.length} of {purchases.length} purchases
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredPurchases.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {item.doc?.documentType && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getDocumentTypeColor(
                        item.doc.documentType
                      )}`}
                    >
                      {item.doc.documentType}
                    </span>
                  )}
                  {item.paymentMethodTitle && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(
                        item.paymentMethodTitle
                      )}`}
                    >
                      {item.paymentMethodTitle}
                    </span>
                  )}
                </div>
                <div className="text-gray-800 font-medium text-lg">
                  {item.doc?.title || 'N/A'}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-xl font-bold ${
                    parseFloat(item.invoicePrice?.replace('$', '') || '0') === 0
                      ? 'text-green-600'
                      : 'text-gray-800'
                  }`}
                >
                  {item.invoicePrice === '$0.00' ? 'Free' : item.invoicePrice}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.userCountry || 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100 text-sm">
              <div>
                <div className="text-gray-500">Purchase Date</div>
                <div className="text-gray-800 font-medium">
                  {formatDate(item.purchaseTime)}
                </div>
              </div>
              {item.paymentMethodTitle && (
                <div>
                  <div className="text-gray-500">Payment Method</div>
                  <div className="text-gray-800 font-medium">
                    {item.paymentMethodTitle}
                  </div>
                </div>
              )}
              <div>
                <div className="text-gray-500">Language</div>
                <div className="text-gray-800 font-medium">
                  {item.userLanguageCode || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PurchaseHistory

