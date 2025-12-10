import React, { useState } from 'react'

function PointsHistory({ history }) {
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

  const getCategoryColor = (category) => {
    if (category.includes('earned') || category.includes('redeemed') || category.includes('prize')) {
      return 'bg-green-100 text-green-800'
    }
    if (category.includes('used')) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-blue-100 text-blue-800'
  }

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'Gold':
        return 'bg-yellow-500'
      case 'Silver':
        return 'bg-gray-400'
      case 'Bronze':
        return 'bg-orange-500'
      default:
        return 'bg-blue-500'
    }
  }

  const categories = [...new Set(history.map(h => h.category))]
  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter
    const matchesSearch = 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.doc?.[0]?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Points History</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredHistory.length} of {history.length} transactions
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredHistory.map((item, index) => (
          <div
            key={item.transactionId || index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  {item.preTransactionLevel !== item.postTransactionLevel && (
                    <div className="flex items-center gap-1">
                      <span className={`w-3 h-3 rounded-full ${getLevelBadgeColor(item.preTransactionLevel)}`}></span>
                      <span className="text-gray-400">→</span>
                      <span className={`w-3 h-3 rounded-full ${getLevelBadgeColor(item.postTransactionLevel)}`}></span>
                    </div>
                  )}
                </div>
                <div className="text-gray-800 font-medium">
                  {item.doc?.[0]?.title || 'N/A'}
                </div>
                {item.doc?.[0]?.documentType && (
                  <div className="text-sm text-gray-500 mt-1">
                    {item.doc[0].documentType}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div
                  className={`text-lg font-bold ${
                    parseInt(item.pointsChange) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {parseInt(item.pointsChange) >= 0 ? '+' : ''}
                  {parseInt(item.pointsChange).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Balance: {parseInt(item.postTransactionBalance).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-100 text-sm">
              <div>
                <div className="text-gray-500">Date</div>
                <div className="text-gray-800 font-medium">
                  {formatDate(item.time)}
                </div>
              </div>
              {item.orderId && (
                <div>
                  <div className="text-gray-500">Order ID</div>
                  <div className="text-gray-800 font-mono text-xs">
                    {item.orderId}
                  </div>
                </div>
              )}
              <div>
                <div className="text-gray-500">Pre Balance</div>
                <div className="text-gray-800 font-medium">
                  {parseInt(item.preTransactionBalance).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Level</div>
                <div className="text-gray-800 font-medium">
                  {item.postTransactionLevel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PointsHistory

