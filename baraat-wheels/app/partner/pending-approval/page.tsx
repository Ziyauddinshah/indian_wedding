// app/partner/pending-approval/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, Mail, Phone, MessageCircle, Sparkles, Shield, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'

export default function PendingApprovalPage() {
  const { user } = useAuth()
  const [timeLeft, setTimeLeft] = useState('')
  const [progress, setProgress] = useState(0)

  // Mock submission date - replace with actual from API
  const submissionDate = new Date('2024-12-20T10:30:00')
  const submissionTime = submissionDate.toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  })

  // Estimate approval time (24-48 hours)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const hoursSinceSubmission = (now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60)
      
      // Progress bar - assumes 48 hours max wait
      const progressPercent = Math.min((hoursSinceSubmission / 48) * 100, 95)
      setProgress(progressPercent)
      
      // Time remaining
      if (hoursSinceSubmission < 48) {
        const remainingHours = Math.max(0, 48 - hoursSinceSubmission)
        const hours = Math.floor(remainingHours)
        const minutes = Math.floor((remainingHours - hours) * 60)
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft('Any moment now!')
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      name: 'Application Submitted',
      description: 'Your application has been received',
      icon: CheckCircle,
      completed: true,
      date: submissionDate,
      color: 'text-green-500'
    },
    {
      name: 'Document Verification',
      description: 'Our team is reviewing your documents',
      icon: Shield,
      completed: true,
      color: 'text-blue-500'
    },
    {
      name: 'Background Check',
      description: 'Verification of business credentials',
      icon: Award,
      completed: true,
      color: 'text-purple-500'
    },
    {
      name: 'Admin Review',
      description: 'Final approval by our admin team',
      icon: Clock,
      completed: false,
      color: 'text-amber-500',
      isCurrent: true
    },
    {
      name: 'Partner Verified',
      description: 'Start listing your vehicles',
      icon: Sparkles,
      completed: false,
      color: 'text-green-500'
    }
  ]

  const tips = [
    {
      icon: '📄',
      title: 'Check Your Documents',
      description: 'Ensure all uploaded documents are clear and readable for faster approval'
    },
    {
      icon: '📞',
      title: 'Response Ready',
      description: 'Admin might call for verification, keep your phone handy'
    },
    {
      icon: '🚗',
      title: 'Prepare Vehicles',
      description: 'While waiting, prepare photos and details of vehicles you want to list'
    },
    {
      icon: '⭐',
      title: 'Set Competitive Pricing',
      description: 'Research market rates to attract more bookings once approved'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full mb-6">
            <Clock className="h-5 w-5 text-amber-600 mr-2 animate-pulse" />
            <span className="text-amber-700 font-bold">UNDER REVIEW</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Application Under Review
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for registering as a partner! Our team is reviewing your application.
            You'll receive an email once approved.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left Side - Progress */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Verification Progress</span>
                <span className="text-sm font-bold text-amber-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {timeLeft === 'Any moment now!' 
                    ? '✨ Your application is in the final queue!'
                    : `Estimated approval time: ${timeLeft} remaining`}
                </span>
              </div>
            </div>

            {/* Right Side - Contact */}
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Support
              </button>
              <button className="px-5 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Team
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <Clock className="h-6 w-6 mr-3 text-amber-500" />
            Application Status
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.name} className="relative flex gap-5">
                  {/* Icon */}
                  <div className={`relative z-10 h-12 w-12 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : step.isCurrent
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className={`text-lg font-bold ${
                          step.completed ? 'text-gray-900' : step.isCurrent ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </h3>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                      </div>
                      {step.date && (
                        <div className="text-sm text-gray-500">
                          {step.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                    
                    {step.isCurrent && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-600">⏳</span>
                          </div>
                          <div>
                            <p className="text-amber-800 font-medium">We're reviewing your application</p>
                            <p className="text-amber-700 text-sm mt-1">
                              Our team is manually verifying your documents. This usually takes 24-48 hours.
                              You'll receive an email notification once approved.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">💡</span>
              While You Wait
            </h3>
            <div className="space-y-4">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl">{tip.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Sparkles className="h-6 w-6 mr-2" />
              What Happens Next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">1</span>
                </div>
                <div>
                  <p className="font-bold">Email Confirmation</p>
                  <p className="text-white/90 text-sm">You'll receive an approval email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">2</span>
                </div>
                <div>
                  <p className="font-bold">Dashboard Access</p>
                  <p className="text-white/90 text-sm">Start adding your vehicles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">3</span>
                </div>
                <div>
                  <p className="font-bold">Get Bookings</p>
                  <p className="text-white/90 text-sm">Customers can now book your vehicles</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-sm">Need faster approval?</span>
                <button className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium text-sm hover:scale-105 transition">
                  Contact Priority Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-600 mb-4">
            Having trouble with verification? Our support team is here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-5 w-5 text-amber-500" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-5 w-5 text-amber-500" />
              <span>partner-support@baraatwheels.com</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <span>✨</span>
            <span>Verified by</span>
            <Shield className="h-4 w-4" />
            <span>BaraatWheels Trust & Safety</span>
          </div>
        </div>
      </div>
    </div>
  )
}