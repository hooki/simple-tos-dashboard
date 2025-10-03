import React from "react"

export default function AddressTable({
  addresses,
  stakingData,
  isLoading,
  onRemove,
}) {
  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Address Details</h2>
        <p className="text-gray-500">No addresses added yet</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Address Details</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Address Details</h2>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-600 font-medium">
              Address
            </th>
            <th className="text-right py-3 px-4 text-gray-600 font-medium">
              Total Staked
            </th>
            <th className="text-right py-3 px-4 text-gray-600 font-medium">
              Index Count
            </th>
            <th className="text-center py-3 px-4 text-gray-600 font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {stakingData?.userDetails?.map((user, index) => (
            <tr key={user.address} className="border-b border-gray-200">
              <td className="py-3 px-4 font-mono text-sm text-gray-900">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </td>
              <td className="py-3 px-4 text-right font-semibold text-gray-900">
                {Number(user.total).toLocaleString()} TOS
              </td>
              <td className="py-3 px-4 text-right text-gray-600">
                {user.indexCount > 1 ? user.indexCount - 1 : 0}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onRemove(user.address)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
