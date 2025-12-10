import React, { useState } from 'react'

function UploadPage({ onUpload }) {
  const [files, setFiles] = useState({
    playPoints: { file: null, data: null, detected: false },
    purchaseHistory: { file: null, data: null, detected: false },
    promotionHistory: { file: null, data: null, detected: false }
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState({})

  // Detect data type from JSON structure
  const detectDataType = (jsonData) => {
    if (!Array.isArray(jsonData) && typeof jsonData !== 'object') {
      return null
    }

    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData]
    
    for (const item of dataArray) {
      if (item?.playPointsDetails) {
        return 'playPoints'
      }
      if (item?.purchaseHistory) {
        return 'purchaseHistory'
      }
      if (item?.promotionHistory) {
        return 'promotionHistory'
      }
    }
    
    return null
  }

  const processFile = (file, fileId) => {
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json' && file.type !== '') {
      setErrors(prev => ({
        ...prev,
        [fileId]: 'Please upload a JSON file'
      }))
      return
    }

    // Read and parse the file
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result)
        
        // Auto-detect data type
        const detectedType = detectDataType(jsonData)
        
        if (!detectedType) {
          setErrors(prev => ({
            ...prev,
            [fileId]: 'Could not detect data type. File must contain playPointsDetails, purchaseHistory, or promotionHistory.'
          }))
          return
        }

        // Update the detected type's file and data
        setFiles(prev => ({
          ...prev,
          [detectedType]: {
            file: file,
            data: jsonData,
            detected: true
          }
        }))
        
        setErrors(prev => ({ ...prev, [fileId]: null, [detectedType]: null }))
      } catch (error) {
        console.error('JSON parse error:', error)
        setErrors(prev => ({
          ...prev,
          [fileId]: `Invalid JSON file: ${error.message}`
        }))
      }
    }
    
    reader.onerror = () => {
      setErrors(prev => ({
        ...prev,
        [fileId]: 'Error reading file. Please try again.'
      }))
    }
    
    reader.readAsText(file)
  }

  const handleFileChange = (e, fileId) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file, fileId)
    }
  }

  const handleDrag = (e, fileId) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [fileId]: true }))
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [fileId]: false }))
    }
  }

  const handleDrop = (e, fileId) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [fileId]: false }))
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], fileId)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Check if at least one file is uploaded
    const hasAnyData = files.playPoints.data || files.purchaseHistory.data || files.promotionHistory.data
    
    if (!hasAnyData) {
      setErrors({ general: 'Please upload at least one JSON file' })
      return
    }

    setIsLoading(true)
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      onUpload({
        playPoints: files.playPoints.data,
        purchaseHistory: files.purchaseHistory.data,
        promotionHistory: files.promotionHistory.data
      })
      setIsLoading(false)
    }, 500)
  }

  const handleReset = () => {
    setFiles({
      playPoints: { file: null, data: null, detected: false },
      purchaseHistory: { file: null, data: null, detected: false },
      promotionHistory: { file: null, data: null, detected: false }
    })
    setErrors({})
  }

  const removeFile = (type) => {
    setFiles(prev => ({
      ...prev,
      [type]: { file: null, data: null, detected: false }
    }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[type]
      return newErrors
    })
  }

  const FileUploadArea = ({ type, label, description }) => {
    const fileData = files[type]
    const isActive = dragActive[type]
    const hasError = errors[type]
    const hasFile = fileData.file && fileData.data

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => handleFileChange(e, type)}
            className="hidden"
            id={`${type}File`}
          />
          <label
            htmlFor={`${type}File`}
            onDragEnter={(e) => handleDrag(e, type)}
            onDragLeave={(e) => handleDrag(e, type)}
            onDragOver={(e) => handleDrag(e, type)}
            onDrop={(e) => handleDrop(e, type)}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              isActive
                ? 'border-blue-400 bg-blue-100 scale-105'
                : hasError
                ? 'border-red-300 bg-red-50 hover:bg-red-100'
                : hasFile
                ? 'border-green-300 bg-green-50 hover:bg-green-100'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className={`w-10 h-10 mb-3 ${
                  hasError
                    ? 'text-red-500'
                    : hasFile
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
              <p className="text-xs text-gray-500">{description}</p>
              {hasFile && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-sm font-medium text-green-600">
                    ✓ {fileData.file.name}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(type)
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </label>
        </div>
        {hasError && (
          <p className="mt-2 text-sm text-red-600">{errors[type]}</p>
        )}
        {hasFile && !hasError && (
          <p className="mt-2 text-sm text-green-600">
            ✓ File loaded successfully ({Array.isArray(fileData.data) ? fileData.data.length : '1'} items)
            {fileData.detected && ` - Detected as ${type === 'playPoints' ? 'Play Points' : type === 'purchaseHistory' ? 'Purchase History' : 'Promotion History'}`}
          </p>
        )}
      </div>
    )
  }

  const hasAnyData = files.playPoints.data || files.purchaseHistory.data || files.promotionHistory.data

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
              Upload your Google Play Store JSON files (any filename accepted)
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Play Points Upload */}
            <FileUploadArea
              type="playPoints"
              label="Play Points JSON File (Optional)"
              description="Auto-detects files with 'playPointsDetails'"
            />

            {/* Purchase History Upload */}
            <FileUploadArea
              type="purchaseHistory"
              label="Purchase History JSON File (Optional)"
              description="Auto-detects files with 'purchaseHistory'"
            />

            {/* Promotion History Upload */}
            <FileUploadArea
              type="promotionHistory"
              label="Promotion History JSON File (Optional)"
              description="Auto-detects files with 'promotionHistory'"
            />

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
                disabled={isLoading || !hasAnyData}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isLoading || !hasAnyData
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
              <li>Upload any JSON file - the system will auto-detect the data type</li>
              <li>Files are automatically detected by their content structure</li>
              <li>You can upload one, two, or all three file types</li>
              <li>Files must contain: playPointsDetails, purchaseHistory, or promotionHistory</li>
              <li>All files are optional - upload at least one to view the dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
