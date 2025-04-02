'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Organization {
  _id: string
  organisationName: string
  email: string
  phone: string
  address: string
  website?: string
  createdAt: string
}

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/v1/admin/org-list', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (data.success) {
        setOrganizations(data.orgData || [])
      } else {
        setError(data.message || 'Failed to fetch organizations')
      }
    } catch (err) {
      setError('An error occurred while fetching organizations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/admin/delete-organization/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setOrganizations(organizations.filter(org => org._id !== id))
        alert('Organization deleted successfully')
      } else {
        alert(data.message || 'Failed to delete organization')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while deleting organization')
    }
  }

  const filteredOrganizations = organizations.filter(org => 
    org.organisationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Bank Organizations</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search organizations..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredOrganizations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No organizations found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Organization Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Joined Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrganizations.map((org) => (
                <tr key={org._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{org.organisationName}</td>
                  <td className="py-3 px-4">{org.email}</td>
                  <td className="py-3 px-4">{org.phone}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{org.address}</td>
                  <td className="py-3 px-4">{new Date(org.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrganization(org)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(org._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Organization Details</h2>
            <div className="space-y-3">
              <p><span className="font-semibold">Organization Name:</span> {selectedOrganization.organisationName}</p>
              <p><span className="font-semibold">Email:</span> {selectedOrganization.email}</p>
              <p><span className="font-semibold">Phone:</span> {selectedOrganization.phone}</p>
              <p><span className="font-semibold">Address:</span> {selectedOrganization.address}</p>
              {selectedOrganization.website && (
                <p>
                  <span className="font-semibold">Website:</span>{' '}
                  <a 
                    href={selectedOrganization.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedOrganization.website}
                  </a>
                </p>
              )}
              <p>
                <span className="font-semibold">Joined:</span>{' '}
                {new Date(selectedOrganization.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrganization(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}