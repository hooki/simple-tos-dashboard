import { useState, useEffect } from "react"
import { createPublicClient, http, formatUnits, parseAbiItem } from "viem"
import { mainnet } from "viem/chains"

const STAKING_CONTRACT_ADDRESS = "0x14fb0933Ec45ecE75A431D10AFAa1DDF7BfeE44C"
const CLAIMABLE_CONTRACT_ADDRESS = "0xD27A68a457005f822863199Af0F817f672588ad6"

const STAKING_ABI = [
  parseAbiItem(
    "function stakingOf(address userAddress) view returns (uint256[])"
  ),
  parseAbiItem("function stakedOf(uint256 index) view returns (uint256)"),
  parseAbiItem("function runwayTos() view returns (uint256)"),
  parseAbiItem("function totalLtos() view returns (uint256)"),
]

const CLAIMABLE_ABI = [
  parseAbiItem(
    "function claimableEther(uint256 tosAmount) view returns (uint256)"
  ),
]

const INTEREST_PER_LTOS = 0.00008704505
const INTEREST_PERIOD_SECONDS = 28800

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export function useRunwayData(refreshKey = 0) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        const [runwayTos, totalLtos] = await Promise.all([
          client.readContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: STAKING_ABI,
            functionName: "runwayTos",
          }),
          client.readContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: STAKING_ABI,
            functionName: "totalLtos",
          }),
        ])

        const totalLtosFloat = Number(formatUnits(totalLtos, 18))
        const runwayTosFloat = Number(formatUnits(runwayTos, 18))

        const interestPerSecond = INTEREST_PER_LTOS / INTEREST_PERIOD_SECONDS
        const totalInterestPerSecond = interestPerSecond * totalLtosFloat

        const remainingSeconds = runwayTosFloat / totalInterestPerSecond
        const remainingDays = remainingSeconds / 86400

        const now = new Date()
        const lastInterestDate = new Date(
          now.getTime() + remainingSeconds * 1000
        )

        setData({
          runwayTos: formatUnits(runwayTos, 18),
          totalLtos: formatUnits(totalLtos, 18),
          remainingDays: remainingDays.toFixed(2),
          lastInterestDate: lastInterestDate.toLocaleString(),
          totalInterestPerSecond: totalInterestPerSecond.toFixed(18),
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [refreshKey])

  return { runwayData: data, isLoading, error }
}

export function useStakingData(addresses, refreshKey = 0) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      if (!addresses || addresses.length === 0) {
        setData({
          grandTotal: "0",
          claimableEth: "0",
          userDetails: [],
        })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        let grandTotalStaked = 0n
        const userDetails = []

        for (const userAddress of addresses) {
          const indexes = await client.readContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: STAKING_ABI,
            functionName: "stakingOf",
            args: [userAddress],
          })

          let userTotalStaked = 0n

          if (indexes.length > 1) {
            for (let i = 1; i < indexes.length; i++) {
              const stakedAmount = await client.readContract({
                address: STAKING_CONTRACT_ADDRESS,
                abi: STAKING_ABI,
                functionName: "stakedOf",
                args: [indexes[i]],
              })
              userTotalStaked += stakedAmount
            }
          }

          userDetails.push({
            address: userAddress,
            total: formatUnits(userTotalStaked, 18),
            indexCount: indexes.length,
          })

          grandTotalStaked += userTotalStaked
        }

        const claimableAmount = await client.readContract({
          address: CLAIMABLE_CONTRACT_ADDRESS,
          abi: CLAIMABLE_ABI,
          functionName: "claimableEther",
          args: [grandTotalStaked],
        })

        setData({
          grandTotal: formatUnits(grandTotalStaked, 18),
          claimableEth: formatUnits(claimableAmount, 18),
          userDetails,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addresses, refreshKey])

  return { stakingData: data, isLoading, error }
}
