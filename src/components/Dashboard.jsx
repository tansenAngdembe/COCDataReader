import React, { useState } from 'react'
import MembershipCard from './MembershipCard'
import PointsHistory from './PointsHistory'
import PurchaseHistory from './PurchaseHistory'

function Dashboard({ playPointsData, purchaseHistoryData }) {
  const [playPoints, setPlayPoints] = useState([])
  const [purchaseHistory, setPurchaseHistory] = useState([])
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
  }, [playPointsData, purchaseHistoryData])

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
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('membership')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'membership'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Membership
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'points'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Points History ({playPoints.length})
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'purchases'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Purchase History ({purchaseHistory.length})
            </button>
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
        </div>
      </div>
    </div>
  )
}

export default Dashboard

