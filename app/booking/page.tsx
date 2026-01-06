'use client';

import MobileContainer from '@/components/MobileContainer';
import { ArrowLeft, Calendar, Clock, CalendarDays } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import { Check, ChevronDown } from 'lucide-react';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);
  
  // Get booking details from URL params
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const duration = searchParams.get('duration') || '';
  
  // Duration to amount mapping (in paise - 1 rupee = 100 paise)
  const getAmountForDuration = (duration: string): number => {
    const amountMap: { [key: string]: number } = {
      '1 Month': 750000,        // ₹7,500
      '3 Months': 2250000,      // ₹22,500
      '6 Months': 4500000,      // ₹45,000
      'Yearly': 9000000,        // ₹90,000
      'Single Slot pass': 50000, // ₹500
      'Full Day pass': 100000   // ₹1,000
    };
    return amountMap[duration] || 750000; // Default to ₹7,500 if not found
  };

  const paymentAmount = getAmountForDuration(duration);
  
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
      amount: paymentAmount, // Amount in paise based on selected duration
      currency: 'INR',
      name: 'MSCA Booking',
      description: `MSCA Slot Booking - ${duration}`,
      image: '/logo.png', // Optional: Your logo URL
      handler: function (response: any) {
        // Handle successful payment
        console.log('Payment successful:', response);
        alert('Payment successful! Your slot has been booked. Payment ID: ' + response.razorpay_payment_id);
        // Navigate to new home screen after payment
        router.push('/home');
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

  return (
    <MobileContainer>
      <div className="relative w-full min-h-screen bg-black overflow-y-auto">
        {/* Header */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between"
          style={{
            padding: 'clamp(12px, 3.2vw, 16px) clamp(20px, 5.3vw, 24px)',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center"
            style={{
              width: 'clamp(32px, 8.5vw, 40px)',
              height: 'clamp(32px, 8.5vw, 40px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </button>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(18px, 4.8vw, 22px)',
              fontWeight: '600',
              letterSpacing: '0.3px'
            }}
          >
            Booking Details
          </h1>
          <div style={{ width: 'clamp(32px, 8.5vw, 40px)' }} /> {/* Spacer for centering */}
        </div>

        {/* Booking Details Card */}
        <div
          className="mx-auto mt-8"
          style={{
            width: 'clamp(280px, 86.1vw, 323px)',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            padding: 'clamp(24px, 6.4vw, 32px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(20px, 5.3vw, 24px)',
              fontWeight: '600',
              marginBottom: 'clamp(12px, 3.2vw, 16px)',
              letterSpacing: '0.3px'
            }}
          >
            Booking Summary
          </h2>
          
          {/* Note about slot duration */}
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 'clamp(12px, 3.2vw, 14px)',
              marginBottom: 'clamp(24px, 6.4vw, 32px)',
              fontStyle: 'italic',
              paddingLeft: '4px'
            }}
          >
            Note: Slot will be of 2 hours
          </p>

          {/* Date */}
          <div
            className="flex items-center mb-6"
            style={{
              paddingBottom: 'clamp(16px, 4.3vw, 20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              className="flex items-center justify-center mr-4"
              style={{
                width: 'clamp(40px, 10.7vw, 48px)',
                height: 'clamp(40px, 10.7vw, 48px)',
                borderRadius: '12px',
                background: 'rgba(30, 144, 255, 0.2)'
              }}
            >
              <Calendar size={20} color="#1E90FF" />
            </div>
            <div className="flex-1">
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: 'clamp(12px, 3.2vw, 14px)',
                  marginBottom: '4px'
                }}
              >
                Date
              </p>
              <p
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(16px, 4.3vw, 18px)',
                  fontWeight: '500'
                }}
              >
                {date}
              </p>
            </div>
          </div>

          {/* Time */}
          <div
            className="flex items-center mb-6"
            style={{
              paddingBottom: 'clamp(16px, 4.3vw, 20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              className="flex items-center justify-center mr-4"
              style={{
                width: 'clamp(40px, 10.7vw, 48px)',
                height: 'clamp(40px, 10.7vw, 48px)',
                borderRadius: '12px',
                background: 'rgba(30, 255, 0, 0.2)'
              }}
            >
              <Clock size={20} color="#1EFF00" />
            </div>
            <div className="flex-1">
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: 'clamp(12px, 3.2vw, 14px)',
                  marginBottom: '4px'
                }}
              >
                Time Slot
              </p>
              <p
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(16px, 4.3vw, 18px)',
                  fontWeight: '500'
                }}
              >
                {time}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center">
            <div
              className="flex items-center justify-center mr-4"
              style={{
                width: 'clamp(40px, 10.7vw, 48px)',
                height: 'clamp(40px, 10.7vw, 48px)',
                borderRadius: '12px',
                background: 'rgba(255, 200, 0, 0.2)'
              }}
            >
              <CalendarDays size={20} color="#FFC800" />
            </div>
            <div className="flex-1">
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: 'clamp(12px, 3.2vw, 14px)',
                  marginBottom: '4px'
                }}
              >
                Duration
              </p>
              <p
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(16px, 4.3vw, 18px)',
                  fontWeight: '500'
                }}
              >
                {duration}
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <div
          className="mx-auto mt-6"
          style={{
            width: 'clamp(280px, 86.1vw, 323px)',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            padding: 'clamp(24px, 6.4vw, 32px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(20px, 5.3vw, 24px)',
              fontWeight: '600',
              marginBottom: 'clamp(12px, 3.2vw, 16px)',
              letterSpacing: '0.3px'
            }}
          >
            Terms & Conditions
          </h2>
          
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 'clamp(14px, 3.7vw, 16px)',
              marginBottom: 'clamp(20px, 5.3vw, 24px)',
              lineHeight: '1.5'
            }}
          >
            Confirm that the applicant understands the MSCA rules, safety guidelines, and liability clauses.
          </p>

          {/* Read More Button */}
          <button
            type="button"
            onClick={() => setShowFullTerms(!showFullTerms)}
            className="mb-4 flex items-center"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#1E90FF',
              fontSize: 'clamp(14px, 3.7vw, 16px)',
              cursor: 'pointer',
              padding: '0',
              fontWeight: '500'
            }}
          >
            <span style={{ marginRight: '8px' }}>Read more</span>
            <ChevronDown
              size={18}
              style={{
                transform: showFullTerms ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </button>

          {/* Full Terms & Conditions (Expandable) */}
          {showFullTerms && (
            <div
              style={{
                marginBottom: 'clamp(20px, 5.3vw, 24px)',
                padding: 'clamp(16px, 4.3vw, 20px)',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'clamp(12px, 3.2vw, 14px)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line'
                }}
              >
                <p style={{ marginBottom: '16px', fontWeight: '600' }}>1. Introduction</p>
                <p style={{ marginBottom: '16px' }}>
                  Welcome to the Maharashtra Sports Climbing Association (MSCA) app. These Terms and Conditions govern your use of our website, services, and facilities. By accessing or using our services, you agree to be bound by these terms.
                </p>
                <p style={{ marginBottom: '24px' }}>
                  MSCA is a registered sports association dedicated to promoting sport climbing in Maharashtra, India. We operate training facilities, organize competitions, and provide coaching services.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>2. Acceptance of Terms</p>
                <p style={{ marginBottom: '16px' }}>
                  By accessing this app, registering for programs, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
                </p>
                <p style={{ marginBottom: '24px' }}>
                  If you do not agree with any part of these terms, you must not use our website or services.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>3. Use of Services</p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>3.1 Eligibility</p>
                <p style={{ marginBottom: '16px' }}>
                  You must be at least 18 years old to register for programs independently. Minors must have parental or guardian consent and supervision.
                </p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>3.2 Account Registration</p>
                <p style={{ marginBottom: '8px' }}>When registering for programs or creating an account, you agree to:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information as necessary</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>3.3 Prohibited Activities</p>
                <p style={{ marginBottom: '8px' }}>You agree not to:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '24px' }}>
                  <li>Use our services for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Transmit any viruses, malware, or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services or servers</li>
                  <li>Use automated systems to access our website without permission</li>
                </ul>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>4. Training Programs and Memberships</p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>4.1 Program Registration</p>
                <p style={{ marginBottom: '16px' }}>
                  Registration for training programs, competitions, and memberships is subject to availability and acceptance by MSCA. We reserve the right to refuse registration for any reason.
                </p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>4.2 Fees and Payments</p>
                <p style={{ marginBottom: '16px' }}>
                  All program fees must be paid in full before the program start date unless alternative payment arrangements are approved in writing by MSCA.
                </p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>4.3 Program Modifications</p>
                <p style={{ marginBottom: '16px' }}>
                  MSCA reserves the right to modify, cancel, or reschedule programs due to unforeseen circumstances, including but not limited to weather, facility issues, or instructor availability.
                </p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>4.4 Participant Conduct</p>
                <p style={{ marginBottom: '24px' }}>
                  All participants must follow safety rules, respect facility equipment, and conduct themselves appropriately. Violation of conduct rules may result in removal from programs without refund.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>5. Intellectual Property</p>
                <p style={{ marginBottom: '16px' }}>
                  All content on this website, including text, graphics, logos, images, and software, is the property of MSCA or its content suppliers and is protected by Indian and international copyright laws.
                </p>
                <p style={{ marginBottom: '24px' }}>
                  You may not reproduce, distribute, modify, or create derivative works from our content without express written permission from MSCA.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>6. Liability and Disclaimers</p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>6.1 Sport Climbing Risks</p>
                <p style={{ marginBottom: '16px' }}>
                  Sport climbing involves inherent risks of injury or death. By participating in our programs or using our facilities, you acknowledge and accept these risks. Participants must follow all safety instructions and use appropriate safety equipment.
                </p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>6.2 Limitation of Liability</p>
                <p style={{ marginBottom: '16px' }}>
                  To the maximum extent permitted by law, MSCA, its officers, employees, and agents shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of our services or facilities.
                </p>
                <p style={{ marginBottom: '8px', fontWeight: '500' }}>6.3 Website Availability</p>
                <p style={{ marginBottom: '24px' }}>
                  We do not guarantee that our app will be available at all times or free from errors, viruses, or other harmful components. We are not responsible for any loss or damage resulting from website unavailability.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>7. Privacy</p>
                <p style={{ marginBottom: '16px' }}>
                  Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
                <p style={{ marginBottom: '24px' }}>
                  By using our services, you consent to the collection and use of information as described in our Privacy Policy.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>8. Modifications to Terms</p>
                <p style={{ marginBottom: '16px' }}>
                  MSCA reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this website.
                </p>
                <p style={{ marginBottom: '24px' }}>
                  Your continued use of our services after changes are posted constitutes acceptance of the modified terms. We encourage you to review these terms periodically.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>9. Governing Law</p>
                <p style={{ marginBottom: '16px' }}>
                  These Terms and Conditions are governed by and constructed in accordance with the laws of India and the state of Maharashtra.
                </p>
                <p style={{ marginBottom: '24px' }}>
                  Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
                </p>

                <p style={{ marginBottom: '16px', fontWeight: '600' }}>10. Contact Information</p>
                <p style={{ marginBottom: '8px' }}>If you have any questions about these Terms and Conditions, please contact us:</p>
                <p style={{ marginBottom: '4px' }}>Maharashtra Sports Climbing Association</p>
                <p style={{ marginBottom: '4px' }}>PCMC Yoga Park, Pimpri Chinchwad</p>
                <p style={{ marginBottom: '4px' }}>Pune, Maharashtra, India</p>
                <p style={{ marginBottom: '4px' }}>Email: info@mymsca.org</p>
                <p style={{ marginBottom: '16px' }}>Website: www.mymsca.org</p>
              </div>
            </div>
          )}

          {/* Terms Acceptance Checkbox */}
          <div
            onClick={() => setTermsAccepted(!termsAccepted)}
            className="flex items-start cursor-pointer"
            style={{
              padding: 'clamp(16px, 4.3vw, 20px)',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0 mr-3"
              style={{
                width: 'clamp(20px, 5.3vw, 24px)',
                height: 'clamp(20px, 5.3vw, 24px)',
                borderRadius: '4px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                background: termsAccepted ? 'rgba(30, 255, 0, 0.8)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {termsAccepted && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
            </div>
            <p
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                lineHeight: '1.5',
                margin: 0
              }}
            >
              I confirm that the applicant has read and agrees to the MSCA rules, agreements, and safety guidelines, and acknowledges the associated risks of sport climbing.
            </p>
          </div>
        </div>

        {/* Payment Button */}
        <div className="flex justify-center mt-8 mb-8">
          <button
            type="button"
            onClick={handlePayment}
            disabled={!razorpayLoaded || !termsAccepted}
            className="cursor-pointer"
            style={{
              width: 'clamp(280px, 86.1vw, 323px)',
              height: 'clamp(50px, 6.7vh, 56px)',
              borderRadius: '20.25px',
              background: (razorpayLoaded && termsAccepted)
                ? 'linear-gradient(135deg, rgba(30, 255, 0, 0.6) 0%, rgba(13, 255, 0, 0.6) 100%)'
                : 'rgba(102, 102, 102, 0.5)',
              border: '0.5px solid rgba(133, 133, 133, 0.5)',
              backdropFilter: 'blur(17.5px)',
              boxShadow: (razorpayLoaded && termsAccepted)
                ? '0 4px 12px rgba(30, 255, 0, 0.3)'
                : 'none',
              transition: 'all 0.2s ease',
              cursor: (razorpayLoaded && termsAccepted) ? 'pointer' : 'not-allowed',
              opacity: (razorpayLoaded && termsAccepted) ? 1 : 0.6,
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (razorpayLoaded && termsAccepted) {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'scale(0.98)';
              }
            }}
            onMouseLeave={(e) => {
              if (razorpayLoaded && termsAccepted) {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <span
              className="font-medium"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(16px, 4.3vw, 18px)',
                letterSpacing: '0.3px'
              }}
            >
              {!razorpayLoaded ? 'Loading...' : !termsAccepted ? 'Accept Terms to Proceed' : 'Proceed to Payment'}
            </span>
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={
      <MobileContainer>
        <div className="relative w-full min-h-screen bg-black flex items-center justify-center">
          <p style={{ color: '#FFFFFF' }}>Loading...</p>
        </div>
      </MobileContainer>
    }>
      <BookingContent />
    </Suspense>
  );
}

