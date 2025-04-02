'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">B+</span>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-800">LifeFlow</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-red-600 font-medium hover:text-red-800">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Donate Blood, <span className="text-red-600">Save Lives</span>
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Your donation can make a difference in someone's life. Join our community of donors and help save lives today.
              </p>
              <div className="mt-8 flex space-x-4">
                <Link href="/register?role=donar" className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">
                  Become a Donor
                </Link>
                <Link href="/register?role=hospital" className="px-6 py-3 border border-red-600 text-red-600 rounded-md font-medium hover:bg-red-50">
                  Register as Hospital
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
              <div className="relative w-full h-64 lg:h-96">
                <div className="w-full h-full bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-32 h-32 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform connects blood donors with hospitals and organizations in need.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Register as a Donor</h3>
              <p className="mt-2 text-gray-600">
                Create an account and provide your blood type and contact information to join our donor database.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Hospital Registration</h3>
              <p className="mt-2 text-gray-600">
                Hospitals can register to request blood donations and manage their blood inventory efficiently.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Blood Requests</h3>
              <p className="mt-2 text-gray-600">
                Hospitals can request specific blood types and quantities, and donors will be notified if they're a match.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
            <div>
              <p className="text-4xl font-extrabold text-white">1000+</p>
              <p className="mt-2 text-xl text-red-100">Registered Donors</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white">50+</p>
              <p className="mt-2 text-xl text-red-100">Partner Hospitals</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white">5000+</p>
              <p className="mt-2 text-xl text-red-100">Lives Saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Ready to make a difference?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join our community today and help save lives through blood donation.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/register" className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">B+</span>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold">LifeFlow</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Connecting donors with those in need since 2025.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
                <div className="mt-4 space-y-2">
                  <Link href="#" className="text-sm text-gray-400 hover:text-white block">
                    About Blood Donation
                  </Link>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white block">
                    Eligibility
                  </Link>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white block">
                    FAQs
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
                <div className="mt-4 space-y-2">
                  <Link href="#" className="text-sm text-gray-400 hover:text-white block">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white block">
                    Terms of Service
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-400">
                    Email: info@lifeflow.com
                  </p>
                  <p className="text-sm text-gray-400">
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 LifeFlow Blood Donation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}