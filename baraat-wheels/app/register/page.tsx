'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { authApi } from '../lib/api';
import { CustomerPayload, PartnerPayload, AdminPayload, RegisterPayload } from '../model/User';
import { form } from 'framer-motion/m';

type UserType = 'customer' | 'partner' | 'admin'

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
};
const initialFormData: RegisterPayload = {
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
  newsletter: false,
  role: "customer",
};


export default function RegisterPage() {
  

  const [selectedType, setSelectedType] = useState<UserType>("customer");
  const [customerData, setCustomerData] = useState<RegisterPayload>({
      ...initialFormData,
      role: "customer",
    });
  const [partnerData, setPartnerData] = useState<RegisterPayload>({
      ...initialFormData,
      role: "partner",
      newsletter: undefined,
    });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiResponseMessage, setApiResponseMessage] = useState("");
  const [apiResponseSuccess, setApiResponseSuccess] = useState(false);
  const currentData = selectedType === "customer" ? customerData : partnerData;
  
  const updateFormData = (
  field: keyof RegisterPayload,
  value: string | boolean
) => {
  const updatedData: RegisterPayload = {
    ...currentData,
    [field]: value,
    role: selectedType,
  };
  if (selectedType === "customer") {
    setCustomerData(updatedData);
  } else {
    setPartnerData(updatedData);
  }
  // Validate the complete updated object,
  // but display only the error for the changed field.
  const validationErrors = validateForm(updatedData);
  const validationField = field as keyof FormErrors;

  setErrors((previousErrors) => {
    const nextErrors: FormErrors = {
      ...previousErrors,
      general: "",
      [validationField]: validationErrors[validationField] || "",
    };
    // Password changes can affect confirm-password validation
    if (field === "password" && updatedData.confirmPassword) {
      nextErrors.confirmPassword =
      validationErrors.confirmPassword || "";
    }
    // Password confirmation changes should update its own error
    if (field === "confirmPassword") {
      nextErrors.confirmPassword =
      validationErrors.confirmPassword || "";
    }
    // Terms checkbox has a different error key
    if (field === "agreeToTerms") {
      nextErrors.terms = validationErrors.terms || "";
    }
    return nextErrors;
  });
};

