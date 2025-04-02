'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface BloodRequest {
  _id: string
  bloodGroup: string
  quantity: number
  status: 'pending' | 'approved' | 'rejected'
  requestDate: string
  organisation?: {
    organisationName: string
    email: string
    phone: string
  }
}

interface BloodAvailability {
  bloodGroup: string
  quantity: number
}

interface Organization {
  _id: string
  organisationName: string
}

interface NewRequest {
  bloodGroup: string
  quantity: number
  hospitalEmail: string
  inventoryType: string
}

export default function RequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bloodAvailability, setBloodAvailability] = useState<BloodAvailability[]>([])
  const [newRequest, setNewRequest] = useState<NewRequest>({
    bloodGroup: 'A+',
    quantity: 1,
    hospitalEmail: '',
    inventoryType: 'out'
  })

  useEffect(() => {
    const checkUserAndInitialize = async () => {
      const userRole = localStorage.getItem('role')
      if (userRole !== 'hospital') {
        setError('Only hospitals can request blood from inventory')
        setLoading(false)
        return
      }
      
      try {
        await Promise.all([
          fetchRequests(),
          fetchBloodAvailability()
        ])
      } catch (err) {
        console.error('Error initializing page:', err)
        setError('Failed to initialize page')
      } finally {
        setLoading(false)
      }
    }

    checkUserAndInitialize()
  }, [])

  const fetchBloodAvailability = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
    
      // Use the inventory endpoint to calculate blood availability instead
      const response = await fetch('http://localhost:8080/api/v1/inventory/get-inventory', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success && data.inventory) {
        // Calculate blood availability from inventory data
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        const availabilityMap = new Map()
        
        // Initialize all blood groups with 0 quantity
        bloodGroups.forEach(group => availabilityMap.set(group, 0))
        
        // Calculate total available blood for each group
        data.inventory.forEach((item: any) => {
          if (item.bloodGroup) {
            const currentQuantity = availabilityMap.get(item.bloodGroup) || 0
            if (item.inventoryType === 'in') {
              availabilityMap.set(item.bloodGroup, currentQuantity + item.quantity)
            } else if (item.inventoryType === 'out') {
              availabilityMap.set(item.bloodGroup, currentQuantity - item.quantity)
            }
          }
        })
        
        // Convert map to array of objects
        const bloodAvailabilityData = Array.from(availabilityMap.entries()).map(([bloodGroup, quantity]) => ({
          bloodGroup,
          quantity: Math.max(0, quantity) // Ensure no negative values
        }))
        
        setBloodAvailability(bloodAvailabilityData)
      }
    } catch (err) {
      console.error('Error fetching blood availability:', err)
      throw err
    }
  }

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('http://localhost:8080/api/v1/inventory/get-inventory', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setRequests(data.inventory || [])
        setError('')
      } else {
        throw new Error(data.message || 'Failed to fetch requests')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to server'
      setError(errorMessage)
      throw err
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('role')
      
      if (!token || !userId) {
        router.push('/login')
        return
      }
      
      if (userRole !== 'hospital') {
        throw new Error('Only hospitals can request blood from inventory')
      }

      // Check if requested blood is available
      const requestedBloodGroup = newRequest.bloodGroup
      const requestedQuantity = newRequest.quantity
      const availableBlood = bloodAvailability.find(item => item.bloodGroup === requestedBloodGroup)
      
      if (!availableBlood || availableBlood.quantity < requestedQuantity) {
        throw new Error(`Not enough ${requestedBloodGroup} blood available. Only ${availableBlood ? availableBlood.quantity : 0} ml available.`)
      }

      const requestData = {
        bloodGroup: newRequest.bloodGroup,
        quantity: newRequest.quantity,
        email: newRequest.hospitalEmail || localStorage.getItem('email') || '',
        inventoryType: 'out',
        hospital: userId
        // No organization field - let the backend handle it
      }

      const response = await fetch('http://localhost:8080/api/v1/inventory/create-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        setNewRequest({
          bloodGroup: 'A+',
          hospitalEmail: '',
          quantity: 1,
          inventoryType: 'out'
        })
        await fetchRequests()
      } else {
        throw new Error(data.message || 'Failed to create request')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request')
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

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-gray-900">Blood Requests</h1>

      {/* Keep the blood availability section unchanged */}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Create New Request</h2>
        </div>
        <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {/* Remove the organization selection dropdown */}
          <div>
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
            <select
              id="bloodGroup"
              value={newRequest.bloodGroup}
              onChange={(e) => setNewRequest({ ...newRequest, bloodGroup: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              required
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          {/* Keep the rest of the form fields unchanged */}
          <div>
            <label htmlFor="hospitalEmail" className="block text-sm font-medium text-gray-700">Hospital Email</label>
            <input
              type="email"
              id="hospitalEmail"
              value={newRequest.hospitalEmail}
              onChange={(e) => setNewRequest({ ...newRequest, hospitalEmail: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Leave empty to use your email"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity (units)</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={newRequest.quantity}
              onChange={(e) => setNewRequest({ ...newRequest, quantity: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Requests</h2>
        </div>
        {requests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{request.bloodGroup}</span>
                        <span className="text-sm text-gray-500">{request.quantity} units</span>
                      </div>
                      {request.organisation && (
                        <p className="mt-1 text-sm text-gray-500">
                          Organisation: {request.organisation.organisationName} • {request.organisation.phone}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">{new Date(request.requestDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            No requests found
          </div>
        )}
      </div>
    </div>
  )
}