import React, { useState } from 'react'
import UploadPage from './components/UploadPage'
import Dashboard from './components/Dashboard'

function App() {
  const [uploadedData, setUploadedData] = useState(null)

  const handleUpload = (data) => {
    setUploadedData(data)
  }

  const handleReset = () => {
    setUploadedData(null)
  }

  return (
    <>
      {!uploadedData ? (
        <UploadPage onUpload={handleUpload} />
      ) : (
        <div>
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Dashboard
              </h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Upload New Files
              </button>
            </div>
          </div>
          <Dashboard
            playPointsData={uploadedData.playPoints}
            purchaseHistoryData={uploadedData.purchaseHistory}
          />
        </div>
      )}
    </>
  )
}

export default App

