'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Hospital {
  _id: string
  hospitalName: string
  email: string
  phone: string
  website: string
  address: string
  totalRequests: number
  lastRequest?: string
}

export default function HospitalsPage() {
  const router = useRouter()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:8080/api/v1/inventory/get-hospitals', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server response was not JSON')
        }

        const data = await response.json()
        if (data.success) {
          setHospitals(data.hospitals || [])
        } else {
          throw new Error(data.message || 'Failed to fetch hospitals')
        }
      } catch (err: any) {
        console.error('Error fetching hospitals:', err)
        if (err.message.includes('Server response was not JSON')) {
          setError('Invalid server response. Please check the API endpoint.')
        } else if (err.message.includes('Failed to fetch')) {
          setError('Server is not responding. Please check if the server is running.')
        } else {
          setError(err.message || 'An error occurred while fetching hospitals.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => {
              setLoading(true)
              setError('')
              window.location.reload()
            }}
            className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-gray-900">Hospital Management</h1>

      {hospitals.length === 0 ? (
        <div className="text-center text-gray-500 p-4 bg-white rounded-lg shadow">No hospitals found</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {hospitals.map((hospital) => (
              <li key={hospital._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-600 truncate">{hospital.hospitalName}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {hospital.email} • {hospital.phone}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {hospital.website && (
                        <a
                          href={hospital.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Address: {hospital.address}
                    </p>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Total Requests: {hospital.totalRequests}
                      </p>
                    </div>
                    {hospital.lastRequest && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        Last Request: {new Date(hospital.lastRequest).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}