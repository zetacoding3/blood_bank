// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function RegisterPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'donar',
//     hospitalName: '',
//     organisationName: '',
//     website: '',
//     address: '',
//     phone: ''
//   })
//   const [error, setError] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     try {
//       const response = await fetch('http://localhost:8080/api/v1/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (data.success) {
//         if (formData.role === 'admin') {
//           router.push('/login?role=admin')
//         } else {
//           router.push('/login')
//         }
//       } else {
//         if (data.errors) {
//           const errorMessages = Object.values(data.errors).join(' ')
//           setError(errorMessages)
//         } else {
//           setError(data.message || 'Registration failed. Please check your inputs.')
//         }
//       }
//     } catch (err: any) {
//       setError(err.message || 'Network error: Unable to connect to the server')
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//               <span className="block sm:inline">{error}</span>
//             </div>
//           )}

//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Role</label>
//               <select
//                 value={formData.role}
//                 onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
//               >
//                 <option value="admin">Admin</option>
//                 <option value="donar">Donor</option>
//                 <option value="hospital">Hospital</option>
//                 <option value="organisation">Organisation</option>
//               </select>
//             </div>

//             {formData.role === 'donar' && (
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   required
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 />
//               </div>
//             )}

//             {formData.role === 'hospital' && (
//               <div>
//                 <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">Hospital Name</label>
//                 <input
//                   id="hospitalName"
//                   name="hospitalName"
//                   type="text"
//                   required
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                   value={formData.hospitalName}
//                   onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
//                 />
//               </div>
//             )}

//             {formData.role === 'organisation' && (
//               <div>
//                 <label htmlFor="organisationName" className="block text-sm font-medium text-gray-700">Organisation Name</label>
//                 <input
//                   id="organisationName"
//                   name="organisationName"
//                   type="text"
//                   required
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                   value={formData.organisationName}
//                   onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
//                 />
//               </div>
//             )}

//             {(formData.role === 'hospital' || formData.role === 'organisation') && (
//               <>
//                 <div>
//                   <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
//                   <input
//                     id="website"
//                     name="website"
//                     type="url"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                     value={formData.website}
//                     onChange={(e) => setFormData({ ...formData, website: e.target.value })}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     id="address"
//                     name="address"
//                     type="text"
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                     value={formData.address}
//                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                   />
//                 </div>
//               </>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>

//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
//               <input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//             >
//               Register
//             </button>
//           </div>

//           <div className="text-sm text-center">
//             <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
//               Already have an account? Sign in
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: searchParams?.get('role') || 'donar',
    organisationName: '',
    hospitalName: '',
    website: '',
    address: '' // This field is required for all user types
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Make sure address is not empty for any role
      if (!formData.address.trim()) {
        setError('Address is required')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/login')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  // Show address field for all user types
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Register your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
              sign in to your account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                placeholder="Full Name"
              />
            </div>

            {/* Always show address field for all user types */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                placeholder="Your Address"
                rows={2}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Register As
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
              >
                <option value="donar">Donor</option>
                <option value="admin">Admin</option>
                <option value="hospital">Hospital</option>
                <option value="organisation">Organization</option>
              </select>
            </div>

            {formData.role === 'organisation' && (
              <div>
                <label htmlFor="organisationName" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  id="organisationName"
                  name="organisationName"
                  type="text"
                  required
                  value={formData.organisationName}
                  onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  placeholder="Organization Name"
                />
              </div>
            )}

            {formData.role === 'hospital' && (
              <div>
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
                  Hospital Name
                </label>
                <input
                  id="hospitalName"
                  name="hospitalName"
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  placeholder="Hospital Name"
                />
              </div>
            )}

            {(formData.role === 'hospital' || formData.role === 'organisation') && (
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  placeholder="Website URL"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}