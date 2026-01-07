'use client';

import MobileContainer from '@/components/MobileContainer';
import { Bell, Search, Home as HomeIcon, FileText, Calendar, User, ScanLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function StaffPage() {
  const [showQRModal, setShowQRModal] = useState(false); // QR scanner modal state
  const [isScanning, setIsScanning] = useState(false); // Track scanning state
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScanningRef = useRef(false);

  // Initialize scanner when modal opens
  useEffect(() => {
    if (showQRModal && containerRef.current && !scannerRef.current) {
      try {
        scannerRef.current = new Html5Qrcode(containerRef.current.id);
      } catch (err) {
        console.error('Error initializing scanner:', err);
      }
    }

    return () => {
      // Cleanup: stop scanning when modal closes or component unmounts
      const cleanup = async () => {
        if (scannerRef.current && isScanningRef.current) {
          try {
            // Check if scanner is still active before stopping
            const scanner = scannerRef.current;
            if (scanner && containerRef.current) {
              await scanner.stop();
            }
          } catch (err) {
            // Ignore errors during cleanup (DOM might already be removed)
            // This is expected when the component unmounts
          } finally {
            isScanningRef.current = false;
            setIsScanning(false);
          }
        }
        
        // Reset scanner reference when modal closes
        if (!showQRModal) {
          scannerRef.current = null;
          setIsScanning(false);
        }
      };
      
      cleanup();
    };
  }, [showQRModal]);

  // Start scanning function - called on user click
  const startScanning = async () => {
    if (!scannerRef.current || !containerRef.current) {
      // Re-initialize if needed
      if (containerRef.current && !scannerRef.current) {
        try {
          scannerRef.current = new Html5Qrcode(containerRef.current.id);
        } catch (err) {
          console.error('Error initializing scanner:', err);
          alert('Unable to initialize scanner. Please try again.');
          return;
        }
      } else {
        return;
      }
    }
    
    try {
      setIsScanning(true);
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback - QR code scanned
          console.log('QR Code scanned:', decodedText);
          alert(`Scanned: ${decodedText}`);
          
          // Stop scanning before closing modal
          const stopScanner = async () => {
            try {
              if (scannerRef.current && isScanningRef.current) {
                await scannerRef.current.stop();
              }
            } catch (err) {
              // Ignore stop errors
            } finally {
              isScanningRef.current = false;
              setIsScanning(false);
              setShowQRModal(false);
            }
          };
          
          stopScanner();
        },
        () => {
          // Error callback - ignore common scanning errors
        }
      );
      
      isScanningRef.current = true;
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      isScanningRef.current = false;
      setIsScanning(false);
      
      // Provide more helpful error messages
      let errorMessage = 'Unable to access camera. ';
      if (err?.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (err?.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.';
      } else {
        errorMessage += 'Please check permissions and try again.';
      }
      
      alert(errorMessage);
    }
  };

  // Stop scanning function
  const stopScanning = async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        // Ignore errors during stop
        console.error('Error stopping scanner:', err);
      } finally {
        isScanningRef.current = false;
        setIsScanning(false);
      }
    }
  };

  // Handle modal close
  const handleCloseModal = async () => {
    await stopScanning();
    setShowQRModal(false);
  };

  return (
    <>
      <MobileContainer className="overflow-hidden">
        {/* Background container - exact SVG dimensions: 375x788 with 28px radius */}
        <div className="relative w-full h-screen bg-black rounded-[28px] overflow-hidden" style={{ paddingBottom: '80px' }}>
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
                height: '120px',
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
                right: 'clamp(68px, 18.1vw, 68.5px)',
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
                right: 'clamp(23px, 6.1vw, 23.5px)',
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

          {/* Main Content - Staff Page */}
          <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ paddingTop: 'clamp(150px, 20vh, 180px)' }}>
            {/* Staff Content Card - Glassmorphic */}
            <div
              className="relative"
              style={{
                width: 'clamp(300px, 85vw, 340px)',
                padding: 'clamp(32px, 8.5vw, 40px)',
                borderRadius: '25px',
                background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
                border: '0.5px solid rgba(133, 133, 133, 0.5)',
                backdropFilter: 'blur(17.5px)',
                boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'clamp(20px, 5.3vw, 24px)'
              }}
            >
              {/* Staff Title */}
              <h2
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(24px, 6.4vw, 28px)',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textAlign: 'center'
                }}
              >
                Staff Portal
              </h2>

              {/* Staff Description */}
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 'clamp(14px, 3.7vw, 16px)',
                  textAlign: 'center',
                  lineHeight: '1.6',
                  letterSpacing: '0.2px'
                }}
              >
                Welcome to the Staff portal. Manage your tasks and schedules here.
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Bar Tab - Fixed at bottom with floating center button */}
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
          {/* Main navbar rectangle */}
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
              {/* Icons container */}
              <div className="relative w-full h-full flex items-center justify-between" style={{ paddingLeft: 'clamp(20px, 8.9%, 26px)', paddingRight: 'clamp(20px, 8.9%, 26px)' }}>
                {/* Home Icon */}
                <Link href="/book-slots" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                  <HomeIcon size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
                </Link>

                {/* Document Icon */}
                <Link href="/functions?role=staff" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                  <FileText size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
                </Link>

                {/* Spacer for QR code (centered) */}
                <div style={{ width: 'clamp(50px, 20.3%, 59px)' }} />

                {/* Calendar Icon */}
                <Link href="/calendar" className="flex items-center justify-center" style={{ width: 'clamp(20px, 6.7%, 25px)', height: 'clamp(20px, 6.7%, 25px)' }}>
                  <Calendar size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
                </Link>

                {/* Profile Icon */}
                <Link href="/profile?role=staff" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                  <User size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
                </Link>
              </div>
            </div>
          </div>

          {/* QR Code Circle */}
          <button
            onClick={() => setShowQRModal(true)}
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
            style={{
              top: 'clamp(-28px, -5.6vw, -35.5px)',
              width: 'clamp(56px, 18.9vw, 71px)',
              height: 'clamp(56px, 18.9vw, 71px)',
              zIndex: 50,
              border: 'none',
              background: 'transparent',
              padding: 0
            }}
          >
            {/* Drop shadow */}
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
            {/* Outer gradient circle */}
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
            {/* QR Scanner Icon */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: '50%',
                top: '45%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <ScanLine 
                size={22} 
                style={{ 
                  color: '#1F93F2',
                  strokeWidth: 2.5
                }} 
              />
            </div>
            {/* Inner white circle with blur */}
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
          </button>
        </div>
      </MobileContainer>

      {/* QR Scanner Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[10000]"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0
          }}
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-center"
            style={{
              padding: 'clamp(20px, 5.3vw, 24px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              style={{
                width: 'clamp(40px, 10.7vw, 48px)',
                height: 'clamp(40px, 10.7vw, 48px)',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 'clamp(24px, 6.4vw, 28px)',
                fontWeight: '300'
              }}
            >
              ×
            </button>

            {/* QR Scanner Container */}
            <div
              className="w-full max-w-md"
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.95) 0%, rgba(13, 55, 60, 0.95) 100%)',
                border: '0.5px solid rgba(133, 133, 133, 0.5)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                padding: 'clamp(24px, 6.4vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(16px, 4.3vw, 20px)'
              }}
            >
              <h3
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(20px, 5.3vw, 24px)',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textAlign: 'center',
                  marginBottom: 'clamp(8px, 2.1vw, 12px)'
                }}
              >
                Scan QR Code
              </h3>
              
              {/* QR Scanner Component */}
              <div
                id="qr-reader-staff"
                ref={containerRef}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#000000',
                  minHeight: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {!isScanning && (
                  <button
                    onClick={startScanning}
                    style={{
                      padding: 'clamp(12px, 3.2vw, 16px) clamp(24px, 6.4vw, 32px)',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(31, 147, 242, 0.8) 0%, rgba(97, 197, 249, 0.8) 100%)',
                      border: '1px solid rgba(31, 147, 242, 0.3)',
                      color: '#FFFFFF',
                      fontSize: 'clamp(14px, 3.7vw, 16px)',
                      fontWeight: '500',
                      letterSpacing: '0.2px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Start Camera
                  </button>
                )}
              </div>
              
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 'clamp(12px, 3.2vw, 14px)',
                  textAlign: 'center',
                  marginTop: 'clamp(8px, 2.1vw, 12px)'
                }}
              >
                {isScanning ? 'Point your camera at a QR code to scan' : 'Click "Start Camera" to begin scanning'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

