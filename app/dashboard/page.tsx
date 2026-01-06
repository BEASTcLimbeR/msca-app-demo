'use client';

import MobileContainer from '@/components/MobileContainer';
import { Bell, Search, ChevronDown, Home as HomeIcon, FileText, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // Track week navigation offset
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null); // Track selected slot index
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null); // Track selected duration
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false); // Track duration dropdown state
  const durationRef = useRef<HTMLDivElement>(null); // Ref for duration dropdown
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Time slots configuration
  const timeSlots = [
    { time: '7:00', period: 'AM' },
    { time: '9:30', period: 'AM' },
    { time: '12:00', period: 'PM' },
    { time: '12:00', period: 'PM' }
  ];
  const TOTAL_SLOTS = 40;

  // Generate deterministic random number based on date and slot index
  const getSlotData = (date: Date, slotIndex: number) => {
    // Create a seed from date and slot index for deterministic randomness
    const seed = date.getTime() + slotIndex * 1000;
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    
    // Generate booked slots (0-40)
    const booked = Math.floor(normalized * 41);
    const remaining = TOTAL_SLOTS - booked;
    const percentage = (booked / TOTAL_SLOTS) * 100;

    // Determine status and color based on percentage
    let status: string;
    let statusText: string;
    let backgroundColor: string;
    let textColor: string = '#FFFFFF';
    let dividerColor: string = '#FFFFFF';

    if (remaining === 0) {
      // Fully Booked
      status = 'full';
      statusText = 'Fully Booked';
      backgroundColor = 'rgba(102, 102, 102, 0.4)';
      textColor = '#FFFFFF';
      dividerColor = '#FFFFFF';
    } else if (percentage >= 95) {
      // Red: 95-100% (Almost Full)
      status = 'almost-full';
      statusText = 'Almost Full';
      backgroundColor = 'rgba(196, 0, 0, 0.3)';
      textColor = '#D8D8D8';
      dividerColor = '#797979';
    } else if (percentage >= 50) {
      // Yellow: 50-80% (Limited)
      status = 'limited';
      statusText = 'Limited';
      backgroundColor = 'rgba(255, 200, 0, 0.4)';
      textColor = '#FFFFFF';
      dividerColor = '#FFFFFF';
    } else {
      // Green: <50% (Available)
      status = 'available';
      statusText = 'Available';
      backgroundColor = 'rgba(13, 255, 0, 0.4)';
      textColor = '#FFFFFF';
      dividerColor = '#FFFFFF';
    }

    return {
      remaining,
      booked,
      percentage,
      status,
      statusText,
      backgroundColor,
      textColor,
      dividerColor
    };
  };

  // Get slot data for selected date
  const getSelectedDateSlots = () => {
    const selectedDateObj = new Date(selectedDate);
    return timeSlots.map((slot, index) => ({
      ...slot,
      ...getSlotData(selectedDateObj, index)
    }));
  };

  // Check if selected date is Tuesday
  const isTuesday = () => {
    const selectedDateObj = new Date(selectedDate);
    return selectedDateObj.getDay() === 2; // 2 = Tuesday
  };
  
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

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlotIndex(null);
  }, [selectedDate]);

  // Close duration dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) {
        setIsDurationDropdownOpen(false);
      }
    };

    if (isDurationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDurationDropdownOpen]);

  // Navigate to booking confirmation page
  const handleBooking = () => {
    if (selectedSlotIndex === null) {
      alert('Please select a slot first.');
      return;
    }

    if (selectedDuration === null) {
      alert('Please select a duration first.');
      return;
    }

    // Get selected slot data
    const selectedSlot = getSelectedDateSlots()[selectedSlotIndex];
    const selectedDateObj = new Date(selectedDate);
    
    // Format date for display
    const formattedDate = `${selectedDateObj.getDate()} ${monthNames[selectedDateObj.getMonth()]} ${selectedDateObj.getFullYear()}`;
    
    // Format time for display
    const formattedTime = `${selectedSlot.time} ${selectedSlot.period}`;
    
    // Navigate to booking page with query params
    const params = new URLSearchParams({
      date: formattedDate,
      time: formattedTime,
      duration: selectedDuration,
      slotIndex: selectedSlotIndex.toString(),
      dateString: selectedDate
    });
    
    router.push(`/booking?${params.toString()}`);
  };
  
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

        {/* Below Dates Card - matching transparent-rectangle.svg with same transparency as slot card */}
        {/* From transparent-rectangle.svg: width="321" height="116" rx="19.5" */}
        <div 
          className="absolute"
          style={{
            left: '25.75px', // 15.75 (slot card left) + 10
            top: '285px', // Moved down slightly from 269.75px
            width: '321px',
            height: '116px',
            borderRadius: '19.5px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(102, 102, 102, 1) 100%)',
            padding: '1px',
            backdropFilter: 'blur(17.5px)'
          }}
        >
          {/* Inner content - matching slot card transparency level (0.4 opacity) */}
          <div
            className="w-full h-full rounded-[19.5px] flex flex-col gap-2 justify-center items-center"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%)',
              padding: '12px'
            }}
          >
            {isTuesday() ? (
              /* Holiday Message for Tuesday */
              <div className="w-full flex items-center justify-center" style={{ height: '100%' }}>
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    fontWeight: '600',
                    letterSpacing: '0.3px'
                  }}
                >
                  Holiday
                </span>
              </div>
            ) : (
              <>
                {/* Row 1: First two slots */}
                <div className="flex gap-2 justify-center w-full">
                  {getSelectedDateSlots().slice(0, 2).map((slot, index) => {
                    const isSelected = selectedSlotIndex === index;
                    const isFullyBooked = slot.remaining === 0;
                    const isClickable = !isFullyBooked;
                    
                    return (
                    <div
                      key={index}
                      onClick={() => {
                        if (isClickable) {
                          setSelectedSlotIndex(index);
                        }
                      }}
                      className="relative"
                      style={{
                        width: 'clamp(120px, 35.7vw, 134px)',
                        height: 'clamp(40px, 5.6vh, 44px)',
                        borderRadius: '19.5px',
                        background: slot.backgroundColor,
                        backdropFilter: 'blur(17.5px)',
                        border: isSelected ? '2px solid rgba(255, 255, 255, 0.8)' : 'none',
                        boxShadow: isSelected
                          ? `
                            inset 3px 3px 6px rgba(0, 0, 0, 0.3),
                            inset -3px -3px 6px rgba(255, 255, 255, 0.1),
                            6px 6px 12px rgba(0, 0, 0, 0.2),
                            -3px -3px 6px rgba(255, 255, 255, 0.05),
                            0 0 0 2px rgba(255, 255, 255, 0.5)
                          `
                          : `
                            inset 3px 3px 6px rgba(0, 0, 0, 0.3),
                            inset -3px -3px 6px rgba(255, 255, 255, 0.1),
                            6px 6px 12px rgba(0, 0, 0, 0.2),
                            -3px -3px 6px rgba(255, 255, 255, 0.05)
                          `,
                        cursor: isClickable ? 'pointer' : 'not-allowed',
                        opacity: isFullyBooked ? 0.6 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[19.5px] flex items-center px-2"
                        style={{
                          background: 'transparent'
                        }}
                      >
                        {/* Left side - Time */}
                        <div className="flex flex-col items-center justify-center" style={{ width: '40px' }}>
                          <span
                            className="font-medium"
                            style={{
                              color: slot.textColor,
                              fontSize: '11px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2'
                            }}
                          >
                            {slot.time}
                          </span>
                          <span
                            className=""
                            style={{
                              color: slot.textColor,
                              fontSize: '9px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2'
                            }}
                          >
                            {slot.period}
                          </span>
                        </div>

                        {/* Vertical divider */}
                        <div
                          className="mx-1"
                          style={{
                            width: '0.5px',
                            height: '32px',
                            background: slot.dividerColor,
                            opacity: 0.5
                          }}
                        />

                        {/* Right side - Status info */}
                        <div className="flex-1 flex flex-col justify-center">
                          <span
                            className="mb-0.5"
                            style={{
                              color: slot.textColor,
                              fontSize: slot.status === 'limited' ? '9px' : '11px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2',
                              fontWeight: 500
                            }}
                          >
                            {slot.statusText}
                          </span>
                          {/* Horizontal divider */}
                          <div
                            className="mb-0.5"
                            style={{
                              width: '100%',
                              height: '0.5px',
                              background: slot.dividerColor,
                              opacity: 0.5
                            }}
                          />
                          <span
                            className=""
                            style={{
                              color: slot.textColor,
                              fontSize: slot.status === 'full' ? '10px' : slot.status === 'limited' ? '8px' : '9px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2',
                              fontWeight: 400,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {slot.remaining === 0 ? 'Booked' : `${slot.remaining} Slots Remaining`}
                          </span>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Row 2: Last two slots */}
                <div className="flex gap-2 justify-center w-full">
                  {getSelectedDateSlots().slice(2, 4).map((slot, index) => {
                    const actualIndex = index + 2;
                    const isSelected = selectedSlotIndex === actualIndex;
                    const isFullyBooked = slot.remaining === 0;
                    const isClickable = !isFullyBooked;
                    
                    return (
                    <div
                      key={actualIndex}
                      onClick={() => {
                        if (isClickable) {
                          setSelectedSlotIndex(actualIndex);
                        }
                      }}
                      className="relative"
                      style={{
                        width: 'clamp(120px, 35.7vw, 134px)',
                        height: 'clamp(40px, 5.6vh, 44px)',
                        borderRadius: '19.5px',
                        background: slot.backgroundColor,
                        backdropFilter: 'blur(17.5px)',
                        border: isSelected ? '2px solid rgba(255, 255, 255, 0.8)' : 'none',
                        boxShadow: isSelected
                          ? `
                            inset 3px 3px 6px rgba(0, 0, 0, 0.3),
                            inset -3px -3px 6px rgba(255, 255, 255, 0.1),
                            6px 6px 12px rgba(0, 0, 0, 0.2),
                            -3px -3px 6px rgba(255, 255, 255, 0.05),
                            0 0 0 2px rgba(255, 255, 255, 0.5)
                          `
                          : `
                            inset 3px 3px 6px rgba(0, 0, 0, 0.3),
                            inset -3px -3px 6px rgba(255, 255, 255, 0.1),
                            6px 6px 12px rgba(0, 0, 0, 0.2),
                            -3px -3px 6px rgba(255, 255, 255, 0.05)
                          `,
                        cursor: isClickable ? 'pointer' : 'not-allowed',
                        opacity: isFullyBooked ? 0.6 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[19.5px] flex items-center px-2"
                        style={{
                          background: 'transparent'
                        }}
                      >
                        {/* Left side - Time */}
                        <div className="flex flex-col items-center justify-center" style={{ width: '40px' }}>
                          <span
                            className="font-medium"
                            style={{
                              color: slot.textColor,
                              fontSize: '11px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2'
                            }}
                          >
                            {slot.time}
                          </span>
                          <span
                            className=""
                            style={{
                              color: slot.textColor,
                              fontSize: '9px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2'
                            }}
                          >
                            {slot.period}
                          </span>
                        </div>

                        {/* Vertical divider */}
                        <div
                          className="mx-1"
                          style={{
                            width: '0.5px',
                            height: '32px',
                            background: slot.dividerColor,
                            opacity: 0.5
                          }}
                        />

                        {/* Right side - Status info */}
                        <div className="flex-1 flex flex-col justify-center">
                          <span
                            className="mb-0.5"
                            style={{
                              color: slot.textColor,
                              fontSize: slot.status === 'limited' ? '9px' : '11px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2',
                              fontWeight: 500
                            }}
                          >
                            {slot.statusText}
                          </span>
                          {/* Horizontal divider */}
                          <div
                            className="mb-0.5"
                            style={{
                              width: '100%',
                              height: '0.5px',
                              background: slot.dividerColor,
                              opacity: 0.5
                            }}
                          />
                          <span
                            className=""
                            style={{
                              color: slot.textColor,
                              fontSize: slot.status === 'full' ? '10px' : slot.status === 'limited' ? '8px' : '9px',
                              letterSpacing: '0.2px',
                              lineHeight: '1.2',
                              fontWeight: 400,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {slot.remaining === 0 ? 'Booked' : `${slot.remaining} Slots Remaining`}
                          </span>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Duration Dropdown Button - Above Book Slots */}
        <div
          ref={durationRef}
          className="absolute"
          style={{
            left: 'clamp(20px, 6.9vw, 26px)',
            top: 'clamp(380px, 52.7vh, 415px)', // Same position as Book Slots was before
            width: 'clamp(280px, 86.1vw, 323px)',
            zIndex: 10000
          }}
        >
          <button
            type="button"
            onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
            className="w-full cursor-pointer"
            style={{
              height: 'clamp(44px, 6vh, 52px)',
              borderRadius: '20.25px',
              background: selectedDuration
                ? 'linear-gradient(135deg, rgba(30, 144, 255, 0.6) 0%, rgba(13, 100, 255, 0.6) 100%)'
                : 'rgba(102, 102, 102, 0.5)',
              border: '0.5px solid rgba(133, 133, 133, 0.5)',
              backdropFilter: 'blur(17.5px)',
              boxShadow: selectedDuration
                ? '0 4px 12px rgba(30, 144, 255, 0.3)'
                : 'none',
              transition: 'all 0.2s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 'clamp(16px, 4.3vw, 20px)',
              paddingRight: 'clamp(16px, 4.3vw, 20px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <span
              className="font-medium"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(15px, 4vw, 18px)',
                letterSpacing: '0.3px'
              }}
            >
              {selectedDuration || 'Duration'}
            </span>
            <ChevronDown
              size={20}
              style={{
                color: '#FFFFFF',
                transform: isDurationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {isDurationDropdownOpen && (
            <div
              className="absolute w-full mt-2"
              style={{
                borderRadius: '15px',
                background: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                zIndex: 10001
              }}
            >
              {['1 Month', '3 Months', '6 Months', 'Yearly', 'Single Slot pass', 'Full Day pass'].map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(option);
                    setIsDurationDropdownOpen(false);
                  }}
                  className="w-full text-left"
                  style={{
                    padding: 'clamp(12px, 3.2vw, 16px) clamp(16px, 4.3vw, 20px)',
                    color: '#FFFFFF',
                    fontSize: 'clamp(14px, 3.7vw, 16px)',
                    background: selectedDuration === option
                      ? 'rgba(30, 144, 255, 0.3)'
                      : 'transparent',
                    borderBottom: index < 5 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedDuration !== option) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDuration !== option) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book Slots Tab - Mobile-First Responsive with Razorpay Payment */}
        {/* Positioned where "Click here to register" button was */}
        <button
          type="button"
          onClick={handleBooking}
          disabled={!razorpayLoaded || selectedSlotIndex === null || selectedDuration === null}
          className="absolute cursor-pointer"
          style={{
            left: 'clamp(20px, 6.9vw, 26px)', // Responsive left positioning
            top: 'clamp(440px, 61vh, 480px)', // Responsive top positioning - moved down to make room for another button
            width: 'clamp(280px, 86.1vw, 323px)', // Responsive width: 86.1% of 375px
            height: 'clamp(44px, 6vh, 52px)', // Responsive height - decreased
            borderRadius: '20.25px',
            background: (razorpayLoaded && selectedSlotIndex !== null && selectedDuration !== null)
              ? 'linear-gradient(135deg, rgba(30, 255, 0, 0.6) 0%, rgba(13, 255, 0, 0.6) 100%)'
              : 'rgba(102, 102, 102, 0.5)',
            border: '0.5px solid rgba(133, 133, 133, 0.5)',
            backdropFilter: 'blur(17.5px)',
            boxShadow: (razorpayLoaded && selectedSlotIndex !== null && selectedDuration !== null)
              ? '0 4px 12px rgba(30, 255, 0, 0.3)'
              : 'none',
            transition: 'all 0.2s ease',
            cursor: (razorpayLoaded && selectedSlotIndex !== null && selectedDuration !== null) ? 'pointer' : 'not-allowed',
            opacity: (razorpayLoaded && selectedSlotIndex !== null && selectedDuration !== null) ? 1 : 0.6,
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            if (razorpayLoaded && selectedSlotIndex !== null && selectedDuration !== null) {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'scale(0.98)';
            }
          }}
          onMouseLeave={(e) => {
            if (razorpayLoaded && selectedSlotIndex !== null && selectedDuration !== null) {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <div
            className="w-full h-full rounded-[20.25px] flex items-center justify-center"
            style={{
              background: 'transparent',
              borderRadius: '20.25px'
            }}
          >
            <span
              className="font-medium"
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(15px, 4vw, 18px)',
                letterSpacing: '0.3px'
              }}
            >
              {razorpayLoaded ? 'Book Slots' : 'Loading...'}
            </span>
          </div>
        </button>

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
          {/* QR Code icon will be added here */}
        </div>
    </div>
    </MobileContainer>
  );
}

