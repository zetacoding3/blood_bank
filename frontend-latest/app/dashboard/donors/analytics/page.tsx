'use client'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface BloodGroupData {
  bloodGroup: string
  quantity: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bloodGroupData, setBloodGroupData] = useState<BloodGroupData[]>([])
  const [totalQuantity, setTotalQuantity] = useState(0)

  useEffect(() => {
    const fetchBloodInventory = async () => {
      try {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        
        if (!token || !userId) {
          setError('Authentication token or user ID not found')
          setLoading(false)
          return
        }

        const response = await fetch('http://localhost:8080/api/v1/inventory/get-inventory', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data?.success) {
          // Process the inventory data to get blood group quantities
          const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
          const groupedData: BloodGroupData[] = bloodGroups.map(group => {
            // Filter inventory items by blood group and sum quantities
            const groupItems = data.inventory.filter((item: any) => item.bloodGroup === group)
            const inQuantity = groupItems
              .filter((item: any) => item.inventoryType === 'in')
              .reduce((sum: number, item: any) => sum + item.quantity, 0)
            
            const outQuantity = groupItems
              .filter((item: any) => item.inventoryType === 'out')
              .reduce((sum: number, item: any) => sum + item.quantity, 0)
            
            // Available quantity is in minus out
            const availableQuantity = inQuantity - outQuantity
            
            return {
              bloodGroup: group,
              quantity: availableQuantity > 0 ? availableQuantity : 0 // Ensure no negative values
            }
          })
          
          setBloodGroupData(groupedData)
          setTotalQuantity(groupedData.reduce((sum, item) => sum + item.quantity, 0))
        } else {
          setError(data?.message || 'Failed to fetch inventory data')
        }
      } catch (err) {
        console.error('Error fetching blood inventory:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching inventory data')
      } finally {
        setLoading(false)
      }
    }

    fetchBloodInventory()
  }, [])

  // Prepare data for pie chart
  const pieChartData = {
    labels: bloodGroupData.map(item => item.bloodGroup),
    datasets: [
      {
        label: 'Available Blood (ml)',
        data: bloodGroupData.map(item => item.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for bar chart
  const barChartData = {
    labels: bloodGroupData.map(item => item.bloodGroup),
    datasets: [
      {
        label: 'Available Blood (ml)',
        data: bloodGroupData.map(item => item.quantity),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Blood Inventory by Group',
      },
    },
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Blood Inventory Analytics</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Total Available Blood: {totalQuantity} ml</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {bloodGroupData.map((item) => (
            <div key={item.bloodGroup} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-red-600">{item.bloodGroup}</div>
                <div className="text-gray-700">{item.quantity} ml</div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${(item.quantity / Math.max(...bloodGroupData.map(d => d.quantity), 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Blood Group Distribution</h2>
          <div className="h-80">
            <Pie data={pieChartData} />
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Blood Quantity by Group</h2>
          <div className="h-80">
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Blood Inventory Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Quantity (ml)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bloodGroupData.map((item) => (
                <tr key={item.bloodGroup}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.bloodGroup}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.quantity} ml</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {totalQuantity > 0 ? ((item.quantity / totalQuantity) * 100).toFixed(2) : 0}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}