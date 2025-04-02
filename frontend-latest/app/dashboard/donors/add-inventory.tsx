'use client'

import { useState, useEffect } from 'react'

interface AddInventoryProps {
  onSuccess?: () => void
}


export default function AddInventory({ onSuccess }: AddInventoryProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    quantity: 1,
    email: '',
    organisation: localStorage.getItem('userId') || '', // Initialize with userId
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      
      // Fix the API endpoint URL - change from relative to absolute URL
      const response = await fetch('http://localhost:8080/api/v1/inventory/create-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inventoryType: 'in', // Add this line - blood donation is always "in" type
          bloodGroup: formData.bloodGroup,
          quantity: formData.quantity,
          email: formData.email,
          organisation: formData.organisation
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setFormData({
          bloodGroup: 'A+',
          quantity: 1,
          email: '',
          organisation: formData.organisation, // Reset with current organisation
        })
        onSuccess?.()
      } else {
        setError(data.message || 'Failed to add inventory')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding inventory')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Blood Donation</h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Donor Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Enter donor email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity (ml)</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onSuccess?.()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}