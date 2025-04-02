'use client'

import { useEffect, useState } from 'react'
import OrganizationAnalytics from './analytics'

interface InventoryItem {
  bloodGroup: string
  quantity: number
  lastUpdated: string
}

interface DonationRecord {
  donorName: string
  bloodGroup: string
  quantity: number
  donationDate: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [donations, setDonations] = useState<DonationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics'>('inventory')
  const [newDonation, setNewDonation] = useState({
    email: '',
    bloodGroup: 'A+',
    quantity: 1,
    inventoryType: 'in', // Default to 'in' for donations
  })

  useEffect(() => {
    const initializePage = async () => {
      try {
        const userRole = localStorage.getItem('role')
        // Set inventory type based on user role
        if (userRole === 'donar') {
          setNewDonation(prev => ({ ...prev, inventoryType: 'in' }))
        } else if (userRole === 'hospital') {
          setNewDonation(prev => ({ ...prev, inventoryType: 'out' }))
        }
        
        await Promise.all([fetchInventory(), fetchDonations()])
      } catch (err) {
        console.error('Error initializing page:', err)
      } finally {
        setLoading(false)
      }
    }
    
    initializePage()
  }, [])

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication token not found')
        return
      }

      const response = await fetch('http://localhost:8080/api/v1/inventory/get-inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setInventory(data.inventory || [])
      } else {
        setError(data.message || 'Failed to fetch inventory')
      }
    } catch (err) {
      setError('An error occurred while fetching inventory')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      const response = await fetch('http://localhost:8080/api/v1/inventory/get-recent-inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && Array.isArray(data.donations)) {
        setDonations(data.donations)
      } else {
        console.error('Invalid donations data received:', data)
        setDonations([])
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err)
      setDonations([])
    }
  }

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const userEmail = localStorage.getItem('email')
      
      if (!token || !userId) {
        setError('Authentication token not found')
        return
      }

      // Fix: Update request data to match backend expectations
      const requestData = {
        bloodGroup: newDonation.bloodGroup,
        quantity: newDonation.quantity,
        email: newDonation.email || userEmail || '',
        inventoryType: newDonation.inventoryType,
        // For 'out' type, we need to include hospital and organisation
        ...(newDonation.inventoryType === 'out' && {
          hospital: userId,
          organisation: userId // This might need to be the actual organisation ID
        }),
        // For 'in' type, we need to include donor
        ...(newDonation.inventoryType === 'in' && {
          donor: userId
        })
      }

      console.log('Sending inventory data:', requestData)

      const response = await fetch('http://localhost:8080/api/v1/inventory/create-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        // Reset form
        setNewDonation({
          email: '',
          bloodGroup: 'A+',
          quantity: 1,
          inventoryType: newDonation.inventoryType, // Keep the current inventory type
        })
        // Refresh data
        await Promise.all([fetchInventory(), fetchDonations()])
        setError('')
      } else {
        setError(data.message || 'Failed to add inventory record')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding inventory record')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              activeTab === 'inventory' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Inventory
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
      
      {activeTab === 'analytics' && <OrganizationAnalytics />}
      
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Current Blood Stock</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {inventory.map((item) => (
                  <div key={item.bloodGroup} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-red-600">{item.bloodGroup}</h3>
                    <p className="text-gray-600">{item.quantity} units</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {newDonation.inventoryType === 'in' ? 'Add New Donation' : 'Request Blood'}
              </h2>
            </div>
            <form onSubmit={handleDonationSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {newDonation.inventoryType === 'in' ? 'Donor Email' : 'Hospital Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  value={newDonation.email}
                  onChange={(e) => setNewDonation({ ...newDonation, email: e.target.value })}
                  placeholder="Leave empty to use your email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  id="bloodGroup"
                  value={newDonation.bloodGroup}
                  onChange={(e) => setNewDonation({ ...newDonation, bloodGroup: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity (units)</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={newDonation.quantity}
                  onChange={(e) => setNewDonation({ ...newDonation, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {newDonation.inventoryType === 'in' ? 'Add Donation' : 'Request Blood'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Donations</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {donations.length > 0 ? (
                donations.map((donation, index) => (
                  <div key={`${donation.donorName}-${index}`} className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{donation.donorName}</p>
                        <p className="text-sm text-gray-500">{donation.bloodGroup} • {donation.quantity} units</p>
                      </div>
                      <p className="text-sm text-gray-500">{new Date(donation.donationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-center text-gray-500">No recent donations</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}