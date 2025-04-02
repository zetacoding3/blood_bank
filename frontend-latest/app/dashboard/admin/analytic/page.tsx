'use client'

import { useEffect, useState } from 'react'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
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

interface BloodGroupData {
  bloodGroup: string
  totalIn: number
  totalOut: number
  availabeBlood: number
}

interface Transaction {
  _id: string
  bloodGroup: string
  quantity: number
  inventoryType: 'in' | 'out'
  donar?: string
  hospital?: string
  createdAt: string
}

interface StatsData {
  totalDonations: number
  totalUsed: number
  totalAvailable: number
  totalDonors: number
  totalHospitals: number
  recentTransactions: Transaction[]
}

export default function Analytics() {
  const [bloodGroupData, setBloodGroupData] = useState<BloodGroupData[]>([])
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      
      if (!token || !userId) {
        throw new Error('Authentication token or user ID not found')
      }

      // Helper function to safely parse JSON responses
      const safeJsonParse = async (response: Response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
        const text = await response.text()
        try {
          return JSON.parse(text)
        } catch (e) {
          console.error('Invalid JSON response:', text.substring(0, 100) + '...')
          throw new Error('Invalid JSON response from server')
        }
      }

      // Fetch blood group data - using GET method as defined in analyticsRoutes.js
      // The userId will be sent in the authorization header and extracted by the authMiddleware
      const bloodGroupResponse = await fetch(`http://localhost:8080/api/v1/analytics/bloodGroups-data?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      
      // Fetch stats data - using GET method as defined in analyticsRoutes.js
      const statsResponse = await fetch(`http://localhost:8080/api/v1/analytics/stats?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      
      const bloodGroupResult = await safeJsonParse(bloodGroupResponse)
      const statsResult = await safeJsonParse(statsResponse)
      
      console.log('Blood Group Data:', bloodGroupResult)
      console.log('Stats Data:', statsResult)
      
      if (bloodGroupResult.success) {
        setBloodGroupData(bloodGroupResult.bloodGroupData || [])
      } else {
        console.error('Failed to fetch blood group data:', bloodGroupResult.message)
      }
      
      if (statsResult.success) {
        setStatsData(statsResult.data || null)
      } else {
        console.error('Failed to fetch stats data:', statsResult.message)
      }
      
      if (!bloodGroupResult.success && !statsResult.success) {
        setError('Failed to fetch analytics data')
      }
    } catch (err: any) {
      console.error('Error fetching analytics data:', err)
      setError(err.message || 'An error occurred while fetching analytics data')
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

  // Prepare chart data
  const bloodGroupLabels = bloodGroupData.map(item => item.bloodGroup)
  
  const bloodAvailabilityData = {
    labels: bloodGroupLabels,
    datasets: [
      {
        label: 'Available Blood (units)',
        data: bloodGroupData.map(item => item.availabeBlood),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }
  
  const bloodInOutData = {
    labels: bloodGroupLabels,
    datasets: [
      {
        label: 'Blood Collected (IN)',
        data: bloodGroupData.map(item => item.totalIn),
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 1,
      },
      {
        label: 'Blood Used (OUT)',
        data: bloodGroupData.map(item => item.totalOut),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }
  
  const bloodDistributionData = {
    labels: bloodGroupLabels,
    datasets: [
      {
        label: 'Blood Group Distribution',
        data: bloodGroupData.map(item => item.availabeBlood),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Blood Bank Analytics</h1>
      
      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Total Blood Collected</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">{statsData.totalDonations} units</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Total Blood Used</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">{statsData.totalUsed} units</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Available Blood</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">{statsData.totalAvailable} units</p>
          </div>
        </div>
      )}
      
      {/* Secondary Stats */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Total Donors</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">{statsData.totalDonors}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Total Hospitals</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">{statsData.totalHospitals}</p>
          </div>
        </div>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Blood by Group</h3>
          <div className="h-80">
            <Bar
              data={bloodAvailabilityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Available Blood Units by Blood Group',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Collection vs Usage</h3>
          <div className="h-80">
            <Bar
              data={bloodInOutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Blood Collection vs Usage by Blood Group',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Group Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <div style={{ width: '80%', height: '100%' }}>
              <Doughnut
                data={bloodDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                    title: {
                      display: true,
                      text: 'Blood Group Distribution',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        {statsData && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statsData.recentTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.inventoryType === 'in' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.inventoryType === 'in' ? 'Donation' : 'Usage'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.bloodGroup}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.quantity} units
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}