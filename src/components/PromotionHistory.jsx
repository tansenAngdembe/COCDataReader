import React, { useState } from 'react'

function PromotionHistory({ promotions }) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PROVISIONED':
        return 'bg-blue-100 text-blue-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = (expiryTime) => {
    if (!expiryTime) return false
    return new Date(expiryTime) < new Date()
  }

  const statuses = [...new Set(
    promotions.flatMap(p => 
      p.promotionHistory?.promotionHistory?.promotionState?.map(state => state.status) || []
    )
  )]

  const filteredPromotions = promotions.filter(item => {
    const promotionState = item.promotionHistory?.promotionHistory?.promotionState
    const instanceContext = item.promotionHistory?.instanceContext
    const matchesFilter = filter === 'all' || 
      promotionState?.some(state => state.status === filter)
    const matchesSearch = 
      (instanceContext?.document?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instanceContext?.country || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Promotion History</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredPromotions.length} of {promotions.length} promotions
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredPromotions.map((item, index) => {
          const instanceContext = item.promotionHistory?.instanceContext
          const promotionStates = item.promotionHistory?.promotionHistory?.promotionState || []
          const promotionState = promotionStates[0]
          const latestState = promotionStates[promotionStates.length - 1]
          const expired = isExpired(instanceContext?.expiryTime)

          return (
            <div
              key={index}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                expired ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {latestState?.status && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          latestState.status
                        )}`}
                      >
                        {latestState.status}
                      </span>
                    )}
                    {expired && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        EXPIRED
                      </span>
                    )}
                  </div>
                  <div className="text-gray-800 font-medium text-lg">
                    {instanceContext?.document?.title || 'Untitled Promotion'}
                  </div>
                  {instanceContext?.country && (
                    <div className="text-sm text-gray-500 mt-1">
                      Country: {instanceContext.country}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {instanceContext?.totalQuantity && (
                    <div className="text-lg font-bold text-gray-800">
                      Qty: {parseInt(instanceContext.totalQuantity) === 2147483647 ? 'Unlimited' : instanceContext.totalQuantity}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100 text-sm">
                {instanceContext?.expiryTime && (
                  <div>
                    <div className="text-gray-500">Expiry Time</div>
                    <div className={`font-medium ${expired ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatDate(instanceContext.expiryTime)}
                    </div>
                  </div>
                )}
                {promotionState?.timestamp && (
                  <div>
                    <div className="text-gray-500">Activated</div>
                    <div className="text-gray-800 font-medium">
                      {formatDate(promotionState.timestamp)}
                    </div>
                  </div>
                )}
                {promotionState?.device && (
                  <div>
                    <div className="text-gray-500">Device</div>
                    <div className="text-gray-800 font-medium">
                      {promotionState.device.deviceDisplayName || promotionState.device.model}
                    </div>
                  </div>
                )}
              </div>

              {promotionStates.length > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Status History:</div>
                  <div className="space-y-1">
                    {promotionStates.map((state, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${getStatusColor(state.status)}`}>
                          {state.status}
                        </span>
                        <span className="text-gray-600">
                          {formatDate(state.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PromotionHistory

