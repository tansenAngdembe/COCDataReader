import React, { useState } from 'react'

function UploadPage({ onUpload }) {
  const [playPointsFile, setPlayPointsFile] = useState(null)
  const [purchaseHistoryFile, setPurchaseHistoryFile] = useState(null)
  const [playPointsData, setPlayPointsData] = useState(null)
  const [purchaseHistoryData, setPurchaseHistoryData] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState({ playPoints: false, purchaseHistory: false })

  const processFile = (file, type) => {
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setErrors(prev => ({
        ...prev,
        [type]: 'Please upload a JSON file'
      }))
      return
    }

    if (type === 'playPoints') {
      setPlayPointsFile(file)
      setErrors(prev => ({ ...prev, playPoints: null }))
    } else {
      setPurchaseHistoryFile(file)
      setErrors(prev => ({ ...prev, purchaseHistory: null }))
    }

    // Read and parse the file
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result)
        
        if (type === 'playPoints') {
          setPlayPointsData(jsonData)
        } else {
          setPurchaseHistoryData(jsonData)
        }
        setErrors(prev => ({ ...prev, [type]: null }))
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          [type]: 'Invalid JSON file. Please check the file format.'
        }))
        if (type === 'playPoints') {
          setPlayPointsData(null)
          setPlayPointsFile(null)
        } else {
          setPurchaseHistoryData(null)
          setPurchaseHistoryFile(null)
        }
      }
    }
    reader.onerror = () => {
      setErrors(prev => ({
        ...prev,
        [type]: 'Error reading file. Please try again.'
      }))
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    processFile(file, type)
  }

  const handleDrag = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }))
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [type]: false }))
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], type)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    if (!playPointsFile || !playPointsData) {
      newErrors.playPoints = 'Please upload Play Points JSON file'
    }
    
    if (!purchaseHistoryFile || !purchaseHistoryData) {
      newErrors.purchaseHistory = 'Please upload Purchase History JSON file'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      onUpload({
        playPoints: playPointsData,
        purchaseHistory: purchaseHistoryData
      })
      setIsLoading(false)
    }, 500)
  }

  const handleReset = () => {
    setPlayPointsFile(null)
    setPurchaseHistoryFile(null)
    setPlayPointsData(null)
    setPurchaseHistoryData(null)
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Upload Your Data
            </h1>
            <p className="text-gray-600">
              Upload your Play Points and Purchase History JSON files
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Play Points Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Play Points JSON File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => handleFileChange(e, 'playPoints')}
                  className="hidden"
                  id="playPointsFile"
                />
                <label
                  htmlFor="playPointsFile"
                  onDragEnter={(e) => handleDrag(e, 'playPoints')}
                  onDragLeave={(e) => handleDrag(e, 'playPoints')}
                  onDragOver={(e) => handleDrag(e, 'playPoints')}
                  onDrop={(e) => handleDrop(e, 'playPoints')}
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    dragActive.playPoints
                      ? 'border-blue-400 bg-blue-100 scale-105'
                      : errors.playPoints
                      ? 'border-red-300 bg-red-50 hover:bg-red-100'
                      : playPointsFile
                      ? 'border-green-300 bg-green-50 hover:bg-green-100'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className={`w-10 h-10 mb-3 ${
                        errors.playPoints
                          ? 'text-red-500'
                          : playPointsFile
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">JSON files only</p>
                    {playPointsFile && (
                      <p className="mt-2 text-sm font-medium text-green-600">
                        ✓ {playPointsFile.name}
                      </p>
                    )}
                  </div>
                </label>
              </div>
              {errors.playPoints && (
                <p className="mt-2 text-sm text-red-600">{errors.playPoints}</p>
              )}
              {playPointsData && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ File loaded successfully ({Array.isArray(playPointsData) ? playPointsData.length : '1'} items)
                </p>
              )}
            </div>

            {/* Purchase History Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase History JSON File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => handleFileChange(e, 'purchaseHistory')}
                  className="hidden"
                  id="purchaseHistoryFile"
                />
                <label
                  htmlFor="purchaseHistoryFile"
                  onDragEnter={(e) => handleDrag(e, 'purchaseHistory')}
                  onDragLeave={(e) => handleDrag(e, 'purchaseHistory')}
                  onDragOver={(e) => handleDrag(e, 'purchaseHistory')}
                  onDrop={(e) => handleDrop(e, 'purchaseHistory')}
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    dragActive.purchaseHistory
                      ? 'border-blue-400 bg-blue-100 scale-105'
                      : errors.purchaseHistory
                      ? 'border-red-300 bg-red-50 hover:bg-red-100'
                      : purchaseHistoryFile
                      ? 'border-green-300 bg-green-50 hover:bg-green-100'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className={`w-10 h-10 mb-3 ${
                        errors.purchaseHistory
                          ? 'text-red-500'
                          : purchaseHistoryFile
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">JSON files only</p>
                    {purchaseHistoryFile && (
                      <p className="mt-2 text-sm font-medium text-green-600">
                        ✓ {purchaseHistoryFile.name}
                      </p>
                    )}
                  </div>
                </label>
              </div>
              {errors.purchaseHistory && (
                <p className="mt-2 text-sm text-red-600">{errors.purchaseHistory}</p>
              )}
              {purchaseHistoryData && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ File loaded successfully ({Array.isArray(purchaseHistoryData) ? purchaseHistoryData.length : '1'} items)
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading || !playPointsData || !purchaseHistoryData}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isLoading || !playPointsData || !purchaseHistoryData
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'View Dashboard'
                )}
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Upload your Play Points JSON file (usually named "Play Points.json")</li>
              <li>Upload your Purchase History JSON file (usually named "Purchase History.json")</li>
              <li>Both files are required to view the dashboard</li>
              <li>Files must be valid JSON format</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage

