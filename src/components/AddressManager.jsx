import React, { useState } from "react"
import { isAddress } from "viem"

export default function AddressManager({ addresses, setAddresses }) {
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")

  const handleAdd = () => {
    setError("")

    if (!inputValue.trim()) {
      setError("Please enter an address")
      return
    }

    if (!isAddress(inputValue.trim())) {
      setError("Invalid Ethereum address")
      return
    }

    const normalizedAddress = inputValue.trim()

    if (addresses.includes(normalizedAddress)) {
      setError("Address already added")
      return
    }

    setAddresses([...addresses, normalizedAddress])
    setInputValue("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  return (
    <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Address Management</h2>

      <div className="flex gap-3 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Ethereum address (0x...)"
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-full transition font-medium"
        >
          Add Address
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="mt-4">
        <p className="text-gray-500 text-sm">
          Total addresses: {addresses.length}
        </p>
      </div>
    </div>
  )
}
