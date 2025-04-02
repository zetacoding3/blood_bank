'use client'

import { useEffect, useState } from 'react'

interface Organization {
  _id: string
  organisationName: string
  email: string
  phone: string
  address: string
  website?: string
  createdAt: string
}

export default function OrganisationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem('token')
        const userRole = localStorage.getItem('role')
        
        // Use the endpoint with the typo as it appears in the backend
        // Match the logic from the original OrganisationPage.js
        let endpoint = 'http://localhost:8080/api/v1/inventory/get-orgnaisation'
        
        if (userRole === 'hospital') {
          endpoint = 'http://localhost:8080/api/v1/inventory/get-orgnaisation-for-hospital'
        }
        
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        const data = await response.json()
        if (data.success) {
          setOrganizations(data.organisations)
        } else {
          setError('Failed to fetch organizations')
        }
      } catch (err) {
        setError('An error occurred while fetching organizations')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
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
      <h1 className="text-2xl font-semibold text-gray-900">Blood Bank Organizations</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Available Organizations</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Organizations that manage blood donations and distribution</p>
        </div>
        
        {organizations.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No organizations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {organizations.map((org) => {
              // Format date using JavaScript Date object
              const date = new Date(org.createdAt)
              const formattedDate = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              
              return (
                <div key={org._id} className="bg-white overflow-hidden shadow rounded-lg border">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-red-600">
                      {org.organisationName}
                    </h3>
                    <div className="mt-3 text-sm text-gray-500 space-y-1">
                      <p>
                        <span className="font-medium">Email:</span> {org.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {org.phone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {org.address}
                      </p>
                      {org.website && (
                        <p>
                          <span className="font-medium">Website:</span>{' '}
                          <a 
                            href={org.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-500"
                          >
                            {org.website}
                          </a>
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Joined:</span> {formattedDate}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <a 
                        href={`mailto:${org.email}`} 
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        Contact Organization
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}