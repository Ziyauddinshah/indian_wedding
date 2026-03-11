'use client';

import { useState, useRef, useEffect } from 'react';
import { Tag, IndianRupeeIcon, Calendar, Upload, MapPin, Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

const vehicleTypes = [
  { id: 'luxury', name: 'Luxury Vehicle', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'ghodi', name: 'Ghodi', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  { id: 'royal', name: 'Royal Vehicle', color: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
];
const vehicleCompanies = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW',
  'Mercedes-Benz', 'Audi', 'Volkswagen', 'Nissan', 
  'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Jeep',
  'Tata', 'Mahindra', 'Maruti Suzuki', 'Ashok Leyland', 'Bajaj Auto'
];

// Types
interface VehicleFormData {
  vehicleName: string;
  pricePerDay: string;
  modelYear: string;
  rcNumber: string;
  pucNumber: string;
  insuranceNumber: string;
  location: string;
  description: string;
}

interface DocumentStatus {
  rc: { uploaded: boolean; fileName: string; file: File | null };
  puc: { uploaded: boolean; fileName: string; file: File | null };
  insurance: { uploaded: boolean; fileName: string; file: File | null };
}

interface ImageFile {
  file: File;
  preview: string;
}


export default function AddVehicle() {
  // Form state
  const [selectedType, setSelectedType] = useState('luxury');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleName: '',
    pricePerDay: '',
    modelYear: '',
    rcNumber: '',
    pucNumber: '',
    insuranceNumber: '',
    location: '',
    description: ''
  });

  // Document upload states with status
  const [documents, setDocuments] = useState<DocumentStatus>({
    rc: { uploaded: false, fileName: '', file: null },
    puc: { uploaded: false, fileName: '', file: null },
    insurance: { uploaded: false, fileName: '', file: null }
  });

  // Images state
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Refs for file inputs
  const rcInputRef = useRef<HTMLInputElement>(null);
  const pucInputRef = useRef<HTMLInputElement>(null);
  const insuranceInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Handle company selection
  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setIsOpen(false);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle document upload with validation
  const handleDocumentUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: keyof DocumentStatus
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PDF or image files only');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setDocuments(prev => ({
      ...prev,
      [docType]: {
        uploaded: true,
        fileName: file.name,
        file: file
      }
    }));
  };

  // Remove document
  const removeDocument = (docType: keyof DocumentStatus) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        uploaded: false,
        fileName: '',
        file: null
      }
    }));

    // Clear file input
    if (docType === 'rc' && rcInputRef.current) rcInputRef.current.value = '';
    if (docType === 'puc' && pucInputRef.current) pucInputRef.current.value = '';
    if (docType === 'insurance' && insuranceInputRef.current) insuranceInputRef.current.value = '';
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 6) {
      alert('Maximum 6 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Only JPG, PNG, WebP under 10MB are allowed.');
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  // Remove image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    // Check required text fields
    const requiredFields: (keyof VehicleFormData)[] = [
      'vehicleName', 'pricePerDay', 'modelYear', 
      'rcNumber', 'pucNumber', 'insuranceNumber', 
      'location', 'description'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Check company selection
    if (!selectedCompany) {
      alert('Please select a vehicle company');
      return false;
    }

    // Check documents
    if (!documents.rc.uploaded) {
      alert('Please upload RC document');
      return false;
    }
    if (!documents.puc.uploaded) {
      alert('Please upload PUC document');
      return false;
    }
    if (!documents.insurance.uploaded) {
      alert('Please upload Insurance document');
      return false;
    }

    // Check images
    if (images.length === 0) {
      alert('Please upload at least one vehicle image');
      return false;
    }

    return true;
  };

  // Prepare FormData for submission
  const prepareFormData = (): globalThis.FormData => {
    const formDataToSend = new FormData();
    
    // Append vehicle type and company
    formDataToSend.append('vehicleType', selectedType);
    formDataToSend.append('company', selectedCompany);
    
    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append documents
    if (documents.rc.file) formDataToSend.append('rc', documents.rc.file);
    if (documents.puc.file) formDataToSend.append('puc', documents.puc.file);
    if (documents.insurance.file) formDataToSend.append('insurance', documents.insurance.file);

    // Append images (multiple)
    images.forEach((image, index) => {
      formDataToSend.append('vehicleImages', image.file);
    });

    return formDataToSend;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = prepareFormData();
      console.log('Prepared FormData:', formDataToSend);
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Send to API
      const response = await fetch('/api/vehicles/register', {
        method: 'POST',
        body: formDataToSend,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      setUploadProgress(100);

      const result = await response.json();
      
      // Show success message
      alert('Vehicle registered successfully!');
      
      // Reset form
      resetForm();
      
      console.log('Success:', result);

    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to register vehicle. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset form after successful submission
  const resetForm = () => {
    setSelectedType('luxury');
    setSelectedCompany('');
    setFormData({
      vehicleName: '',
      pricePerDay: '',
      modelYear: '',
      rcNumber: '',
      pucNumber: '',
      insuranceNumber: '',
      location: '',
      description: ''
    });
    setDocuments({
      rc: { uploaded: false, fileName: '', file: null },
      puc: { uploaded: false, fileName: '', file: null },
      insurance: { uploaded: false, fileName: '', file: null }
    });
    
    // Cleanup image previews
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    
    // Clear file inputs
    if (rcInputRef.current) rcInputRef.current.value = '';
    if (pucInputRef.current) pucInputRef.current.value = '';
    if (insuranceInputRef.current) insuranceInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => images.forEach(img => URL.revokeObjectURL(img.preview));
  }, [images]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          {/* Vehicle Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Tag className="text-blue-600" />
              Select Vehicle Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300
                  ${selectedType === type.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300'
                  }
                `}
              >
                <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                    <CarIcon type={type.id} />
                  </div>
                  <h3 className="font-semibold text-gray-800">{type.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {type.id === 'luxury' && 'Mercedes, BMW, Audi'}
                    {type.id === 'ghodi' && 'Traditional horse carriage'}
                    {type.id === 'royal' && 'Vintage & special vehicles'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Company Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Company *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white px-4 py-3 text-left border border-gray-300 
                             rounded-xl shadow-sm flex items-center justify-between
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-blue-500 active:bg-gray-50"
                  >
                    <span className={selectedCompany ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedCompany || 'Select a company'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                                ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <>
                      <div 
                        className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
                        onClick={() => setIsOpen(false)}
                      />
                      
                      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl 
                                   shadow-xl z-50 sm:absolute sm:bottom-auto sm:left-0 
                                   sm:right-auto sm:w-full sm:rounded-lg sm:mt-1 
                                   sm:shadow-lg border border-gray-200
                                   max-h-[70vh] sm:max-h-60 overflow-hidden">
                        
                        <div className="flex items-center justify-between p-4 border-b 
                                      border-gray-200 sm:hidden">
                          <h3 className="font-semibold text-gray-900">Select Company</h3>
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <svg className="w-6 h-6 text-gray-500" fill="none" 
                                 stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" 
                                    strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="overflow-y-auto max-h-[calc(70vh-64px)] sm:max-h-60">
                          {vehicleCompanies.map((company) => (
                            <button
                              key={company}
                              type="button"
                              onClick={() => handleCompanySelect(company)}
                              className={`w-full px-4 py-4 sm:py-2.5 text-left 
                                        hover:bg-blue-50 transition-colors
                                        border-b border-gray-100 last:border-0
                                        ${selectedCompany === company ? 'bg-blue-50 text-blue-700' : ''}`}
                            >
                              <span className="text-gray-900">{company}</span>
                              {selectedCompany === company && (
                                <span className="float-right text-blue-600">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                        
                        <div className="p-3 border-t border-gray-200 sm:hidden">
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 text-center text-gray-600 font-medium
                                    bg-gray-100 rounded-lg active:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Vehicle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           outline-none transition"
                  placeholder="e.g., Mercedes S-Class 2024"
                />
              </div>

              {/* Price per day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day (₹) *
                </label>
                <div className="relative">
                  <IndianRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             outline-none transition"
                    placeholder="15000"
                  />
                </div>
              </div>

              {/* Model Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Year *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="modelYear"
                    value={formData.modelYear}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             outline-none transition"
                    placeholder="2024"
                  />
                </div>
              </div>

              {/* RC Number with Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RC Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="rcNumber"
                    value={formData.rcNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             outline-none transition pr-10"
                    placeholder="e.g., MH12AB1234"
                  />
                  {documents.rc.uploaded && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                  )}
                </div>
              </div>

              {/* RC Document Upload with Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Certificate (RC) *
                </label>
                <div className="relative">
                  <input
                    ref={rcInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload(e, 'rc')}
                    className="hidden"
                    id="rc-upload"
                  />
                  <label
                    htmlFor="rc-upload"
                    className={`flex items-center justify-between w-full px-4 py-3 
                              rounded-xl border cursor-pointer transition
                              ${documents.rc.uploaded 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-300 hover:border-blue-500'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Upload size={20} className={documents.rc.uploaded ? 'text-green-500' : 'text-gray-400'} />
                      <span className="text-sm text-gray-600">
                        {documents.rc.fileName || 'Upload RC document'}
                      </span>
                    </div>
                    {documents.rc.uploaded ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <span className="text-xs text-gray-400">PDF/JPG/PNG</span>
                    )}
                  </label>
                  {documents.rc.uploaded && (
                    <button
                      type="button"
                      onClick={() => removeDocument('rc')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white 
                               rounded-full p-1 shadow-lg hover:bg-red-600"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* PUC Number with Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PUC Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="pucNumber"
                    value={formData.pucNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             outline-none transition pr-10"
                    placeholder="AXE-768-UVR09"
                  />
                  {documents.puc.uploaded && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                  )}
                </div>
              </div>

              {/* PUC Document Upload with Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pollution Under Control (PUC) *
                </label>
                <div className="relative">
                  <input
                    ref={pucInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload(e, 'puc')}
                    className="hidden"
                    id="puc-upload"
                  />
                  <label
                    htmlFor="puc-upload"
                    className={`flex items-center justify-between w-full px-4 py-3 
                              rounded-xl border cursor-pointer transition
                              ${documents.puc.uploaded 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-300 hover:border-blue-500'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Upload size={20} className={documents.puc.uploaded ? 'text-green-500' : 'text-gray-400'} />
                      <span className="text-sm text-gray-600">
                        {documents.puc.fileName || 'Upload PUC document'}
                      </span>
                    </div>
                    {documents.puc.uploaded ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <span className="text-xs text-gray-400">PDF/JPG/PNG</span>
                    )}
                  </label>
                  {documents.puc.uploaded && (
                    <button
                      type="button"
                      onClick={() => removeDocument('puc')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white 
                               rounded-full p-1 shadow-lg hover:bg-red-600"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Insurance Number with Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="insuranceNumber"
                    value={formData.insuranceNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             outline-none transition pr-10"
                    placeholder="INS-1234-5678"
                  />
                  {documents.insurance.uploaded && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                  )}
                </div>
              </div>

              {/* Insurance Document Upload with Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Policy *
                </label>
                <div className="relative">
                  <input
                    ref={insuranceInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload(e, 'insurance')}
                    className="hidden"
                    id="insurance-upload"
                  />
                  <label
                    htmlFor="insurance-upload"
                    className={`flex items-center justify-between w-full px-4 py-3 
                              rounded-xl border cursor-pointer transition
                              ${documents.insurance.uploaded 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-300 hover:border-blue-500'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Upload size={20} className={documents.insurance.uploaded ? 'text-green-500' : 'text-gray-400'} />
                      <span className="text-sm text-gray-600">
                        {documents.insurance.fileName || 'Upload Insurance document'}
                      </span>
                    </div>
                    {documents.insurance.uploaded ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <span className="text-xs text-gray-400">PDF/JPG/PNG</span>
                    )}
                  </label>
                  {documents.insurance.uploaded && (
                    <button
                      type="button"
                      onClick={() => removeDocument('insurance')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white 
                               rounded-full p-1 shadow-lg hover:bg-red-600"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             outline-none transition"
                    placeholder="Mumbai, Maharashtra"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           outline-none transition resize-none"
                  placeholder="Describe your vehicle's features, amenities, and special services..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button with Progress */}
            <div className="mt-8">
              {uploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white font-semibold py-4 rounded-xl 
                         hover:from-blue-700 hover:to-purple-700 
                         transition-all duration-300 shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  'Add Vehicle & Start Earning'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Image Upload */}
      <div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Camera className="text-pink-600" />
            Vehicle Photos
          </h2>
          <p className="text-gray-600 mb-6">Upload high-quality photos (6 max)</p>

          {/* Image Upload Area */}
          <div>
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="block cursor-pointer border-2 border-dashed border-blue-300 
                       rounded-2xl p-8 text-center hover:bg-blue-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 
                           rounded-full flex items-center justify-center mx-auto mb-4 
                           group-hover:scale-110 transition-transform">
                <Upload className="text-blue-600" size={28} />
              </div>
              <h3 className="font-semibold text-gray-800">Click to upload</h3>
              <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 10MB</p>
            </label>
          </div>

          {/* Preview Grid */}
          {images.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">
                  Preview ({images.length}/6)
                </h3>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Upload ready
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={img.preview}
                        alt={`Vehicle ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white 
                               p-1.5 rounded-full opacity-0 group-hover:opacity-100 
                               transition-opacity hover:bg-red-600 shadow-lg"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Card */}
          <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 
                        rounded-xl p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Photo Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Use good lighting</li>
              <li>• Show all angles</li>
              <li>• Include interior shots</li>
              <li>• Highlight special features</li>
            </ul>
          </div>

          {/* Document Status Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Upload Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>RC Document</span>
                {documents.rc.uploaded ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Uploaded
                  </span>
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>PUC Document</span>
                {documents.puc.uploaded ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Uploaded
                  </span>
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Insurance Document</span>
                {documents.insurance.uploaded ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Uploaded
                  </span>
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span>Photos</span>
                <span className={images.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                  {images.length}/6 uploaded
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );}
  function CarIcon({ type }: { type: string }) {
  if (type === 'luxury') return <span className="text-white">🏎️</span>;
  if (type === 'ghodi') return <span className="text-white">🐎</span>;
  return <span className="text-white">👑</span>;
}