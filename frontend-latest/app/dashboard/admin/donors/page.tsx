'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Donor {
  _id: string
  name: string
  email: string
  phone: string
  bloodGroup: string
  organization: string
  lastDonation?: string
  totalDonations: number
}

export default function DonorList() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/v1/admin/donor-list', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      console.log(data) // Add this line to log the response 
      if (data.success) {
        setDonors(data.donarData || [])
      } else {
        setError(data.message || 'Failed to fetch donors')
      }
    } catch (err) {
      setError('An error occurred while fetching donors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/admin/delete-donar/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setDonors(donors.filter(donor => donor._id !== id))
        alert('Donor deleted successfully')
      } else {
        alert(data.message || 'Failed to delete donor')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while deleting donor')
    }
  }

  const filteredDonors = donors.filter(donor => 
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold">Donor Management</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search donors..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredDonors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No donors found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Blood Group</th>
                <th className="py-3 px-4 text-left">Last Donation</th>
                <th className="py-3 px-4 text-left">Total Donations</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor) => (
                <tr key={donor._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{donor.name}</td>
                  <td className="py-3 px-4">{donor.email}</td>
                  <td className="py-3 px-4">{donor.phone}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      {donor.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-4">{donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'Never'}</td>
                  <td className="py-3 px-4">{donor.totalDonations}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedDonor(donor)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(donor._id)}
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

      {selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Donor Details</h2>
            <div className="space-y-3">
              <p><span className="font-semibold">Name:</span> {selectedDonor.name}</p>
              <p><span className="font-semibold">Email:</span> {selectedDonor.email}</p>
              <p><span className="font-semibold">Phone:</span> {selectedDonor.phone}</p>
              <p><span className="font-semibold">Blood Group:</span> {selectedDonor.bloodGroup}</p>
              <p><span className="font-semibold">Organization:</span> {selectedDonor.organization}</p>
              <p><span className="font-semibold">Last Donation:</span> {selectedDonor.lastDonation ? new Date(selectedDonor.lastDonation).toLocaleDateString() : 'Never'}</p>
              <p><span className="font-semibold">Total Donations:</span> {selectedDonor.totalDonations}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedDonor(null)}
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