'use client'

import { useEffect, useState } from 'react'
import HospitalAnalytics from './analytics'

interface ConsumerRecord {
  _id: string
  bloodGroup: string
  inventoryType: string
  quantity: number
  email: string
  createdAt: string
}

export default function ConsumerPage() {
  const [records, setRecords] = useState<ConsumerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'consumption' | 'analytics'>('consumption')

  useEffect(() => {
    const fetchConsumerRecords = async () => {
      try {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        
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
          setRecords(data.inventory)
        } else {
          setError('Failed to fetch consumer records')
        }
      } catch (err) {
        setError('An error occurred while fetching consumer records')
      } finally {
        setLoading(false)
      }
    }

    fetchConsumerRecords()
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Blood Consumption</h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('consumption')}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              activeTab === 'consumption' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              activeTab === 'analytics' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {activeTab === 'analytics' && <HospitalAnalytics />}
      
      {activeTab === 'consumption' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Usage Records</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your hospital's blood usage history</p>
          </div>
          
          {records.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No blood usage records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Group
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity (ml)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => {
                    const date = new Date(record.createdAt)
                    const formattedDate = date.toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    
                    return (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          {record.bloodGroup}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.inventoryType === 'in' ? 'Donation' : 'Usage'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formattedDate}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}