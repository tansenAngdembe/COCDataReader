import React from 'react'

function MembershipCard({ membership }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Silver':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'Bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Membership Status</h2>
          <p className="text-gray-600 mt-1">Your Play Points membership information</p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg border-2 font-semibold ${getLevelColor(
            membership.level
          )}`}
        >
          {membership.level}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Status</div>
          <div className="text-xl font-semibold text-gray-800">
            {membership.status}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-gray-600 mb-1">Points Balance</div>
          <div className="text-2xl font-bold text-green-700">
            {parseInt(membership.pointsBalance).toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-gray-600 mb-1">Points to Next Level</div>
          <div className="text-xl font-semibold text-gray-800">
            {parseInt(membership.pointsToNextLevel).toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
          <div className="text-sm text-gray-600 mb-1">Country</div>
          <div className="text-xl font-semibold text-gray-800">
            {membership.country}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Enroll Time</span>
          <span className="font-medium text-gray-800">
            {formatDate(membership.enrollTime)}
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Level Completion Time</span>
          <span className="font-medium text-gray-800">
            {formatDate(membership.levelCompletionTime)}
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Level Expiration Time</span>
          <span className="font-medium text-gray-800">
            {formatDate(membership.levelExpirationTime)}
          </span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-600">Points Expiration Time</span>
          <span className="font-medium text-gray-800">
            {formatDate(membership.pointsExpirationTime)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MembershipCard

