'use client';

import MobileContainer from '@/components/MobileContainer';
import { Bell, Search, ChevronDown, Home as HomeIcon, FileText, Calendar, User, QrCode, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get previous month's trailing days
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const trailingDays = firstDayOfMonth;

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month's trailing days
  for (let i = trailingDays - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      fullDate: new Date(currentYear, currentMonth - 1, prevMonthDays - i)
    });
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: true,
      fullDate: new Date(currentYear, currentMonth, i)
    });
  }

  // Next month's leading days to fill the grid
  const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: false,
      fullDate: new Date(currentYear, currentMonth + 1, i)
    });
  }
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
              Calendar
            </h1>
          </div>
        </header>

        {/* Main Content Area - Calendar */}
        <div className="relative w-full" style={{ marginTop: 'clamp(130px, 17.7vh, 139.75px)', padding: 'clamp(20px, 5.3vw, 26px)' }}>
          {/* Calendar Container */}
          <div
            style={{
              width: '100%',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
              border: '0.5px solid rgba(133, 133, 133, 0.5)',
              backdropFilter: 'blur(17.5px)',
              boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3)',
              padding: 'clamp(20px, 5.3vw, 24px)'
            }}
          >
            {/* Calendar Header - Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="flex items-center justify-center"
                style={{
                  width: 'clamp(32px, 8.5vw, 40px)',
                  height: 'clamp(32px, 8.5vw, 40px)',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <ChevronLeft size={20} style={{ color: '#D8D8D8' }} />
              </button>

              <h2
                style={{
                  color: '#D8D8D8',
                  fontSize: 'clamp(18px, 4.8vw, 22px)',
                  fontWeight: '600',
                  letterSpacing: '0.3px'
                }}
              >
                {monthNames[currentMonth]} {currentYear}
              </h2>

              <button
                onClick={goToNextMonth}
                className="flex items-center justify-center"
                style={{
                  width: 'clamp(32px, 8.5vw, 40px)',
                  height: 'clamp(32px, 8.5vw, 40px)',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <ChevronRight size={20} style={{ color: '#D8D8D8' }} />
              </button>
            </div>

            {/* Day Names Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-center"
                  style={{
                    height: 'clamp(30px, 4vh, 36px)',
                    color: '#D8D8D8',
                    fontSize: 'clamp(11px, 2.9vw, 13px)',
                    fontWeight: '500',
                    letterSpacing: '0.2px'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const isToday = day.fullDate.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && day.fullDate.toDateString() === selectedDate.toDateString();
                const isCurrentMonth = day.isCurrentMonth;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isCurrentMonth) {
                        setSelectedDate(day.fullDate);
                      }
                    }}
                    className="flex items-center justify-center"
                    style={{
                      height: 'clamp(36px, 4.8vh, 42px)',
                      borderRadius: '10px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(31, 147, 242, 0.6) 0%, rgba(97, 197, 249, 0.6) 100%)'
                        : isToday
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'transparent',
                      border: isToday && !isSelected ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                      color: isCurrentMonth ? '#D8D8D8' : 'rgba(216, 216, 216, 0.4)',
                      fontSize: 'clamp(12px, 3.2vw, 14px)',
                      fontWeight: isToday ? '600' : '400',
                      cursor: isCurrentMonth ? 'pointer' : 'default',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (isCurrentMonth && !isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isCurrentMonth && !isSelected) {
                        e.currentTarget.style.background = isToday ? 'rgba(255, 255, 255, 0.15)' : 'transparent';
                      }
                    }}
                  >
                    {day.date}
                  </button>
                );
              })}
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
              <Link href="/functions" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <FileText size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </Link>

              {/* Spacer for QR code (centered) */}
              <div style={{ width: 'clamp(50px, 20.3%, 59px)' }} />

              {/* Calendar Icon - responsive sizing */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(20px, 6.7%, 25px)', height: 'clamp(20px, 6.7%, 25px)' }}>
                <Calendar size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </div>

              {/* Profile Icon - responsive sizing */}
              <Link href="/profile" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <User size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </Link>
            </div>
          </div>
        </div>

        {/* QR Code Circle - matching qr-code-circle.svg - Responsive */}
        {/* Positioned absolutely with negative top to float above navbar - 50% extends above */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 'clamp(-28px, -5.6vw, -35.5px)',
            width: 'clamp(56px, 18.9vw, 71px)',
            height: 'clamp(56px, 18.9vw, 71px)',
            zIndex: 50
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
        </div>
      </div>
    </MobileContainer>
  );
}

