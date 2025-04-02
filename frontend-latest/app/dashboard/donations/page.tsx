'use client'

import { useEffect, useState } from 'react'
import DonorAnalytics from './analytics'

interface Donation {
  _id: string
  bloodGroup: string
  inventoryType: string
  quantity: number
  email: string
  createdAt: string
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        
        const response = await fetch('http://localhost:8080/api/v1/inventory/get-recent-inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filters: {
              inventoryType: 'in',
              donar: userId,
            },
          }),
        })
        
        const data = await response.json()
       
        if (data.success) {
          setDonations(data.inventory)
        } else {
          setError('Failed to fetch donations')
        }
      } catch (err) {
        setError('An error occurred while fetching donations')
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
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

  const [activeTab, setActiveTab] = useState<'donations' | 'analytics'>('donations')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Donations</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              activeTab === 'donations' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Donations
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
      
      {activeTab === 'analytics' && <DonorAnalytics />}
      
      {activeTab === 'donations' && (

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Donation History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your blood donation records</p>
        </div>
        
        {donations.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            You haven't made any donations yet.
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
                {donations.map((donation) => {
                  // Format date using JavaScript Date object
                  const date = new Date(donation.createdAt)
                  const formattedDate = date.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  
                  return (
                    <tr key={donation._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {donation.bloodGroup}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.inventoryType === 'in' ? 'Donation' : 'Usage'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.email}
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