import React, { useState, useMemo } from 'react';
import ActionButton from '../components/common/ActionButton';

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<{ years: number, months: number, days: number } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;
    const today = new Date();
    const dob = new Date(birthDate);

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAge({ years, months, days });
  };
  
  return (
    <div>
      <div className="flex items-center gap-4">
        <label htmlFor="birthdate" className="font-medium">Enter your date of birth:</label>
        <input
          type="date"
          id="birthdate"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          className="p-2 border rounded-md"
        />
        <ActionButton onClick={calculateAge}>Calculate Age</ActionButton>
      </div>
      {age && (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Your Age is:</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                 <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-4xl font-bold text-primary">{age.years}</div>
                    <div className="text-sm text-gray-500">Years</div>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-4xl font-bold text-primary">{age.months}</div>
                    <div className="text-sm text-gray-500">Months</div>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-4xl font-bold text-primary">{age.days}</div>
                    <div className="text-sm text-gray-500">Days</div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
