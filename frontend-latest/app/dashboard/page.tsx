'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalDonations: number
  totalUsed: number
  totalAvailable: number
  totalDonors: number
  totalHospitals: number
  recentTransactions: Array<{
    inventoryType: string
    bloodGroup: string
    quantity: number
    createdAt: string
  }>
}

const initialStats: Stats = {
  totalDonations: 0,
  totalUsed: 0,
  totalAvailable: 0,
  totalDonors: 0,
  totalHospitals: 0,
  recentTransactions: []
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(initialStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Authentication token not found')
        }

        const response = await fetch('http://localhost:8080/api/v1/analytics/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }

        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch statistics')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Total Donations</h2>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.totalDonations}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Total Used</h2>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.totalUsed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Blood Units Available</h2>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.totalAvailable}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Total Donors</h2>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.totalDonors}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Total Hospitals</h2>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.totalHospitals}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentTransactions.map((transaction, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.inventoryType === 'in' ? 'Donation' : 'Usage'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.bloodGroup} • {transaction.quantity} units
                  </p>
                </div>
                <p className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}