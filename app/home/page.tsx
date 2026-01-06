'use client';

import MobileContainer from '@/components/MobileContainer';
import { Bell, Search, ChevronDown, Home as HomeIcon, FileText, Calendar, User, QrCode } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // Track week navigation offset
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  
  // Get current week dates - current date always in the middle (4th position)
  const currentWeek = useMemo(() => {
    const today = new Date();
    // Use today's date if in current month/year, otherwise use the 1st day of selected month
    let centerDate: Date;
    if (selectedYear === today.getFullYear() && selectedMonth === today.getMonth()) {
      // Current month: use today's date
      centerDate = new Date(today);
    } else {
      // Different month/year: use the 1st day of selected month
      centerDate = new Date(selectedYear, selectedMonth, 1);
    }
    
    // Apply day offset for navigation (swipe left/right)
    centerDate.setDate(centerDate.getDate() + weekOffset);
    
    // Calculate 3 days before and 3 days after (7 days total, center in middle at index 3)
    const week = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i);
      week.push(date);
    }
    return week;
  }, [selectedMonth, selectedYear, weekOffset]);
  
  // Update selected month/year when center date (index 3) changes to different month
  useEffect(() => {
    if (currentWeek.length > 0) {
      // Use center date (index 3) for month/year updates - this is always the middle date
      const centerDate = currentWeek[3];
      const centerMonth = centerDate.getMonth();
      const centerYear = centerDate.getFullYear();
      
      // Only update if the center date is in a different month/year
      if (centerMonth !== selectedMonth || centerYear !== selectedYear) {
        setSelectedMonth(centerMonth);
        setSelectedYear(centerYear);
      }
    }
  }, [currentWeek, selectedMonth, selectedYear]);
  
  // Handle swipe to navigate days (not weeks)
  const handleSwipe = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50; // Minimum distance to trigger swipe
    
    if (info.offset.x > swipeThreshold) {
      // Swipe right - go to previous day
      setWeekOffset(prev => prev - 1);
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left - go to next day
      setWeekOffset(prev => prev + 1);
    }
  };
  
  const currentMonth = monthNames[selectedMonth];
  
  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setIsDropdownOpen(false);
    setWeekOffset(0); // Reset to current week when month changes
  };
  
  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
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

        {/* Main Slot Card - Mobile-First Responsive */}
        {/* Responsive positioning and sizing while maintaining proportions */}
        <div 
          className="absolute"
          style={{
            left: 'clamp(15px, 4.2vw, 15.75px)', // Responsive left positioning
            top: 'clamp(130px, 17.7vh, 139.75px)', // Responsive top positioning
            width: 'clamp(300px, 90.8vw, 340.5px)', // Responsive width: 90.8% of 375px
            height: 'clamp(350px, 50.4vh, 397.5px)', // Responsive height
            borderRadius: '20.25px',
            background: 'linear-gradient(180deg, rgba(90, 104, 112, 0.4) 0%, rgba(13, 55, 60, 0.4) 100%)',
            border: '0.5px solid rgba(133, 133, 133, 0.5)',
            backdropFilter: 'blur(17.5px)',
            boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Calendar Section - matching with-dates-updated.svg layout */}
          <div className="relative w-full h-full">
            {/* Month Name with Chevron - positioned at top left, clickable dropdown */}
            <div 
              ref={dropdownRef}
              className="absolute"
              style={{
                left: '9.72px',
                top: '36px',
                zIndex: 20
              }}
            >
              <div 
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ color: '#D8D8D8' }}
              >
                <span className="text-sm font-bold" style={{ fontSize: '14px', letterSpacing: '0.3px' }}>
                  {currentMonth}
                </span>
                {/* Chevron icon - positioned at x="82.5" y="23.5" from SVG, but relative to month name */}
                <ChevronDown 
                  size={12} 
                  className="text-[#D8D8D8] transition-transform duration-200" 
                  style={{ 
                    marginTop: '2px',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} 
                />
              </div>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute mt-2 rounded-lg overflow-hidden"
                  style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(17.5px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    minWidth: '150px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {monthNames.map((month, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => handleMonthSelect(index)}
                      style={{
                        color: '#D8D8D8',
                        fontSize: '14px',
                        background: selectedMonth === index ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                      }}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calendar Dates Row - 7 dates positioned around y="76" from SVG paths */}
            {/* Dates are spaced evenly across the card width - swipeable */}
            <motion.div 
              className="absolute flex items-center justify-between"
              style={{
                left: '13.43px',
                right: '13.43px',
                top: '76px',
                height: '60px'
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleSwipe}
            >
              {currentWeek.map((date, index) => {
                const dateStr = date.toDateString();
                const isSelected = dateStr === selectedDate;
                const dayName = dayNames[date.getDay()];
                const dateNum = date.getDate().toString().padStart(2, '0');
                
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center cursor-pointer relative"
                    onClick={() => setSelectedDate(dateStr)}
                    style={{ 
                      flex: '1',
                      maxWidth: '45px',
                      height: '60px',
                      minHeight: '60px'
                    }}
                  >
                    {isSelected ? (
                      <>
                        {/* Selected date background - exact shape from around-dates.svg */}
                        {/* Outer wrapper for gradient border */}
                        <div
                          className="absolute"
                          style={{
                            width: '37.563px',
                            height: '60px',
                            borderRadius: '18.7815px',
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(102, 102, 102, 0.5) 100%)',
                            padding: '1px',
                            left: '50%',
                            top: '0',
                            transform: 'translateX(-50%)',
                            backdropFilter: 'blur(17.5px)'
                          }}
                        >
                          {/* Inner content with black background */}
                          <div
                            className="w-full h-full rounded-[18.7815px] flex flex-col items-center justify-center"
                            style={{
                              background: 'rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {/* Selected: Date number above, day name below (reversed) */}
                            <span 
                              className="text-xs font-bold mb-0.5" 
                              style={{ 
                                color: '#D8D8D8',
                                fontSize: '12px',
                                lineHeight: '1.2'
                              }}
                            >
                              {dateNum}
                            </span>
                            <span 
                              className="text-xs" 
                              style={{ 
                                color: '#D8D8D8',
                                fontSize: '10px',
                                lineHeight: '1.2'
                              }}
                            >
                              {dayName}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Normal: Day name above, date number below */}
                        <span 
                          className="text-xs mb-0.5" 
                          style={{ 
                            color: '#D8D8D8',
                            fontSize: '10px',
                            lineHeight: '1.2'
                          }}
                        >
                          {dayName}
                        </span>
                        <span 
                          className="text-xs font-medium" 
                          style={{ 
                            color: '#D8D8D8',
                            fontSize: '11px',
                            lineHeight: '1.2'
                          }}
                        >
                          {dateNum}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Check-in and Check-out Cards - Below Calendar */}
        <div 
          className="absolute"
          style={{
            left: 'clamp(20px, 5.3vw, 26px)',
            top: 'clamp(280px, 37.8vh, 298px)', // Positioned below the calendar card
            width: 'clamp(280px, 86.1vw, 323px)',
            height: 'clamp(120px, 16vh, 130px)', // Increased height
            borderRadius: '20px',
            background: 'rgba(30, 30, 30, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            padding: 'clamp(16px, 4.3vw, 20px)', // Increased padding
            display: 'flex',
            gap: 'clamp(12px, 3.2vw, 16px)'
          }}
        >
          {/* Checked in Card */}
          <div
            className="flex-1"
            style={{
              borderRadius: '15px',
              background: 'rgba(13, 255, 0, 0.15)',
              border: '1px solid rgba(13, 255, 0, 0.3)',
              padding: 'clamp(20px, 5.3vw, 24px)', // Increased padding
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <span
              style={{
                color: 'rgba(13, 255, 0, 0.9)',
                fontSize: 'clamp(12px, 3.2vw, 14px)', // Text size unchanged
                fontWeight: '500',
                marginBottom: 'clamp(8px, 2.1vw, 10px)', // Slightly increased spacing
                letterSpacing: '0.2px'
              }}
            >
              Checked in
            </span>
            {/* Horizontal divider */}
            <div
              style={{
                width: '100%',
                height: '0.5px',
                background: 'rgba(255, 255, 255, 0.3)',
                marginBottom: 'clamp(8px, 2.1vw, 10px)' // Slightly increased spacing
              }}
            />
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 'clamp(11px, 2.9vw, 13px)', // Text size unchanged
                fontWeight: '400',
                letterSpacing: '0.2px'
              }}
            >
              {(() => {
                const selectedDateObj = new Date(selectedDate);
                const dayName = dayNames[selectedDateObj.getDay()];
                return `${dayName} 7:00 AM`;
              })()}
            </span>
          </div>

          {/* Checked out Card */}
          <div
            className="flex-1"
            style={{
              borderRadius: '15px',
              background: 'rgba(13, 255, 0, 0.15)',
              border: '1px solid rgba(13, 255, 0, 0.3)',
              padding: 'clamp(20px, 5.3vw, 24px)', // Increased padding
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <span
              style={{
                color: 'rgba(13, 255, 0, 0.9)',
                fontSize: 'clamp(12px, 3.2vw, 14px)', // Text size unchanged
                fontWeight: '500',
                marginBottom: 'clamp(8px, 2.1vw, 10px)', // Slightly increased spacing
                letterSpacing: '0.2px'
              }}
            >
              Checked out
            </span>
            {/* Horizontal divider */}
            <div
              style={{
                width: '100%',
                height: '0.5px',
                background: 'rgba(255, 255, 255, 0.3)',
                marginBottom: 'clamp(8px, 2.1vw, 10px)' // Slightly increased spacing
              }}
            />
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 'clamp(11px, 2.9vw, 13px)', // Text size unchanged
                fontWeight: '400',
                letterSpacing: '0.2px'
              }}
            >
              {(() => {
                const selectedDateObj = new Date(selectedDate);
                const dayName = dayNames[selectedDateObj.getDay()];
                return `${dayName} 7:00 PM`;
              })()}
            </span>
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
              <div className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <HomeIcon size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </div>

              {/* Document Icon - responsive sizing */}
              <Link href="/functions" className="flex items-center justify-center" style={{ width: 'clamp(28px, 9.1%, 34px)', height: 'clamp(28px, 9.1%, 34px)' }}>
                <FileText size={20} strokeWidth={2} style={{ color: '#C0D4FB' }} />
              </Link>

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

