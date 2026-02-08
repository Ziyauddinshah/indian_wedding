// app/components/layout/ClientFooter.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Sparkles, Award, Shield } from 'lucide-react'

export default function ClientFooter() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Handle subscription logic here
      alert(`Thank you for subscribing with: ${email}`)
      setEmail('')
    }
  }

  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-rose-900 to-purple-900"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info - Enhanced */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-lg opacity-70"></div>
                <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Baraat<span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">Wheels</span>
                </h2>
                <p className="text-amber-200 text-sm font-medium">Royal Vehicles for Royal Memories</p>
              </div>
            </div>
            
            <p className="text-gray-200 mb-8 max-w-md">
              We specialize in curating the most majestic vehicles for your grand Baraat entrance. 
              From traditional Ghodi to modern luxury cars and royal heritage vehicles, 
              we ensure your wedding procession is nothing short of spectacular.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-white text-sm font-medium">Verified Partners</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-white text-sm font-medium">4.9★ Rating</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Festive */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { href: '/vehicles', label: 'Browse All Vehicles'},
                { href: '/vehicles/ghodi', label: 'Ghodi & Horses'},
                { href: '/vehicles/luxury', label: 'Luxury Cars'},
                { href: '/vehicles/royal', label: 'Royal Vehicles'},
                { href: '/vehicles/premium', label: 'Premium Packages'},
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white hover:scale-105 transform transition-all duration-300 flex items-center group"
                  >
                    <span>{link.label}</span>
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners - Highlighted */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              For Partners
            </h3>
            <ul className="space-y-4">
              {[
                { href: '/partner/register', label: 'Register as Partner' },
                { href: '/partner/dashboard', label: 'Partner Dashboard' },
                { href: '/partner/earnings', label: 'View Earnings' },
                { href: '/partner/support', label: 'Partner Support' },
                { href: '/partner/guidelines', label: 'Guidelines' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-amber-300 hover:scale-105 transform transition-all duration-300 flex items-center group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social - Enhanced */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              Contact Us
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                <div>
                  <div className="text-sm text-gray-300">Call us 24/7</div>
                  <a href="tel:+919876543210" className="text-white font-bold text-lg hover:text-amber-300 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                <div>
                  <div className="text-sm text-gray-300">Email us at</div>
                  <a href="mailto:support@baraatwheels.com" className="text-white font-bold hover:text-amber-300 transition-colors">
                    support@baraatwheels.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
                <div>
                  <div className="text-sm text-gray-300">Head Office</div>
                  <div className="text-white">Jaipur, Rajasthan</div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Our Journey</h4>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, href: '#', color: 'from-pink-500 to-rose-500', label: 'Instagram' },
                  { icon: Facebook, href: '#', color: 'from-blue-500 to-indigo-500', label: 'Facebook' },
                  { icon: Twitter, href: '#', color: 'from-sky-500 to-blue-500', label: 'Twitter' },
                  { icon: Youtube, href: '#', color: 'from-red-500 to-orange-500', label: 'YouTube' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group`}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-6 w-6 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-white/20"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-300">
              © {currentYear} <span className="text-white font-bold">BaraatWheels</span>. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Making Indian weddings more memorable, one royal entrance at a time.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/refund', label: 'Refund Policy' },
              { href: '/safety', label: 'Safety Guidelines' },
              { href: '/sitemap', label: 'Sitemap' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-amber-300 hover:scale-105 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* App Badges (Future) */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">Coming Soon:</div>
            <div className="flex space-x-2">
              <div className="h-10 w-32 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                <span className="text-white font-medium">iOS App</span>
              </div>
              <div className="h-10 w-32 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                <span className="text-white font-medium">Android App</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </div>
    </footer>
  )
}