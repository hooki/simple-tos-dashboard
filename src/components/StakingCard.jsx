import React, { useMemo, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function calculateCompoundReturns(principal, days) {
  if (!principal || !days || principal <= 0 || days <= 0) {
    return {
      dataPoints: [],
      milestones: [],
      finalProfit: 0,
      finalAmount: 0,
    }
  }

  const INTEREST_RATE = 0.00008704505
  const PERIODS_PER_DAY = 3
  const dataPoints = []
  const milestones = []
  const today = new Date()

  // Milestone 지점 (25%, 50%, 75%)
  const milestonePercentages = [0.25, 0.5, 0.75]
  const milestoneDays = milestonePercentages.map((p) => Math.floor(days * p))

  const interval = Math.max(1, Math.floor(days / 50))

  for (let day = 0; day <= days; day += interval) {
    const periods = day * PERIODS_PER_DAY
    const amount = principal * Math.pow(1 + INTEREST_RATE, periods)
    const profit = amount - principal
    const isMilestone = milestoneDays.includes(day)
    const futureDate = new Date(today.getTime() + day * 24 * 60 * 60 * 1000)

    dataPoints.push({
      day,
      profit,
      amount,
      isMilestone,
      date: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })

    if (isMilestone) {
      milestones.push({
        day,
        profit,
        amount,
        date: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
    }
  }

  // Milestone 지점 명시적 추가
  milestoneDays.forEach((day) => {
    const exists = dataPoints.find((d) => d.day === day)
    if (!exists) {
      const periods = day * PERIODS_PER_DAY
      const amount = principal * Math.pow(1 + INTEREST_RATE, periods)
      const profit = amount - principal
      const futureDate = new Date(today.getTime() + day * 24 * 60 * 60 * 1000)

      dataPoints.push({
        day,
        profit,
        amount,
        isMilestone: true,
        date: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })

      milestones.push({
        day,
        profit,
        amount,
        date: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
    }
  })

  const finalPeriods = days * PERIODS_PER_DAY
  const finalAmount = principal * Math.pow(1 + INTEREST_RATE, finalPeriods)
  const finalProfit = finalAmount - principal
  const finalDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

  dataPoints.push({
    day: days,
    profit: finalProfit,
    amount: finalAmount,
    isMilestone: false,
    date: finalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  })

  dataPoints.sort((a, b) => a.day - b.day)
  milestones.sort((a, b) => a.day - b.day)

  return { dataPoints, milestones, finalProfit, finalAmount }
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-900">Day {data.day}</p>
        <p className="text-xs text-gray-500">{data.date}</p>
        <p className="text-xs text-purple-600">
          +{Number(data.profit).toLocaleString()} TOS
        </p>
        <p className="text-xs text-gray-700">
          Total: {Number(data.amount).toLocaleString()} TOS
        </p>
      </div>
    )
  }
  return null
}

export default function StakingCard({ data, runwayData, isLoading }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const expectedReturns = useMemo(() => {
    if (!data || !runwayData) return null

    const principal = Number(data.grandTotal)
    const days = Number(runwayData.remainingDays)

    return calculateCompoundReturns(principal, days)
  }, [data, runwayData])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Staking Summary
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Staking Summary
        </h2>
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="flip-card-container" style={{ minHeight: "400px" }}>
      <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
        {/* 앞면 */}
        <div className="flip-card-front">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full relative">
            {/* 토글 버튼 */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition z-10"
              title="Show chart"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Staking Summary
            </h2>

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
                    Final:{" "}
                    {Number(expectedReturns.finalAmount).toLocaleString()} TOS
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
        </div>

        {/* 뒷면 */}
        <div className="flip-card-back">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full relative">
            {/* 토글 버튼 */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition z-10"
              title="Show summary"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Expected Returns Chart
            </h2>

            {expectedReturns &&
            expectedReturns.dataPoints &&
            expectedReturns.dataPoints.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={expectedReturns.dataPoints}>
                    <defs>
                      <linearGradient
                        id="profitGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="day"
                      label={{ value: "Days", position: "insideBottom", offset: -5 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        `${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#9333ea"
                      strokeWidth={2}
                      fill="url(#profitGradient)"
                      dot={(props) => {
                        const { cx, cy, payload } = props
                        if (payload.isMilestone) {
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={5}
                              fill="#9333ea"
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          )
                        }
                        return null
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {expectedReturns.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="text-center p-2 bg-purple-50 rounded"
                    >
                      <p className="text-xs text-gray-600">Day {m.day}</p>
                      <p className="text-xs text-gray-400">{m.date}</p>
                      <p className="text-sm font-bold text-purple-600">
                        +{Number(m.profit).toLocaleString(0)} TOS
                      </p>
                      <p className="text-xs text-gray-500">
                        Total: {Number(m.amount).toLocaleString(0)} TOS
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">No chart data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
