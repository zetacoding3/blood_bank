'use client'

import { useEffect, useState } from 'react'
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
)

interface OrganizationAnalyticsData {
  bloodGroupData: {
    labels: string[]
    available: number[]
    donated: number[]
    used: number[]
  }
  stats: {
    totalDonations: number
    totalUsage: number
    totalAvailable: number
    recentActivity: {
      dates: string[]
      donations: number[]
      usage: number[]
    }
    hospitalData: {
      labels: string[]
      counts: number[]
    }
    donorData: {
      labels: string[]
      counts: number[]
    }
  }
}

export default function OrganizationAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<OrganizationAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        
        // Fetch blood groups data
        const bloodGroupsResponse = await fetch('http://localhost:8080/api/v1/analytics/bloodGroups-data', {
          headers
        })
        const bloodGroupsData = await bloodGroupsResponse.json()

        // Fetch stats data
        const statsResponse = await fetch('http://localhost:8080/api/v1/analytics/stats', {
          headers
        })
        const statsData = await statsResponse.json()

        if (bloodGroupsData.success && statsData.success) {
          setAnalyticsData({
            bloodGroupData: bloodGroupsData.data,
            stats: statsData.data
          })
        } else {
          setError('Failed to fetch analytics data')
        }
      } catch (err) {
        setError('An error occurred while fetching analytics data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  if (!analyticsData?.bloodGroupData || !analyticsData?.stats) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No analytics data available</span>
      </div>
    )
  }

  const bloodGroupChartData = {
    labels: analyticsData.bloodGroupData?.labels || [],
    datasets: [
      {
        label: 'Available',
        data: analyticsData.bloodGroupData?.available || [],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
      {
        label: 'Donated',
        data: analyticsData.bloodGroupData?.donated || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Used',
        data: analyticsData.bloodGroupData?.used || [],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  const activityTrendData = {
    labels: analyticsData.stats.recentActivity?.dates || [],
    datasets: [
      {
        label: 'Donations',
        data: analyticsData.stats.recentActivity?.donations || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Usage',
        data: analyticsData.stats.recentActivity?.usage || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const hospitalChartData = {
    labels: analyticsData.stats.hospitalData?.labels || [],
    datasets: [
      {
        label: 'Blood Units Provided to Hospitals',
        data: analyticsData.stats.hospitalData?.counts || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(59, 130, 246, 0.5)', 
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const donorChartData = {
    labels: analyticsData.stats.donorData?.labels || [],
    datasets: [
      {
        label: 'Top Donors',
        data: analyticsData.stats.donorData?.counts || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Organization Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Donations</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{analyticsData.stats.totalDonations || 0} units</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Usage</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{analyticsData.stats.totalUsage || 0} units</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Available Blood</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{analyticsData.stats.totalAvailable || 0} units</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Group Statistics</h3>
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
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="h-80">
            <Line
              data={activityTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Distribution</h3>
          <div className="h-80">
            <Doughnut
              data={hospitalChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Donors</h3>
          <div className="h-80">
            <Bar
              data={donorChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y' as const,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}