const validateForm = ( formData: RegisterPayload): FormErrors => {
  const validationErrors: FormErrors = {};
  const nameRegex = /^[A-Za-z ]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^\d{10}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  // const passwordRegex = "";

  if (!formData.name.trim()) {
    validationErrors.name = "Name is required";
  } else if (!nameRegex.test(formData.name.trim())) {
    validationErrors.name =
      "Name must contain only letters and spaces";
  }

  if (!formData.email.trim()) {
    validationErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email.trim())) {
    validationErrors.email = "Enter a valid email address";
  }

  if (!formData.phone.trim()) {
    validationErrors.phone = "Contact number is required";
  } else if (!contactRegex.test(formData.phone.trim())) {
    validationErrors.phone =
      "Contact number must contain exactly 10 digits";
  }

  if (!formData.address.trim()) {
    validationErrors.address = "Address is required";
  }

  // if (!formData.password) {
  //   validationErrors.password = "Password is required";
  // } else if (!passwordRegex.test(formData.password)) {
  //   validationErrors.password =
  //     "Password must contain 8+ characters, uppercase, lowercase, number and special character";
  // }

  if (!formData.confirmPassword) {
    validationErrors.confirmPassword =
      "Confirm password is required";
  } else if (
    formData.password !== formData.confirmPassword
  ) {
    validationErrors.confirmPassword =
      "Passwords do not match";
  }

  if (!formData.agreeToTerms) {
    validationErrors.terms =
      "You must agree to the terms and conditions";
  }
  return validationErrors;
};

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrors({});
    setApiResponseMessage("");
    const formData: RegisterPayload = {
      ...currentData,
      // Always use the selected account type
      role: selectedType,
    };
    const validationErrors = validateForm(formData);
    // Stop submission if any validation errors exist
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const response = await authApi.register(formData);
      console.log("API Response:", response.data);
      if(response?.data?.success){
        setApiResponseSuccess(true);
        setApiResponseMessage(response.data.message || "Registration successful!");
        formData.name = "";
        formData.email = "";
        formData.phone = "";
        formData.address = "";
        formData.password = "";
        formData.confirmPassword = "";
        formData.agreeToTerms = false;
        formData.newsletter = false;
      }

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Registration failed"
        );
      }
    } catch (error: any) {
      setApiResponseSuccess(false);
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.message || "Registration failed. Please try again.";
        setApiResponseMessage(message);
        return;
      }
      setApiResponseMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    {
      type: 'customer' as UserType,
      icon: '👤',
      label: 'Customer',
      description: 'Personal account',
      gradient: 'from-indigo-600 to-pink-600',
      focusColor: 'indigo-500',
    },
    {
      type: 'partner' as UserType,
      icon: '🤝',
      label: 'Partner',
      description: 'Business account',
      gradient: 'from-emerald-600 to-teal-600',
      focusColor: 'emerald-500',
    }
  ]
  const currentType = userTypes.find(t => t.type === selectedType)!
  const getFocusColor = () => {
    if (selectedType === 'customer') return 'focus:border-indigo-500'
    if (selectedType === 'partner') return 'focus:border-emerald-500'
    return 'focus:border-violet-500'
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-5 bg-gradient-to-br ${currentType.gradient} transition-all duration-500`}>
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ServiceHub
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">Join us and get started today</p>
          </div>

          {/* User Type Selector */}
          <div className="grid grid-cols-2 gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl">
            {userTypes.map((type) => (
              <button
                key={type.type}
                type="button"
                onClick={() => setSelectedType(type.type)}
                className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  selectedType === type.type
                    ? `bg-gradient-to-r ${type.gradient} text-white shadow-md`
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div>{type.label}</div>
              </button>
            ))}
          </div>

          {/* Special Badges */}
          {selectedType === 'partner' && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full">
                <span className="text-emerald-700 font-medium">🎉 30 Days Free Trial</span>
              </div>
            </div>
          )}

          {/* Api Response Success Message */}
          {apiResponseSuccess && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              {apiResponseMessage}
            </div>
          )}
          {/* Api Response Error Message */}
          {apiResponseMessage && !apiResponseSuccess && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {apiResponseMessage}
            </div>
          )}

          {/* Registration Forms */}
          <form onSubmit={handleSubmit}>
            {/* Customer Form */}
            {selectedType === 'customer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerData.name}                    
                    onChange={(event) =>
                      updateFormData("name", event.target.value)
                    }
                    required
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={(event) =>
                      updateFormData("email", event.target.value)
                    }
                    required
                    placeholder="xyz@gmail.com"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                   {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerData.phone}
                    onChange={(event) =>
                      updateFormData("phone", event.target.value)
                    }
                    required
                    placeholder="+91 9999999999"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <textarea
                    name="address"
                    value={customerData.address}
                    onChange={(event) =>
                      updateFormData("address", event.target.value)
                    }
                    placeholder="Enter street address, city, state, zip code"
                    rows={2}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors resize-none`}
                  />
                  {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={customerData.password}
                    onChange={(event) =>
                      updateFormData("password", event.target.value)
                    }
                    required
                    placeholder="••••••••"
                    minLength={8}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={customerData.confirmPassword}
                    onChange={(event) =>
                      updateFormData("confirmPassword", event.target.value)
                    }
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Partner Form */}
            {selectedType === 'partner' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={partnerData.name}
                    onChange={(event) =>
                      updateFormData("name", event.target.value)
                    }
                    required
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={partnerData.email}
                    onChange={(event) =>
                      updateFormData("email", event.target.value)
                    }
                    required
                    placeholder="xyz@gmail.com"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={partnerData.phone}
                    onChange={(event) =>
                      updateFormData("phone", event.target.value)
                    }
                    required
                    placeholder="+91 9999999999"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={partnerData.address}
                    onChange={(event) =>
                      updateFormData("address", event.target.value)
                    }
                    required
                    placeholder="Enter street address, city, state, zip code"
                    rows={2}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors resize-none`}
                  />
                  {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={partnerData.password}
                    onChange={(event) =>
                      updateFormData("password", event.target.value)
                    }
                    required
                    placeholder="••••••••"
                    minLength={8}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={partnerData.confirmPassword}
                    onChange={(event) =>
                      updateFormData("confirmPassword", event.target.value)
                    }
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none ${getFocusColor()} transition-colors`}
                  />
                  {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-3 mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={currentData.agreeToTerms}
                  onChange={(event) =>
                    updateFormData("agreeToTerms", event.target.checked)
                  }
                  required
                  className="w-4 h-4 border-gray-300 rounded focus:ring-2 mt-1"
                  style={{ accentColor: currentType.gradient.includes('indigo') ? '#6366f1' : currentType.gradient.includes('emerald') ? '#10b981' : '#8b5cf6' }}
                />
                <span className="ml-3 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className={`font-medium bg-gradient-to-r ${currentType.gradient} bg-clip-text text-transparent`}>
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className={`font-medium bg-gradient-to-r ${currentType.gradient} bg-clip-text text-transparent`}>
                    Privacy Policy
                  </Link>
                  {selectedType === 'partner' && (
                    <>
                      {', and '}
                      <Link href="/partner-agreement" className={`font-medium bg-gradient-to-r ${currentType.gradient} bg-clip-text text-transparent`}>
                        Partner Agreement
                      </Link>
                    </>
                  )}
                </span>
              </label>

              {selectedType === 'customer' && (
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={currentData.newsletter}
                    onChange={(event) =>
                      updateFormData("newsletter", event.target.checked)
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Send me promotional emails about services and offers
                  </span>
                </label>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${currentType.gradient} text-white py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {loading ? 'Creating Account...' : selectedType === 'partner' ? 'Register Partner' : 'Create Account'}
            </button>
          </form>

          {/* Social Registration - Only for Customer */}
          {selectedType === 'customer' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </>
          )}

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className={`font-semibold bg-gradient-to-r ${currentType.gradient} bg-clip-text text-transparent hover:opacity-80`}
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/90 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}