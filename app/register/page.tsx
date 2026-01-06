'use client';

import MobileContainer from '@/components/MobileContainer';
import { Bell, Search, Calendar, ChevronUp, ChevronDown, Upload, Home as HomeIcon, FileText, User, Check } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [dobValue, setDobValue] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [showCustomBloodGroup, setShowCustomBloodGroup] = useState(false);
  const [customBloodGroup, setCustomBloodGroup] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<'personal' | 'additional' | 'review'>('personal');
  const additionalDetailsRef = useRef<HTMLDivElement>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Razorpay payment handler
  const handlePayment = () => {
    if (!termsAccepted) {
      alert('Please accept the Terms & Conditions to proceed with payment.');
      return;
    }

    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please wait a moment.');
      return;
    }

    // Declare Razorpay type
    const Razorpay = (window as any).Razorpay;

    if (!Razorpay) {
      alert('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
      amount: 10000, // Amount in paise (10000 = ₹100)
      currency: 'INR',
      name: 'MSCA Registration',
      description: 'MSCA Membership Registration Fee',
      image: '/logo.png', // Optional: Your logo URL
      handler: function (response: any) {
        // Handle successful payment
        console.log('Payment successful:', response);
        // Navigate to dashboard/home page after successful payment
        router.push('/dashboard');
      },
      prefill: {
        name: '', // You can prefill with user data
        email: '',
        contact: ''
      },
      theme: {
        color: '#00AEFF'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
        }
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setDobValue(date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }));
    setShowDatePicker(false);
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    handleDateSelect(today.getDate());
  };

  // Clear selection
  const clearDate = () => {
    setSelectedDate(null);
    setDobValue('');
    setShowDatePicker(false);
  };
  return (
    <MobileContainer className="overflow-hidden">
      {/* Background container - matching background-design.svg */}
      <div className="relative w-full min-h-screen bg-black rounded-[28px] overflow-hidden">
        {/* Background from background-design.svg */}
        {/* Base rectangle: width="375" height="788" rx="28" fill="black" */}
        <div className="absolute inset-0 bg-black rounded-[28px]" />
        
        {/* Decorative Ellipse 1: cx="-17.5" cy="495.5" rx="118.5" ry="96.5" fill="#045069" fill-opacity="0.8" */}
        <div 
          className="absolute rounded-full"
          style={{
            left: '-17.5px',
            top: '495.5px',
            width: '237px',
            height: '193px',
            background: '#045069',
            opacity: 0.8,
            filter: 'blur(38.35px)',
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Decorative Ellipse 2: cx="185" cy="-9.5" rx="222" ry="96.5" fill="#045069" */}
        <div 
          className="absolute rounded-full"
          style={{
            left: '185px',
            top: '-9.5px',
            width: '444px',
            height: '193px',
            background: '#045069',
            filter: 'blur(38.35px)',
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Decorative Ellipse 3: cx="512.5" cy="374.5" rx="196.5" ry="103.5" fill="#092286" */}
        <div 
          className="absolute rounded-full"
          style={{
            left: '512.5px',
            top: '374.5px',
            width: '393px',
            height: '207px',
            background: '#092286',
            filter: 'blur(38.35px)',
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Top Bar Header Section */}
        <header className="relative w-full">
          {/* Glassmorphic header background with backdrop blur */}
          <div 
            className="absolute backdrop-blur-[17.5px] border-t border-white/20"
            style={{
              left: '0px',
              top: '0px',
              width: '100%',
              height: 'clamp(100px, 15.2vh, 120px)',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          />

          {/* Profile Icon: Responsive positioning and sizing */}
          <div 
            className="absolute flex items-center justify-center"
            style={{
              left: 'clamp(15px, 6.1vw, 23px)',
              top: 'clamp(50px, 7.5vh, 59px)',
              width: 'clamp(30px, 9.3vw, 35px)',
              height: 'clamp(30px, 9.3vw, 35px)'
            }}
          >
            <div className="relative w-full h-full rounded-full border-2 border-white overflow-hidden">
              <Image
                src="/image-for-profile.png"
                alt="Profile"
                width={35}
                height={35}
                className="object-cover w-full h-full"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Search Icon Container: Responsive positioning */}
          <div 
            className="absolute backdrop-blur-[17.5px] border border-white/20 flex items-center justify-center"
            style={{
              right: 'clamp(68px, 18.1vw, 68.5px)', // 375 - 272.5 - 34 = 68.5px from right
              top: 'clamp(50px, 7.6vh, 59.5px)',
              width: 'clamp(28px, 9.1vw, 34px)',
              height: 'clamp(28px, 9.1vw, 34px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <Search size={18} className="text-white" />
          </div>

          {/* Bell Icon Container: Responsive positioning */}
          <div 
            className="absolute backdrop-blur-[17.5px] border border-white/20 flex items-center justify-center"
            style={{
              right: 'clamp(23px, 6.1vw, 23.5px)', // 375 - 317.5 - 34 = 23.5px from right
              top: 'clamp(50px, 7.6vh, 59.5px)',
              width: 'clamp(28px, 9.1vw, 34px)',
              height: 'clamp(28px, 9.1vw, 34px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <Bell size={18} className="text-white" />
          </div>

          {/* My MSCA Text - aligned with icons - Responsive */}
          <div 
            className="absolute flex items-center left-1/2 -translate-x-1/2"
            style={{
              top: 'clamp(50px, 7.6vh, 59.5px)',
              height: 'clamp(28px, 9.1vw, 34px)'
            }}
          >
            <h1 className="text-white text-lg font-medium" style={{ color: '#D8D8D8' }}>
              My MSCA
            </h1>
          </div>
        </header>

        {/* Scrollable content container */}
        <div className="relative w-full overflow-y-auto" style={{ paddingBottom: '60px' }}>
          {/* Registration Title Section - positioned below header with proper spacing */}
          <div 
            className="w-full px-4 pb-4"
            style={{ 
              marginTop: 'clamp(140px, 20vh, 160px)' // Header height (120px) + extra spacing (20-40px)
            }}
          >
            <h2 className="text-white text-2xl font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Complete your registration
            </h2>
            <p className="text-white text-base mb-6" style={{ color: '#FFFFFF' }}>
              Follow the steps
            </p>

            {/* Registration Tabs - matching new-reg-tabs.svg */}
            <div className="relative w-full flex items-center justify-center">
              <div className="relative" style={{ width: 'clamp(300px, 92vw, 345px)', height: '36px' }}>
                {/* Tab 1: Personal Info - Dynamic based on currentSection */}
                <div 
                  className="relative"
                  style={{
                    width: 'clamp(95px, 31.9vw, 110.167px)',
                    height: '34px',
                    borderRadius: '17px',
                    background: currentSection === 'personal' 
                      ? 'rgba(0, 174, 255, 0.3)' // Active: Blue/Cyan
                      : 'rgba(102, 102, 102, 0.3)', // Inactive: Dark grey
                    border: 'none',
                    backdropFilter: 'blur(17.5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '6px',
                    paddingLeft: '4px',
                    paddingRight: '8px',
                    position: 'absolute',
                    left: '0.5px',
                    top: '1px',
                    boxShadow: `
                      inset 2px 2px 4px rgba(0, 0, 0, 0.3),
                      inset -2px -2px 4px rgba(255, 255, 255, 0.1),
                      4px 4px 8px rgba(0, 0, 0, 0.2),
                      -2px -2px 4px rgba(255, 255, 255, 0.05)
                    `
                  }}
                >
                  {/* Circle with "1" - Green when active, grey when inactive */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: currentSection === 'personal'
                        ? 'rgba(0, 255, 21, 0.3)' // Active: Green
                        : 'rgba(102, 102, 102, 0.3)', // Inactive: Grey
                      border: 'none',
                      backdropFilter: 'blur(17.5px)',
                      boxShadow: `
                        inset 1px 1px 2px rgba(0, 0, 0, 0.3),
                        inset -1px -1px 2px rgba(255, 255, 255, 0.2),
                        2px 2px 4px rgba(0, 0, 0, 0.2),
                        -1px -1px 2px rgba(255, 255, 255, 0.1)
                      `
                    }}
                  >
                    <span style={{ color: '#D8D8D8', fontSize: '11px', fontWeight: '500' }}>1</span>
                  </div>
                  {/* Text: Personal */}
                  <span style={{ 
                    color: currentSection === 'personal' ? '#40D58E' : '#FFFFFF', // Active: Teal, Inactive: White
                    fontSize: '11px', 
                    fontWeight: '500', 
                    whiteSpace: 'nowrap' 
                  }}>
                    Personal
                  </span>
                </div>

                {/* Connecting Line 1 */}
                <div 
                  className="absolute"
                  style={{
                    left: 'clamp(95px, 32.2vw, 111px)',
                    top: '17px',
                    width: 'clamp(5px, 1.7vw, 6px)',
                    height: '2px',
                    background: 'white'
                  }}
                />

                {/* Tab 2: Additional Details - Dynamic based on currentSection */}
                <div 
                  className="absolute"
                  style={{
                    left: 'clamp(111px, 37vw, 117.417px)',
                    width: 'clamp(95px, 31.9vw, 110.167px)',
                    height: '34px',
                    borderRadius: '17px',
                    background: currentSection === 'additional'
                      ? 'rgba(0, 174, 255, 0.3)' // Active: Blue/Cyan
                      : 'rgba(102, 102, 102, 0.3)', // Inactive: Dark grey
                    border: 'none',
                    backdropFilter: 'blur(17.5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '6px',
                    paddingLeft: '4px',
                    paddingRight: '8px',
                    top: '1px',
                    boxShadow: `
                      inset 2px 2px 4px rgba(0, 0, 0, 0.3),
                      inset -2px -2px 4px rgba(255, 255, 255, 0.1),
                      4px 4px 8px rgba(0, 0, 0, 0.2),
                      -2px -2px 4px rgba(255, 255, 255, 0.05)
                    `
                  }}
                >
                  {/* Circle with "2" - Green when active, grey when inactive */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: currentSection === 'additional'
                        ? 'rgba(0, 255, 21, 0.3)' // Active: Green
                        : 'rgba(102, 102, 102, 0.3)', // Inactive: Grey
                      border: 'none',
                      backdropFilter: 'blur(17.5px)',
                      boxShadow: `
                        inset 1px 1px 2px rgba(0, 0, 0, 0.3),
                        inset -1px -1px 2px rgba(255, 255, 255, 0.2),
                        2px 2px 4px rgba(0, 0, 0, 0.2),
                        -1px -1px 2px rgba(255, 255, 255, 0.1)
                      `
                    }}
                  >
                    <span style={{ color: '#D8D8D8', fontSize: '11px', fontWeight: '500' }}>2</span>
                  </div>
                  {/* Text: Additional */}
                  <span style={{ 
                    color: currentSection === 'additional' ? '#40D58E' : '#FFFFFF', // Active: Teal, Inactive: White
                    fontSize: '11px', 
                    fontWeight: '500', 
                    whiteSpace: 'nowrap' 
                  }}>
                    Additional
                  </span>
                </div>

                {/* Connecting Line 2 */}
                <div 
                  className="absolute"
                  style={{
                    left: 'clamp(206px, 68.7vw, 228px)',
                    top: '17px',
                    width: 'clamp(5px, 1.7vw, 6px)',
                    height: '2px',
                    background: 'white'
                  }}
                />

                {/* Tab 3: Review - Dynamic based on currentSection */}
                <div 
                  className="absolute"
                  style={{
                    left: 'clamp(222px, 74vw, 234.333px)',
                    width: 'clamp(95px, 31.9vw, 110.167px)',
                    height: '34px',
                    borderRadius: '17px',
                    background: currentSection === 'review'
                      ? 'rgba(0, 174, 255, 0.3)' // Active: Blue/Cyan
                      : 'rgba(102, 102, 102, 0.3)', // Inactive: Dark grey
                    border: 'none',
                    backdropFilter: 'blur(17.5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '6px',
                    paddingLeft: '4px',
                    paddingRight: '8px',
                    top: '1px',
                    boxShadow: `
                      inset 2px 2px 4px rgba(0, 0, 0, 0.3),
                      inset -2px -2px 4px rgba(255, 255, 255, 0.1),
                      4px 4px 8px rgba(0, 0, 0, 0.2),
                      -2px -2px 4px rgba(255, 255, 255, 0.05)
                    `
                  }}
                >
                  {/* Circle with "3" - Green when active, grey when inactive */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: currentSection === 'review'
                        ? 'rgba(0, 255, 21, 0.3)' // Active: Green
                        : 'rgba(102, 102, 102, 0.3)', // Inactive: Grey
                      border: 'none',
                      backdropFilter: 'blur(17.5px)',
                      boxShadow: `
                        inset 1px 1px 2px rgba(0, 0, 0, 0.3),
                        inset -1px -1px 2px rgba(255, 255, 255, 0.2),
                        2px 2px 4px rgba(0, 0, 0, 0.2),
                        -1px -1px 2px rgba(255, 255, 255, 0.1)
                      `
                    }}
                  >
                    <span style={{ color: '#D8D8D8', fontSize: '11px', fontWeight: '500' }}>3</span>
                  </div>
                  {/* Text: Review */}
                  <span style={{ 
                    color: currentSection === 'review' ? '#40D58E' : '#FFFFFF', // Active: Teal, Inactive: White
                    fontSize: '11px', 
                    fontWeight: '500', 
                    whiteSpace: 'nowrap' 
                  }}>
                    Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1 - Personal Information */}
          {currentSection === 'personal' && (
          <section 
            className="w-full px-4 py-6"
            style={{ minHeight: '100vh', paddingTop: 'clamp(40px, 6vh, 60px)' }}
          >
            {/* Heading */}
            <h2
              className="mb-2"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: '600',
                letterSpacing: '0.3px',
                lineHeight: '1.3'
              }}
            >
              Personal Details
            </h2>
            {/* Subheading */}
            <p
              className="mb-6"
              style={{
                color: '#D8D8D8',
                fontSize: 'clamp(12px, 3vw, 16px)',
                fontWeight: '400',
                letterSpacing: '0.2px',
                lineHeight: '1.5'
              }}
            >
              Let us get to know you a bit better by sharing your basic info
            </p>

            {/* First Name Input Field */}
            <div className="mb-4">
              {/* Label */}
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                First name <span style={{ color: '#FF0000' }}>*</span>
              </label>
              {/* Input Field */}
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Middle Name Input Field */}
            <div className="mb-4">
              {/* Label */}
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Middle name <span style={{ color: '#FF0000' }}>*</span>
              </label>
              {/* Input Field */}
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Last Name Input Field */}
            <div className="mb-4">
              {/* Label */}
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Last name <span style={{ color: '#FF0000' }}>*</span>
              </label>
              {/* Input Field */}
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Email Input Field */}
            <div className="mb-4">
              {/* Label */}
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Email <span style={{ color: '#FF0000' }}>*</span>
              </label>
              {/* Input Field */}
              <input
                type="email"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Sex Input Field */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Sex <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Age Input Field */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Age <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="number"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* DOB Input Field */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                DOB <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <div className="relative" ref={datePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={dobValue || ''}
                      placeholder="mm/dd/yy"
                      className="w-full cursor-pointer"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      style={{
                        height: 'clamp(44px, 6vh, 52px)',
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '0.5px solid rgba(255, 255, 255, 0.2)',
                        padding: '0 clamp(16px, 4vw, 20px)',
                        paddingRight: 'clamp(40px, 10vw, 48px)',
                        color: dobValue ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                        letterSpacing: '0.2px',
                        outline: 'none',
                        backdropFilter: 'blur(17.5px)',
                        cursor: 'pointer'
                      }}
                    />
                    <Calendar
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ color: '#FFFFFF', pointerEvents: 'auto' }}
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    />
                    
                    {/* Custom Date Picker Popup */}
                    {showDatePicker && (
                      <div
                        className="absolute z-50 mt-2"
                        style={{
                          width: '100%',
                          maxWidth: 'clamp(280px, 90vw, 340px)',
                          borderRadius: '20px',
                          background: 'rgba(0, 0, 0, 0.9)',
                          border: '0.5px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(17.5px)',
                          boxShadow: `
                            inset 2px 2px 4px rgba(0, 0, 0, 0.3),
                            inset -2px -2px 4px rgba(255, 255, 255, 0.1),
                            8px 8px 16px rgba(0, 0, 0, 0.5),
                            -2px -2px 4px rgba(255, 255, 255, 0.05)
                          `,
                          padding: '16px',
                          top: '100%',
                          left: '0',
                          marginTop: '8px'
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span
                              style={{
                                color: '#FFFFFF',
                                fontSize: '16px',
                                fontWeight: '600'
                              }}
                            >
                              {monthNames[currentMonth]} {currentYear}
                            </span>
                            <div className="flex flex-col">
                              <ChevronUp
                                size={12}
                                className="cursor-pointer"
                                style={{ color: '#FFFFFF' }}
                                onClick={() => navigateMonth('next')}
                              />
                              <ChevronDown
                                size={12}
                                className="cursor-pointer -mt-1"
                                style={{ color: '#FFFFFF' }}
                                onClick={() => navigateMonth('prev')}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Days of Week */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map((day) => (
                            <div
                              key={day}
                              className="text-center py-2"
                              style={{
                                color: '#D8D8D8',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {getCalendarDays().map((day, index) => {
                            if (day === null) {
                              return <div key={index} className="py-2" />;
                            }

                            const isSelected = selectedDate && 
                              selectedDate.getDate() === day &&
                              selectedDate.getMonth() === currentMonth &&
                              selectedDate.getFullYear() === currentYear;

                            const isToday = new Date().getDate() === day &&
                              new Date().getMonth() === currentMonth &&
                              new Date().getFullYear() === currentYear;

                            return (
                              <div
                                key={index}
                                className="text-center py-2 cursor-pointer rounded-lg transition-all"
                                onClick={() => handleDateSelect(day)}
                                style={{
                                  color: isSelected ? '#FFFFFF' : '#D8D8D8',
                                  fontSize: '14px',
                                  fontWeight: isSelected ? '600' : '400',
                                  background: isSelected
                                    ? 'linear-gradient(135deg, rgba(0, 174, 255, 0.5) 0%, rgba(13, 55, 60, 0.5) 100%)'
                                    : 'transparent',
                                  border: isSelected
                                    ? '1px solid rgba(255, 165, 0, 0.6)'
                                    : isToday
                                    ? '1px solid rgba(255, 255, 255, 0.3)'
                                    : 'none',
                                  boxShadow: isSelected
                                    ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    : 'none'
                                }}
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-between mt-4 pt-4 border-t border-white/20">
                          <button
                            onClick={clearDate}
                            className="px-4 py-2 rounded-lg transition-all"
                            style={{
                              color: '#FFFFFF',
                              fontSize: '14px',
                              fontWeight: '500',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '0.5px solid rgba(255, 255, 255, 0.2)'
                            }}
                          >
                            Clear
                          </button>
                          <button
                            onClick={goToToday}
                            className="px-4 py-2 rounded-lg transition-all"
                            style={{
                              color: '#FFFFFF',
                              fontSize: '14px',
                              fontWeight: '500',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '0.5px solid rgba(255, 255, 255, 0.2)'
                            }}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
            </div>

            {/* Blood Group Dropdown */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Blood Group <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <select
                className="w-full"
                value={bloodGroup}
                onChange={(e) => {
                  const value = e.target.value;
                  setBloodGroup(value);
                  if (value === 'custom') {
                    setShowCustomBloodGroup(true);
                  } else {
                    setShowCustomBloodGroup(false);
                    setCustomBloodGroup('');
                  }
                }}
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FFFFFF' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right clamp(16px, 4vw, 20px) center',
                  paddingRight: 'clamp(40px, 10vw, 48px)'
                }}
              >
                <option value="" disabled style={{ background: '#1a1a1a', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Select blood group
                </option>
                <option value="A+ ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>A+ ve</option>
                <option value="A- ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>A- ve</option>
                <option value="B+ ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>B+ ve</option>
                <option value="B- ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>B- ve</option>
                <option value="AB+ ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>AB+ ve</option>
                <option value="AB- ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>AB- ve</option>
                <option value="O+ ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>O+ ve</option>
                <option value="O- ve" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>O- ve</option>
                <option value="custom" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>Custom</option>
              </select>
              
              {/* Custom Blood Group Input */}
              {showCustomBloodGroup && (
                <input
                  type="text"
                  value={customBloodGroup}
                  onChange={(e) => setCustomBloodGroup(e.target.value)}
                  placeholder="Enter custom blood group"
                  className="w-full mt-2"
                  style={{
                    height: 'clamp(44px, 6vh, 52px)',
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '0.5px solid rgba(255, 255, 255, 0.2)',
                    padding: '0 clamp(16px, 4vw, 20px)',
                    color: '#FFFFFF',
                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                    letterSpacing: '0.2px',
                    outline: 'none',
                    backdropFilter: 'blur(17.5px)'
                  }}
                />
              )}
            </div>

            {/* Height Input Field */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Height <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Weight Input Field */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Weight <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Address Textarea Field */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Address <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <textarea
                className="w-full"
                placeholder=""
                rows={4}
                style={{
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: 'clamp(12px, 3vh, 16px) clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  resize: 'vertical',
                  minHeight: 'clamp(100px, 12vh, 120px)'
                }}
              />
            </div>

            {/* Aadharcard no Input Field */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Aadharcard no <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Photo Upload Field */}
            <div className="mb-6">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Photo <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2"
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <span>Add File</span>
                <Upload size={18} />
              </button>
            </div>

            {/* Save and Next Button */}
            <div style={{ marginBottom: 'clamp(60px, 7vh, 75px)' }}>
              <button
                type="button"
                className="w-full flex items-center justify-center"
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #00AEFF 0%, #1F93F2 100%)',
                  border: 'none',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '500',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0, 174, 255, 0.3)'
                }}
                onClick={() => {
                  setCurrentSection('additional');
                  setTimeout(() => {
                    additionalDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Save and next
              </button>
            </div>
          </section>
          )}

          {/* Section 2 - Additional Details */}
          {currentSection === 'additional' && (
          <section 
            ref={additionalDetailsRef}
            className="w-full px-4 py-6"
            style={{ minHeight: '100vh', paddingTop: 'clamp(40px, 6vh, 60px)' }}
          >
            {/* Heading */}
            <h2
              className="mb-2"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: '600',
                letterSpacing: '0.3px',
                lineHeight: '1.3'
              }}
            >
              Additional Details
            </h2>
            
            {/* Subheading */}
            <p
              className="mb-6"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                letterSpacing: '0.2px',
                lineHeight: '1.5'
              }}
            >
              Please provide additional information to complete your profile
            </p>

            {/* Emergency Contact Name */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Emergency Contact Name <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Emergency Contact Phone */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Emergency Contact Phone <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="tel"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Relationship to Emergency Contact */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Relationship <span style={{ color: '#FF0000' }}>*</span>
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Occupation */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Occupation
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Medical Conditions */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Medical Conditions
              </label>
              <textarea
                className="w-full"
                placeholder="List any existing medical conditions"
                rows={4}
                style={{
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: 'clamp(12px, 3vh, 16px) clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  resize: 'vertical',
                  minHeight: 'clamp(100px, 12vh, 120px)'
                }}
              />
            </div>

            {/* Allergies */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Allergies
              </label>
              <textarea
                className="w-full"
                placeholder="List any known allergies"
                rows={3}
                style={{
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: 'clamp(12px, 3vh, 16px) clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  resize: 'vertical',
                  minHeight: 'clamp(80px, 10vh, 100px)'
                }}
              />
            </div>

            {/* Current Medications */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Current Medications
              </label>
              <textarea
                className="w-full"
                placeholder="List any current medications"
                rows={3}
                style={{
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: 'clamp(12px, 3vh, 16px) clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  resize: 'vertical',
                  minHeight: 'clamp(80px, 10vh, 100px)'
                }}
              />
            </div>

            {/* Insurance Provider */}
            <div className="mb-4">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Insurance Provider
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Insurance Policy Number */}
            <div className="mb-6">
              <label
                className="block mb-2"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '400',
                  letterSpacing: '0.2px'
                }}
              >
                Insurance Policy Number
              </label>
              <input
                type="text"
                className="w-full"
                placeholder=""
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '0.5px solid rgba(255, 255, 255, 0.2)',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)'
                }}
              />
            </div>

            {/* Save and Next Button */}
            <div style={{ marginBottom: 'clamp(60px, 7vh, 75px)' }}>
              <button
                type="button"
                className="w-full flex items-center justify-center"
                style={{
                  height: 'clamp(44px, 6vh, 52px)',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #00AEFF 0%, #1F93F2 100%)',
                  border: 'none',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: '500',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0, 174, 255, 0.3)'
                }}
                onClick={() => {
                  setCurrentSection('review');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Save and next
              </button>
            </div>
          </section>
          )}

          {/* Section 3 - Review */}
          {currentSection === 'review' && (
          <section 
            className="w-full px-4 py-6"
            style={{ minHeight: '100vh', paddingTop: 'clamp(40px, 6vh, 60px)' }}
          >
            {/* Heading */}
            <h2
              className="mb-2"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: '600',
                letterSpacing: '0.3px',
                lineHeight: '1.3'
              }}
            >
              Review
            </h2>
            
            {/* Subheading */}
            <p
              className="mb-6"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                letterSpacing: '0.2px',
                lineHeight: '1.5'
              }}
            >
              Please review and confirm your information
            </p>

            {/* Terms & Conditions Section */}
            <div className="mb-6">
              <h3
                className="mb-3"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  fontWeight: '600',
                  letterSpacing: '0.2px',
                  marginBottom: 'clamp(12px, 2vh, 16px)'
                }}
              >
                Terms & Conditions
              </h3>
              
              <p
                className="mb-4"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  letterSpacing: '0.2px',
                  lineHeight: '1.6',
                  marginBottom: 'clamp(16px, 3vh, 20px)'
                }}
              >
                Confirm that the applicant understands the MSCA rules, safety guidelines, and liability clauses.
              </p>

              {/* Checkbox with confirmation text */}
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setTermsAccepted(!termsAccepted)}
                style={{
                  padding: 'clamp(12px, 2vh, 16px)',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '0.5px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(17.5px)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                {/* Checkbox */}
                <div
                  className="flex-shrink-0 mt-0.5"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: termsAccepted 
                      ? 'linear-gradient(135deg, #00AEFF 0%, #1F93F2 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: termsAccepted 
                      ? 'none'
                      : '0.5px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {termsAccepted && (
                    <Check 
                      size={18} 
                      style={{ color: '#FFFFFF', strokeWidth: 3 }} 
                    />
                  )}
                </div>
                
                {/* Confirmation Text */}
                <p
                  style={{
                    color: termsAccepted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: 'clamp(13px, 3.2vw, 15px)',
                    letterSpacing: '0.2px',
                    lineHeight: '1.6',
                    flex: 1,
                    transition: 'color 0.2s'
                  }}
                >
                  I confirm that the applicant has read and agrees to the MSCA rules, agreements, and safety guidelines, and acknowledges the associated risks of sport climbing.
                </p>
              </div>
            </div>

            {/* Submit Form Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  if (!termsAccepted) {
                    alert('Please accept the Terms & Conditions to submit the form.');
                    return;
                  }
                  // Handle form submission here
                  alert('Form submitted successfully!');
                  router.push('/dashboard');
                }}
                disabled={!termsAccepted}
                className="w-full flex items-center justify-center"
                style={{
                  height: 'clamp(50px, 7vh, 56px)',
                  borderRadius: '24px',
                  background: termsAccepted
                    ? 'linear-gradient(135deg, #00AEFF 0%, #1F93F2 100%)'
                    : 'rgba(102, 102, 102, 0.5)',
                  border: 'none',
                  padding: '0 clamp(16px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontSize: 'clamp(15px, 3.8vw, 18px)',
                  fontWeight: '600',
                  letterSpacing: '0.2px',
                  outline: 'none',
                  backdropFilter: 'blur(17.5px)',
                  cursor: termsAccepted ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: termsAccepted
                    ? '0 4px 12px rgba(0, 174, 255, 0.3)'
                    : 'none',
                  opacity: termsAccepted ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (termsAccepted) {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (termsAccepted) {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                Submit form
              </button>
            </div>
          </section>
          )}
        </div>
      </div>

      {/* Navbar container: fixed at bottom of viewport, responsive width, fixed height, overflow visible */}
      <div
        style={{
          position: 'fixed',
          bottom: 'clamp(10px, 2.5vh, 20px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(260px, 77.6%, 291px)',
          maxWidth: '291px',
          height: '62px',
          overflow: 'visible',
          zIndex: 9999
        }}
      >
        {/* Main navbar rectangle - fills the container */}
        <div
          className="relative w-full h-full"
          style={{
            borderRadius: '19.5px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(102, 102, 102, 0.5) 100%)',
            padding: '1px',
            backdropFilter: 'blur(17.5px)',
            zIndex: 1
          }}
        >
          {/* Inner rectangle with content */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: '19.5px',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Icons container - positioned within the main rectangle */}
            <div className="relative w-full h-full flex items-center justify-between" style={{ paddingLeft: 'clamp(20px, 8.9%, 26px)', paddingRight: 'clamp(20px, 8.9%, 26px)' }}>
              {/* Home Icon - responsive sizing */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <HomeIcon size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </div>

              {/* Document Icon - responsive sizing */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <FileText size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </div>

              {/* Spacer for QR code (centered) */}
              <div style={{ width: 'clamp(50px, 20.3%, 59px)' }} />

              {/* Calendar Icon - responsive sizing */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(20px, 6.7%, 25px)', height: 'clamp(20px, 6.7%, 25px)' }}>
                <Calendar size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </div>

              {/* Profile Icon - responsive sizing */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <User size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Circle - matching qr-code-circle.svg - Responsive */}
        {/* Positioned absolutely with negative top to float above navbar - 50% extends above */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 'clamp(-28px, -5.6vw, -35.5px)', // Negative top: responsive, maintains 50% above
            width: 'clamp(56px, 18.9vw, 71px)', // Responsive width
            height: 'clamp(56px, 18.9vw, 71px)', // Responsive height
            zIndex: 50 // Above navbar items
          }}
        >
          {/* Drop shadow - dy=6, blur stdDeviation=3, opacity 0.4 */}
          <div
            className="absolute rounded-full"
            style={{
              width: 'clamp(47px, 15.7vw, 59px)',
              height: 'clamp(47px, 15.7vw, 59px)',
              left: 'clamp(4.5px, 1.6vw, 6px)',
              top: 'clamp(4.5px, 1.6vw, 6px)',
              background: 'rgba(0, 0, 0, 0.4)',
              filter: 'blur(3px)',
              borderRadius: '50%',
              zIndex: 0
            }}
          />
          {/* Outer gradient circle - #1F93F2 to #61C5F9 */}
          <div
            className="absolute rounded-full"
            style={{
              width: 'clamp(47px, 15.7vw, 59px)',
              height: 'clamp(47px, 15.7vw, 59px)',
              left: 'clamp(4.5px, 1.6vw, 6px)',
              top: '0px',
              background: 'linear-gradient(180deg, #1F93F2 0%, #61C5F9 100%)',
              borderRadius: '50%',
              zIndex: 1
            }}
          />
          {/* Inner white circle with blur - stdDeviation=1.95 */}
          <div
            className="absolute rounded-full"
            style={{
              width: 'clamp(37px, 12.5vw, 47px)',
              height: 'clamp(37px, 12.5vw, 47px)',
              left: 'clamp(9.5px, 3.2vw, 12px)',
              top: 'clamp(4.5px, 1.6vw, 6px)',
              background: 'white',
              borderRadius: '50%',
              filter: 'blur(1.95px)',
              zIndex: 2
            }}
          />
        </div>
      </div>
    </MobileContainer>
  );
}

