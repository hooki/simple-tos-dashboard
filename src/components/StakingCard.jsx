import React, { useMemo } from "react"

function calculateCompoundReturns(principal, days) {
  if (!principal || !days || principal <= 0 || days <= 0) {
    return { finalProfit: 0, finalAmount: 0 }
  }

  const INTEREST_RATE = 0.00008704505
  const PERIODS_PER_DAY = 3

  const finalPeriods = days * PERIODS_PER_DAY
  const finalAmount = principal * Math.pow(1 + INTEREST_RATE, finalPeriods)
  const finalProfit = finalAmount - principal

  return { finalProfit, finalAmount }
}

export default function StakingCard({ data, runwayData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Staking Summary</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const expectedReturns = useMemo(() => {
    if (!data || !runwayData) return null

    const principal = Number(data.grandTotal)
    const days = Number(runwayData.remainingDays)

    return calculateCompoundReturns(principal, days)
  }, [data, runwayData])

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Staking Summary</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Staking Summary</h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm mb-1">Total Staked</p>
          <p className="text-3xl font-bold text-purple-600">
            {Number(data.grandTotal).toLocaleString()} TOS
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-500 text-sm mb-1">Claimable ETH</p>
          <p className="text-3xl font-bold text-orange-600">
            {Number(data.claimableEth).toFixed(6)} ETH
          </p>
        </div>

        {expectedReturns && expectedReturns.finalProfit > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-500 text-sm mb-1">
              Expected Returns ({runwayData?.remainingDays} days)
            </p>
            <p className="text-2xl font-bold text-green-600">
              +{Number(expectedReturns.finalProfit).toLocaleString()} TOS
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Final: {Number(expectedReturns.finalAmount).toLocaleString()} TOS
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Tracking {data.userDetails?.length || 0} address(es)
          </p>
        </div>
      </div>
    </div>
  )
}
