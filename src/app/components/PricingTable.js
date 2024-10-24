'use client'
// Client Component: PricingTable
import { useState } from 'react'
import Link from 'next/link'

function PricingTable({pricing, user_email = null}) {
  const [isMonthly, setIsMonthly] = useState(true)

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-center text-blue-600 mb-4">
        Choose Your Plan
        <br />
  <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md mb-4 hover:bg-blue-600"
            onClick={() => setIsMonthly(!isMonthly)}
          >
            {isMonthly ? 'Switch to Yearly' : 'Switch to Monthly'}
          </button>
      </h3>
        
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan 1: Testing */}
        <div className="border rounded-lg p-6 shadow-md text-center">
          <img src="/images/pricing-limited_pro.jpg" alt="Testing Plan" className="w-20 h-20 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-blue-700 mb-2">I'm Just Testing It</h4>
          <p className="text-gray-700 mb-4">One-time payment of 5€</p>
          <p className="text-gray-600 mb-4">Full features, limited to 5 reviews</p>
          <Link href={"https://buy.stripe.com/test_28o16f0gK61A8og9AA?prefilled_email=" + user_email}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Get Started
            </button>
          </Link>
        </div>

        {/* Plan 2: Subscription (highlighted) */}
        <div className="border rounded-lg p-6 shadow-md text-center bg-yellow-50 relative">
          <img src="/images/pricing-lfg.jpg" alt="Subscription Plan" className="w-20 h-20 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-blue-700 mb-2">LFG (Most Popular)</h4>
          <p className="text-gray-700 mb-4">{isMonthly ? '19€ per month' : '190€ per year'}</p>
          <p className="text-gray-600 mb-4">Unlimited access and reviews</p>
         <Link href={isMonthly ? "https://buy.stripe.com/test_cN27uD4x03Ts8ogfZ1?prefilled_email=" + user_email : "https://buy.stripe.com/test_eVaaGPbZsblU1ZSdQS?prefilled_email=" + user_email}>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Subscribe Now
            </button>
          </Link>
        </div>

        {/* Plan 3: One-Time Unlimited */}
        <div className="border rounded-lg p-6 shadow-md text-center">
          <img src="/images/pricing-imapro.jpg" alt="Pro Plan" className="w-20 h-20 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-blue-700 mb-2">I'm a Pro</h4>
          <p className="text-gray-700 mb-4">One-time payment of 100€</p>
          <p className="text-gray-600 mb-4">Unlimited use of the app</p>
          <Link href={"https://buy.stripe.com/test_dR68yH4x00HgawobIJ?prefilled_email=" + user_email }>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Get Lifetime Access
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PricingTable