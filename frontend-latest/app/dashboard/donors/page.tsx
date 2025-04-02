'use client'
import { useEffect, useState } from 'react'
import AddInventory from './add-inventory'
import moment from 'moment'
import Link from 'next/link'

interface Donation {
  _id: string
  bloodGroup: string
  inventoryType: string
  quantity: number
  email: string
  createdAt: string
}

export default function DonorsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddInventory, setShowAddInventory] = useState(false)

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      
      if (!token || !userId) {
        setError('Authentication token or user ID not found')
        setLoading(false)
        return
      }

      const response = await fetch(`http://localhost:8080/api/v1/inventory/get-inventory`, {
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
        setDonations(data?.inventory || [])
      } else {
        setError(data?.message || 'Failed to fetch donation data')
      }
    } catch (err) {
      console.error('Error fetching donations:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while fetching donation data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Donation Records</h1>
          <Link 
            href="/dashboard/donors/analytics" 
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            View Analytics →
          </Link>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowAddInventory(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Add Donation
          </button>
        </div>
      </div>

      {showAddInventory && (
        <AddInventory
          onSuccess={() => {
            setShowAddInventory(false)
            fetchDonations()
          }}
        />
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Donation Records</h3>
          <p className="mt-1 text-sm text-gray-500">All blood donation records</p>
        </div>
        
        {donations.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No donation records found
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
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time & Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {donation.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        donation.inventoryType === 'in' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {donation.inventoryType === 'in' ? 'Donation' : 'Request'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {donation.quantity} ml
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {donation.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {moment(donation.createdAt).format("DD/MM/YYYY hh:mm A")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}