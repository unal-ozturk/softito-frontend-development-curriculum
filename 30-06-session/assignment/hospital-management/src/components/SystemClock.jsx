import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function SystemClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = currentTime.toLocaleDateString('tr-TR');
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const dayName = days[currentTime.getDay()];
  const timeString = currentTime.toLocaleTimeString('tr-TR');

  return (
    <div className="system-clock-wrapper">
      <Clock className="system-clock-icon" />
      Sistem: {dateStr} {dayName}, {timeString}
    </div>
  );
}
