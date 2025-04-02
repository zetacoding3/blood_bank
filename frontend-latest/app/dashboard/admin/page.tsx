'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  FaUserFriends, 
  FaHospital, 
  FaBuilding, 
  FaTint, 
  FaCalendarCheck,
  FaChartLine
} from 'react-icons/fa'
import { IconType } from 'react-icons' // Added for proper icon typing

// Dashboard card component
const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon,
  description,
  color = 'red'
}: {
  title: string;
  value: number | string;
  icon: IconType; // Improved typing for icon prop
  description?: string;
  color?: 'red' | 'blue' | 'green' | 'purple';
}) => {
  const colorClasses = {
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
  } as const

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

// Blood group card component
const BloodGroupCard = ({ 
  group, 
  count 
}: { 
  group: string; 
  count: number 
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold mb-2">
      {group}
    </div>
    <p className="text-gray-900 font-semibold">{count}</p>
    <p className="text-xs text-gray-500">donors</p>
  </div>
)

interface Analytics {
  totalDonors: number;
  totalHospitals: number;
  totalOrganizations: number;
  recentDonations: number;
  totalInventory: number;
  donorsByBloodGroup: Record<string, number>;
}

interface DonorData {
  success: boolean;
  donarData: Array<{ bloodGroup: string }>;
}

interface HospitalData {
  success: boolean;
  hospitalData: Array<any>;
}

interface OrgData {
  success: boolean;
  orgData: Array<any>;
}

interface InventoryData {
  success: boolean;
  inventory: Array<{
    createdAt: string;
    inventoryType: 'in' | 'out';
    quantity: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalDonors: 0,
    totalHospitals: 0,
    totalOrganizations: 0,
    recentDonations: 0,
    totalInventory: 0,
    donorsByBloodGroup: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const headers = { Authorization: `Bearer ${token}` }
      
      // Helper function to safely parse JSON responses
      const safeJsonParse = async (response: Response) => {
        const text = await response.text()
        try {
          return JSON.parse(text)
        } catch (e) {
          console.error('Invalid JSON response:', text.substring(0, 100) + '...')
          throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`)
        }
      }
      
      // Fetch data from multiple endpoints
      const [donorsRes, hospitalsRes, orgsRes, inventoryRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/admin/donor-list', { headers }),
        fetch('http://localhost:8080/api/v1/admin/hospital-list', { headers }),
        fetch('http://localhost:8080/api/v1/admin/org-list', { headers }),
        fetch('http://localhost:8080/api/v1/inventory/get-inventory', { headers })
      ])

      // Check if responses are OK before parsing
      if (!donorsRes.ok) throw new Error(`Donor API error: ${donorsRes.status}`)
      if (!hospitalsRes.ok) throw new Error(`Hospital API error: ${hospitalsRes.status}`)
      if (!orgsRes.ok) throw new Error(`Organization API error: ${orgsRes.status}`)
      if (!inventoryRes.ok) throw new Error(`Inventory API error: ${inventoryRes.status}`)

      // Safely parse JSON responses with proper typing
      const [donorsData, hospitalsData, orgsData, inventoryData] = await Promise.all([
        safeJsonParse(donorsRes) as Promise<DonorData>,
        safeJsonParse(hospitalsRes) as Promise<HospitalData>,
        safeJsonParse(orgsRes) as Promise<OrgData>,
        safeJsonParse(inventoryRes) as Promise<InventoryData>
      ])

      // Check if responses are successful
      if (!donorsData.success || !hospitalsData.success || !orgsData.success || !inventoryData.success) {
        throw new Error('Failed to fetch data from one or more endpoints')
      }

      // Calculate blood group distribution
      const donorsByBloodGroup: Record<string, number> = {}
      if (Array.isArray(donorsData.donarData)) {
        donorsData.donarData.forEach(donor => {
          if (donor.bloodGroup) {
            donorsByBloodGroup[donor.bloodGroup] = (donorsByBloodGroup[donor.bloodGroup] || 0) + 1
          }
        })
      }

      // Calculate recent donations and total inventory
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentDonations = inventoryData.inventory.filter(item => {
        const donationDate = new Date(item.createdAt)
        return donationDate >= thirtyDaysAgo && item.inventoryType === 'in'
      }).length

      const totalInventory = inventoryData.inventory.reduce((total, item) => {
        return item.inventoryType === 'in' ? total + item.quantity : total - item.quantity
      }, 0)

      setAnalytics({
        totalDonors: donorsData.donarData.length,
        totalHospitals: hospitalsData.hospitalData.length,
        totalOrganizations: orgsData.orgData.length,
        recentDonations,
        totalInventory,
        donorsByBloodGroup
      })

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Donors" 
          value={analytics.totalDonors} 
          icon={FaUserFriends} 
          color="red"
        />
        <DashboardCard 
          title="Total Hospitals" 
          value={analytics.totalHospitals} 
          icon={FaHospital} 
          color="blue"
        />
        <DashboardCard 
          title="Total Organizations" 
          value={analytics.totalOrganizations} 
          icon={FaBuilding} 
          color="green"
        />
        <DashboardCard 
          title="Recent Donations" 
          value={analytics.recentDonations} 
          icon={FaCalendarCheck} 
          description="In the last 30 days"
          color="purple"
        />
      </div>

      {/* Blood inventory section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Blood Inventory</h2>
          <Link 
            href="/dashboard/inventory" 
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{analytics.totalInventory}</h3>
            <p className="text-sm text-gray-500">Total units available</p>
          </div>
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <FaTint className="h-8 w-8" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {Object.keys(analytics.donorsByBloodGroup).length > 0 ? (
            Object.entries(analytics.donorsByBloodGroup).map(([group, count]) => (
              <BloodGroupCard key={group} group={group} count={count} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No blood group data available</p>
          )}
        </div>
      </div>

      {/* Quick access links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/dashboard/admin/donors" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaUserFriends className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Donors</h3>
              <p className="text-sm text-gray-500">View and manage donor records</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/dashboard/admin/hospitals" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaHospital className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Hospitals</h3>
              <p className="text-sm text-gray-500">View and manage hospital records</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/dashboard/admin/organizations" 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaBuilding className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Organizations</h3>
              <p className="text-sm text-gray-500">View and manage blood bank organizations</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Analytics link */}
      <Link 
        href="/dashboard/admin/analytic" 
        className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaChartLine className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Detailed Analytics</h3>
              <p className="text-sm text-gray-500">View comprehensive blood donation statistics and trends</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </div>
      </Link>
    </div>
  )
}