import React, { useState } from 'react'
import MembershipCard from './MembershipCard'
import PointsHistory from './PointsHistory'
import PurchaseHistory from './PurchaseHistory'
import PromotionHistory from './PromotionHistory'

function Dashboard({ playPointsData, purchaseHistoryData, promotionHistoryData }) {
  const [playPoints, setPlayPoints] = useState([])
  const [purchaseHistory, setPurchaseHistory] = useState([])
  const [promotionHistory, setPromotionHistory] = useState([])
  const [membership, setMembership] = useState(null)
  const [activeTab, setActiveTab] = useState('membership')

  React.useEffect(() => {
    // Extract membership data (first item with membership property)
    const membershipData = playPointsData?.find(
      item => item.playPointsDetails?.membership
    )
    if (membershipData) {
      setMembership(membershipData.playPointsDetails.membership)
    }

    // Extract points history (all items with pointsHistory property)
    const historyData = playPointsData?.filter(
      item => item.playPointsDetails?.pointsHistory
    ).map(item => item.playPointsDetails.pointsHistory) || []
    setPlayPoints(historyData)

    // Set purchase history
    const purchases = purchaseHistoryData?.map(
      item => item.purchaseHistory
    ) || []
    setPurchaseHistory(purchases)

    // Set promotion history
    const promotions = promotionHistoryData?.filter(
      item => item.promotionHistory
    ) || []
    setPromotionHistory(promotions)

    // Set initial tab based on available data
    if (!membership && playPoints.length === 0 && purchases.length === 0 && promotions.length === 0) {
      // No data available
    } else if (membership) {
      setActiveTab('membership')
    } else if (playPoints.length > 0) {
      setActiveTab('points')
    } else if (purchases.length > 0) {
      setActiveTab('purchases')
    } else if (promotions.length > 0) {
      setActiveTab('promotions')
    }
  }, [playPointsData, purchaseHistoryData, promotionHistoryData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Google Play Dashboard
          </h1>
          <p className="text-gray-600">
            View your Play Points and Purchase History
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto">
            {membership && (
              <button
                onClick={() => setActiveTab('membership')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'membership'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Membership
              </button>
            )}
            {playPoints.length > 0 && (
              <button
                onClick={() => setActiveTab('points')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'points'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Points History ({playPoints.length})
              </button>
            )}
            {purchaseHistory.length > 0 && (
              <button
                onClick={() => setActiveTab('purchases')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'purchases'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Purchase History ({purchaseHistory.length})
              </button>
            )}
            {promotionHistory.length > 0 && (
              <button
                onClick={() => setActiveTab('promotions')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'promotions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Promotion History ({promotionHistory.length})
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'membership' && membership && (
            <MembershipCard membership={membership} />
          )}
          {activeTab === 'membership' && !membership && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600">No membership data available</p>
            </div>
          )}
          {activeTab === 'points' && (
            <PointsHistory history={playPoints} />
          )}
          {activeTab === 'purchases' && (
            <PurchaseHistory purchases={purchaseHistory} />
          )}
          {activeTab === 'promotions' && (
            <PromotionHistory promotions={promotionHistory} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

