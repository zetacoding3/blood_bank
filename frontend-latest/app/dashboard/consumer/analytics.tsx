'use client'
import { useEffect, useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
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

interface ConsumerRecord {
  _id: string
  bloodGroup: string
  inventoryType: string
  quantity: number
  email: string
  createdAt: string
}

interface AnalyticsData {
  totalConsumption: number
  bloodGroupData: {
    labels: string[]
    quantities: number[]
  }
  recentConsumption: {
    dates: string[]
    counts: number[]
  }
  organizationData: {
    labels: string[]
    counts: number[]
  }
}

export default function HospitalAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const processAnalyticsData = async () => {
      try {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        
        if (!token || !userId) {
          setError('Authentication token not found')
          return
        }

        const response = await fetch('http://localhost:8080/api/v1/inventory/get-inventory-hospital', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filters: {
              inventoryType: 'out',
              hospital: userId,
            },
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          const records: ConsumerRecord[] = data.inventory
          // Calculate total consumption
          const totalConsumption = records.reduce((sum, record) => sum + record.quantity, 0)

          // Process blood group data
          const bloodGroups = records.reduce((acc: { [key: string]: number }, record) => {
            acc[record.bloodGroup] = (acc[record.bloodGroup] || 0) + record.quantity
            return acc
          }, {})

          // Process recent consumption (last 7 days)
          const last7Days = new Array(7).fill(0).map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            return d.toISOString().split('T')[0]
          }).reverse()

          const dailyCounts = records.reduce((acc: { [key: string]: number }, record) => {
            const date = record.createdAt.split('T')[0]
            acc[date] = (acc[date] || 0) + record.quantity
            return acc
          }, {})

          // Process organization data
          const organizations = records.reduce((acc: { [key: string]: number }, record) => {
            acc[record.email] = (acc[record.email] || 0) + record.quantity
            return acc
          }, {})

          setAnalyticsData({
            totalConsumption,
            bloodGroupData: {
              labels: Object.keys(bloodGroups),
              quantities: Object.values(bloodGroups)
            },
            recentConsumption: {
              dates: last7Days,
              counts: last7Days.map(date => dailyCounts[date] || 0)
            },
            organizationData: {
              labels: Object.keys(organizations),
              counts: Object.values(organizations)
            }
          })
        } else {
          setError('Failed to fetch analytics data')
        }
      } catch (err) {
        console.error('Analytics Error:', err)
        setError('An error occurred while processing analytics data')
      } finally {
        setLoading(false)
      }
    }

    processAnalyticsData()
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
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No analytics data available</span>
      </div>
    )
  }

  const bloodGroupChartData = {
    labels: analyticsData.bloodGroupData.labels,
    datasets: [
      {
        label: 'Blood Group Consumption',
        data: analyticsData.bloodGroupData.quantities,
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(139, 92, 246, 0.5)',
          'rgba(236, 72, 153, 0.5)',
          'rgba(75, 85, 99, 0.5)',
          'rgba(209, 213, 219, 0.5)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(75, 85, 99)',
          'rgb(209, 213, 219)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const consumptionTrendData = {
    labels: analyticsData.recentConsumption.dates,
    datasets: [
      {
        label: 'Recent Blood Consumption',
        data: analyticsData.recentConsumption.counts,
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
        label: 'Organizations You Received From',
        data: analyticsData.organizationData.counts,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Hospital Analytics Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Total Blood Consumption</h3>
        <p className="mt-2 text-3xl font-semibold text-red-600">{analyticsData.totalConsumption} units</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Group Distribution</h3>
          <div className="h-80">
            <Pie
              data={bloodGroupChartData}
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Consumption Trends</h3>
          <div className="h-80">
            <Line
              data={consumptionTrendData}
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Organizations You Received Blood From</h3>
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
