import React from "react"

export default function RunwayCard({ data, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Runway Information</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Runway Information</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600 font-semibold mb-1">Error loading data</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Runway Information</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Runway Information</h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm mb-1">Runway TOS</p>
          <p className="text-2xl font-bold text-blue-600">
            {Number(data.runwayTos).toLocaleString()} TOS
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">Total LTOS</p>
          <p className="text-2xl font-bold text-green-600">
            {Number(data.totalLtos).toLocaleString()} LTOS
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-500 text-sm mb-1">Remaining Days</p>
          <p className="text-3xl font-bold text-orange-600">
            {data.remainingDays} days
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">Last Interest Date</p>
          <p className="text-lg font-medium text-gray-900">{data.lastInterestDate}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">Interest Per Second for All Stakers</p>
          <p className="text-sm font-mono text-gray-700">{data.totalInterestPerSecond} TOS/s</p>
        </div>
      </div>
    </div>
  )
}
