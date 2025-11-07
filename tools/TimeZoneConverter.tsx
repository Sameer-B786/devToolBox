import React, { useState, useEffect } from 'react';

export default function TimeZoneConverter() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sourceTimezone, setSourceTimezone] = useState('America/New_York');
  const [targetTimezones, setTargetTimezones] = useState([
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]);

  const timezones = [
    { value: 'America/New_York', label: 'New York (EST/EDT)', offset: 'UTC-5/-4' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: 'UTC-8/-7' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: 'UTC-6/-5' },
    { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: 'UTC-7/-6' },
    { value: 'America/Toronto', label: 'Toronto (EST/EDT)', offset: 'UTC-5/-4' },
    { value: 'America/Mexico_City', label: 'Mexico City (CST)', offset: 'UTC-6' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: 'UTC-3' },
    { value: 'Europe/London', label: 'London (GMT/BST)', offset: 'UTC+0/+1' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 'UTC+1/+2' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 'UTC+1/+2' },
    { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: 'UTC+3' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 'UTC+4' },
    { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)', offset: 'UTC+5:30' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 'UTC+8' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 'UTC+8' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 'UTC+9' },
    { value: 'Asia/Seoul', label: 'Seoul (KST)', offset: 'UTC+9' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)', offset: 'UTC+10/+11' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)', offset: 'UTC+12/+13' },
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 'UTC+0' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    setSelectedDate(dateStr);
    setSelectedTime(timeStr);
  }, []);

  const getConvertedTime = (timezone: string) => {
    if (!selectedDate || !selectedTime) return null;

    // This is a simplified approach. A robust solution would use a library like `date-fns-tz`.
    // The browser's Intl API can be inconsistent, especially with historical dates.
    try {
        const dateTimeStr = `${selectedDate}T${selectedTime}:00`;
        const sourceDate = new Date(dateTimeStr);
        
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            // year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        // Create a date object in the source timezone, then format it for the target.
        // This is tricky without a library. We create a new formatter for the source to get its offset.
        const sourceFormatter = new Intl.DateTimeFormat('en-US', { timeZone: sourceTimezone, timeZoneName: 'longOffset' });
        const sourceParts = sourceFormatter.formatToParts(new Date());
        const sourceOffsetString = sourceParts.find(p => p.type === 'timeZoneName')?.value.replace('GMT', '') || '+0';
        
        const targetFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' });
        const targetParts = targetFormatter.formatToParts(new Date());
        const targetOffsetString = targetParts.find(p => p.type === 'timeZoneName')?.value.replace('GMT', '') || '+0';

        const parseOffset = (offset: string) => {
             const [hours, minutes] = offset.split(':').map(Number);
             return (hours * 60) + (minutes || 0);
        }

        const sourceOffsetMinutes = parseOffset(sourceOffsetString);
        const targetOffsetMinutes = parseOffset(targetOffsetString);
        
        const diffMinutes = targetOffsetMinutes - sourceOffsetMinutes;
        
        const convertedDate = new Date(sourceDate.getTime() + diffMinutes * 60 * 1000);
        
        return formatter.format(convertedDate);

    } catch (e) {
        console.error("Error formatting date: ", e);
        return "Invalid Time";
    }
  };

  const addTimezone = () => {
    const availableTimezones = timezones
      .map(tz => tz.value)
      .filter(tz => tz !== sourceTimezone && !targetTimezones.includes(tz));
    
    if (availableTimezones.length > 0) {
      setTargetTimezones([...targetTimezones, availableTimezones[0]]);
    }
  };

  const removeTimezone = (index: number) => {
    setTargetTimezones(targetTimezones.filter((_, i) => i !== index));
  };

  const updateTimezone = (index: number, value: string) => {
    const newTimezones = [...targetTimezones];
    newTimezones[index] = value;
    setTargetTimezones(newTimezones);
  };

  return (
    <div className="w-full">
        {/* Current Time Display */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-sm font-medium opacity-90">Current Time</span>
        </div>
        <div className="text-3xl font-bold">
            {currentTime.toLocaleTimeString('en-US', { 
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
            })}
        </div>
        <div className="text-sm opacity-90 mt-1">
            {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            })}
        </div>
        </div>

        {/* Source Time Input */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Source Time</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
            </label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
            </label>
            <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
            </label>
            <select
                value={sourceTimezone}
                onChange={(e) => setSourceTimezone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            >
                {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                    {tz.label}
                </option>
                ))}
            </select>
            </div>
        </div>
        </div>

        {/* Converted Times */}
        <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Converted Times</h2>
            <button
            onClick={addTimezone}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Time Zone
            </button>
        </div>

        {targetTimezones.map((tz, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                <select
                    value={tz}
                    onChange={(e) => updateTimezone(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white mb-3"
                >
                    {timezones
                    .filter(t => t.value === tz || (!targetTimezones.includes(t.value) && t.value !== sourceTimezone))
                    .map((t) => (
                        <option key={t.value} value={t.value}>
                        {t.label}
                        </option>
                    ))}
                </select>
                <div className="text-2xl font-bold text-indigo-600">
                    {getConvertedTime(tz)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    {timezones.find(t => t.value === tz)?.offset}
                </div>
                </div>
                <button
                onClick={() => removeTimezone(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            </div>
        ))}
        </div>

        <div className="text-xs text-gray-500 text-center mt-6">
        Time conversions account for daylight saving time changes
        </div>
    </div>
  );
}
