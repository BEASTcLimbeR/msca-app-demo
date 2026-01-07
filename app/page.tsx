'use client';

import MobileContainer from '@/components/MobileContainer';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
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

        {/* Main Content - Centered Landing Page */}
        <div className="relative w-full h-full flex flex-col items-center" style={{ paddingTop: 'clamp(140px, 18vh, 160px)', paddingBottom: 'clamp(140px, 18vh, 160px)' }}>
          {/* Welcome Card - Glassmorphic */}
          <div
            className="relative"
            style={{
              width: 'clamp(300px, 85vw, 340px)',
              padding: 'clamp(24px, 6.4vw, 32px)',
              borderRadius: '25px',
              background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
              border: '0.5px solid rgba(133, 133, 133, 0.5)',
              backdropFilter: 'blur(17.5px)',
              boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(16px, 4.3vw, 20px)'
            }}
          >
            {/* MSCA Logo */}
            <div
              style={{
                width: 'clamp(180px, 48vw, 220px)',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'clamp(8px, 2.1vw, 12px)'
              }}
            >
              <Image
                src="/msca-white-logo-marathi.svg"
                alt="MSCA Logo"
                width={220}
                height={104}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '220px'
                }}
              />
            </div>

            {/* Welcome Title */}
            <h2
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(18px, 4.8vw, 22px)',
                fontWeight: '600',
                letterSpacing: '0.3px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                marginBottom: 'clamp(4px, 1.1vw, 6px)'
              }}
            >
              Welcome to My MSCA
            </h2>

            {/* Welcome Description */}
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(14px, 3.7vw, 16px)',
                textAlign: 'center',
                lineHeight: '1.6',
                letterSpacing: '0.2px',
                marginBottom: 'clamp(8px, 2.1vw, 12px)'
              }}
            >
              Sign in as a
            </p>

            {/* Member Button */}
            <Link href="/book-slots">
              <div
                className="cursor-pointer"
                style={{
                  width: 'clamp(240px, 64vw, 280px)',
                  height: 'clamp(48px, 6.5vh, 52px)',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(30, 255, 0, 0.6) 0%, rgba(13, 255, 0, 0.6) 100%)',
                  border: '0.5px solid rgba(133, 133, 133, 0.5)',
                  backdropFilter: 'blur(17.5px)',
                  boxShadow: '0 4px 12px rgba(30, 255, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                <span
                  className="font-medium"
                  style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(16px, 4.3vw, 18px)',
                    letterSpacing: '0.3px'
                  }}
                >
                  Member
                </span>
              </div>
            </Link>

            {/* Staff Button */}
            <Link href="/staff">
              <div
                className="cursor-pointer"
                style={{
                  width: 'clamp(240px, 64vw, 280px)',
                  height: 'clamp(48px, 6.5vh, 52px)',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(30, 255, 0, 0.6) 0%, rgba(13, 255, 0, 0.6) 100%)',
                  border: '0.5px solid rgba(133, 133, 133, 0.5)',
                  backdropFilter: 'blur(17.5px)',
                  boxShadow: '0 4px 12px rgba(30, 255, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                <span
                  className="font-medium"
                  style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(16px, 4.3vw, 18px)',
                    letterSpacing: '0.3px'
                  }}
                >
                  Staff
                </span>
              </div>
            </Link>

            {/* Admin Button */}
            <div
              className="cursor-pointer"
              style={{
                width: 'clamp(240px, 64vw, 280px)',
                height: 'clamp(48px, 6.5vh, 52px)',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(30, 255, 0, 0.6) 0%, rgba(13, 255, 0, 0.6) 100%)',
                border: '0.5px solid rgba(133, 133, 133, 0.5)',
                backdropFilter: 'blur(17.5px)',
                boxShadow: '0 4px 12px rgba(30, 255, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              <span
                className="font-medium"
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(16px, 4.3vw, 18px)',
                  letterSpacing: '0.3px'
                }}
              >
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div
          className="absolute"
          style={{
            bottom: 'clamp(60px, 8vh, 80px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(280px, 80vw, 320px)',
            textAlign: 'center',
            padding: '0 clamp(20px, 5.3vw, 24px)'
          }}
        >
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 'clamp(11px, 2.9vw, 13px)',
              lineHeight: '1.5',
              letterSpacing: '0.2px'
            }}
          >
            Book your slots and manage your schedule with ease
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}
