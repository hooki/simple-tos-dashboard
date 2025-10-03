import React, { useState, useEffect, useRef } from "react"
import RunwayCard from "./components/RunwayCard"
import StakingCard from "./components/StakingCard"
import AddressManager from "./components/AddressManager"
import AddressTable from "./components/AddressTable"
import { useRunwayData, useStakingData } from "./hooks/useContracts"

export default function App() {
  const [addresses, setAddresses] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const isInitialMount = useRef(true)

  useEffect(() => {
    const saved = localStorage.getItem("tos-lens-addresses")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAddresses(parsed)
        console.log("Loaded addresses from localStorage:", parsed)
      } catch (e) {
        console.error("Failed to load addresses:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    localStorage.setItem("tos-lens-addresses", JSON.stringify(addresses))
    console.log("Saved addresses to localStorage:", addresses)
  }, [addresses])

  const { runwayData, isLoading: runwayLoading, error: runwayError } = useRunwayData(refreshKey)
  const { stakingData, isLoading: stakingLoading, error: stakingError } = useStakingData(
    addresses,
    refreshKey
  )

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TONStarter Tokenomics Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            A more comprehensive dashboard showing TONStarter($TOS) token details and other liquidity metrics with easy explanations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Real-Time TOS Staking Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RunwayCard data={runwayData} isLoading={runwayLoading} error={runwayError} />
          <StakingCard data={stakingData} runwayData={runwayData} isLoading={stakingLoading} error={stakingError} />
        </div>

        <AddressManager addresses={addresses} setAddresses={setAddresses} />

        <AddressTable
          addresses={addresses}
          stakingData={stakingData}
          isLoading={stakingLoading}
          onRemove={(address) =>
            setAddresses(addresses.filter((a) => a !== address))
          }
        />
      </div>
    </div>
  )
}
