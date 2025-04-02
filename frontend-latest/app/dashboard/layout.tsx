'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/login')
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold text-red-600">
                  Blood Bank
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {user?.name || user?.hospitalName || user?.organisationName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
              >
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link
                    href="/dashboard/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    href="/dashboard/admin/donors"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Donor List
                  </Link>
                  <Link
                    href="/dashboard/admin/hospitals"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Hospital List
                  </Link>
                  <Link
                    href="/dashboard/admin/organizations"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Organization List
                  </Link>
                </>
              )}
              {user?.role === 'organisation' && (
                <>
                  <Link
                    href="/dashboard/inventory"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Inventory
                  </Link>
                  <Link
                    href="/dashboard/donors"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Donors
                  </Link>
                  <Link
                    href="/dashboard/hospitals"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Hospitals
                  </Link>
                </>
              )}
              {user?.role === 'donar' && (
                <>
                  <Link
                    href="/dashboard/donors"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    My Donations
                  </Link>
                  <Link
                    href="/dashboard/organisation"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Organizations
                  </Link>
                </>
              )}
              {user?.role === 'hospital' && (
                <>
                  <Link
                    href="/dashboard/requests"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Blood Requests
                  </Link>
                  <Link
                    href="/dashboard/consumer"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Consumption History
                  </Link>
                  <Link
                    href="/dashboard/organisation"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    Organizations
                  </Link>
                </>
              )}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}