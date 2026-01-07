'use client';

import MobileContainer from '@/components/MobileContainer';
import { Bell, Search, Home as HomeIcon, FileText, Calendar, User, QrCode } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'next/navigation';

function FunctionsContent() {
  const [showQRModal, setShowQRModal] = useState(false); // QR code modal state
  const searchParams = useSearchParams();
  const isStaff = searchParams.get('role') === 'staff';
  
  // Card titles based on role
  const cardTitles = isStaff 
    ? ['View members', 'Inventory Management', 'Log book', 'New Entry']
    : ['Daily tasks', 'Stopwatch', 'Logbook', 'Movement Analysis'];
  
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

          {/* Functions Text - aligned with icons - Responsive */}
          <div 
            className="absolute flex items-center left-1/2 -translate-x-1/2"
            style={{
              top: 'clamp(50px, 7.6vh, 59.5px)',
              height: 'clamp(28px, 9.1vw, 34px)'
            }}
          >
            <h1 className="text-white text-lg font-medium" style={{ color: '#D8D8D8' }}>
              Functions
            </h1>
          </div>
        </header>

        {/* Main Content Area - Functions */}
        <div className="relative w-full" style={{ marginTop: 'clamp(130px, 17.7vh, 139.75px)', padding: 'clamp(16px, 4.3vw, 20px)' }}>
          {/* 2x2 Grid of Function Cards */}
          <div className="grid grid-cols-2 gap-3" style={{ height: 'calc(100vh - clamp(250px, 35vh, 280px))' }}>
            {/* Card 1 - Top Left */}
            <div
              className="cursor-pointer"
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
                border: '0.5px solid rgba(133, 133, 133, 0.5)',
                backdropFilter: 'blur(17.5px)',
                boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3)',
                padding: 'clamp(24px, 6.4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <span
                style={{
                  color: '#D8D8D8',
                  fontSize: 'clamp(16px, 4.3vw, 20px)',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textAlign: 'center'
                }}
              >
                {cardTitles[0]}
              </span>
            </div>

            {/* Card 2 - Top Right */}
            <div
              className="cursor-pointer"
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
                border: '0.5px solid rgba(133, 133, 133, 0.5)',
                backdropFilter: 'blur(17.5px)',
                boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3)',
                padding: 'clamp(24px, 6.4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <span
                style={{
                  color: '#D8D8D8',
                  fontSize: 'clamp(16px, 4.3vw, 20px)',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textAlign: 'center'
                }}
              >
                {cardTitles[1]}
              </span>
            </div>

            {/* Card 3 - Bottom Left */}
            <div
              className="cursor-pointer"
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
                border: '0.5px solid rgba(133, 133, 133, 0.5)',
                backdropFilter: 'blur(17.5px)',
                boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3)',
                padding: 'clamp(24px, 6.4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <span
                style={{
                  color: '#D8D8D8',
                  fontSize: 'clamp(16px, 4.3vw, 20px)',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textAlign: 'center'
                }}
              >
                {cardTitles[2]}
              </span>
            </div>

            {/* Card 4 - Bottom Right */}
            <div
              className="cursor-pointer"
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
                border: '0.5px solid rgba(133, 133, 133, 0.5)',
                backdropFilter: 'blur(17.5px)',
                boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3)',
                padding: 'clamp(24px, 6.4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <span
                style={{
                  color: '#D8D8D8',
                  fontSize: 'clamp(16px, 4.3vw, 20px)',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textAlign: 'center'
                }}
              >
                {cardTitles[3]}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar Tab - Fixed at bottom with floating center button - Outside overflow container */}
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
              <Link href="/home" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <HomeIcon size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </Link>

              {/* Document Icon - responsive sizing */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <FileText size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </div>

              {/* Spacer for QR code (centered) */}
              <div style={{ width: 'clamp(50px, 20.3%, 59px)' }} />

              {/* Calendar Icon - responsive sizing */}
              <Link href="/calendar" className="flex items-center justify-center" style={{ width: 'clamp(20px, 6.7%, 25px)', height: 'clamp(20px, 6.7%, 25px)' }}>
                <Calendar size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </Link>

              {/* Profile Icon - responsive sizing */}
              <Link href="/profile" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <User size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </Link>
            </div>
          </div>
        </div>

        {/* QR Code Circle - matching qr-code-circle.svg - Responsive */}
        {/* Positioned absolutely with negative top to float above navbar - 50% extends above */}
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
          {/* QR Code Icon - Centered in the circle */}
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
            <QrCode 
              size={22} 
              style={{ 
                color: '#1F93F2',
                strokeWidth: 2.5
              }} 
            />
          </div>
        </button>

      </div>
    </MobileContainer>
    
    {/* QR Code Modal - Rendered outside MobileContainer for proper centering */}
    {showQRModal && (
      <div
        className="fixed inset-0 flex items-center justify-center z-[10000]"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
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
        onClick={() => setShowQRModal(false)}
      >
        <div
          className="relative"
          style={{
            width: 'clamp(280px, 75vw, 320px)',
            padding: 'clamp(24px, 6.4vw, 32px)',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.95) 0%, rgba(13, 55, 60, 0.95) 100%)',
            border: '0.5px solid rgba(133, 133, 133, 0.5)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            margin: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowQRModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          {/* QR Code Container */}
          <div
            className="flex flex-col items-center"
            style={{
              gap: 'clamp(16px, 4.3vw, 20px)'
            }}
          >
            <h3
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(18px, 4.8vw, 22px)',
                fontWeight: '600',
                letterSpacing: '0.3px',
                marginBottom: 'clamp(8px, 2.1vw, 12px)'
              }}
            >
              Your QR Code
            </h3>
            
            {/* QR Code Display Area */}
            <div
              style={{
                width: 'clamp(240px, 64vw, 280px)',
                height: 'clamp(240px, 64vw, 280px)',
                borderRadius: '16px',
                background: '#FFFFFF',
                padding: 'clamp(16px, 4.3vw, 20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* QR Code */}
              <QRCodeSVG
                value={`MSCA-USER-FUNCTIONS-${new Date().getTime()}`}
                size={240}
                level="H"
                includeMargin={false}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '240px',
                  maxHeight: '240px'
                }}
              />
            </div>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(12px, 3.2vw, 14px)',
                textAlign: 'center',
                marginTop: 'clamp(8px, 2.1vw, 12px)'
              }}
            >
              Rutvij Deo member #43531
            </p>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default function FunctionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FunctionsContent />
    </Suspense>
  );
}

