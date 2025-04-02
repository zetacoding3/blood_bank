'use client'

import { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

interface DonorAnalyticsData {
  totalDonations: number
  bloodGroupData: {
    labels: string[]
    quantities: number[]
  }
  recentDonations: {
    dates: string[]
    counts: number[]
  }
  organizationData: {
    labels: string[]
    counts: number[]
  }
}

export default function DonorAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<DonorAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/v1/analytics/bloodGroups-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setAnalyticsData(data.analyticsData)
      } else {
        setError('Failed to fetch analytics data')
      }
    } catch (err) {
      setError('An error occurred while fetching analytics data')
    } finally {
      setLoading(false)
    }
  }

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

  if (!analyticsData) return null

  const bloodGroupChartData = {
    labels: analyticsData.bloodGroupData.labels,
    datasets: [
      {
        label: 'Blood Group Distribution',
        data: analyticsData.bloodGroupData.quantities,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  const donationTrendData = {
    labels: analyticsData.recentDonations.dates,
    datasets: [
      {
        label: 'Your Donation History',
        data: analyticsData.recentDonations.counts,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const organizationChartData = {
    labels: analyticsData.organizationData.labels,
    datasets: [
      {
        label: 'Organizations You Donated To',
        data: analyticsData.organizationData.counts,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Total Donations</h3>
        <p className="mt-2 text-3xl font-semibold text-red-600">{analyticsData.totalDonations}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Group Distribution</h3>
          <div className="h-80">
            <Bar
              data={bloodGroupChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Donation History</h3>
          <div className="h-80">
            <Line
              data={donationTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Organizations You Donated To</h3>
        <div className="h-80">
          <Bar
            data={organizationChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}