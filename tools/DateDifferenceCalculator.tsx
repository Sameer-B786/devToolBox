import React, { useState, useMemo } from 'react';
import ActionButton from '../components/common/ActionButton';

const DateDifferenceCalculator: React.FC = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const difference = useMemo(() => {
        if (!startDate || !endDate) return null;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = (diffDays / 7).toFixed(2);
        const diffYears = (diffDays / 365.25).toFixed(2);

        return { days: diffDays, weeks: diffWeeks, years: diffYears };
    }, [startDate, endDate]);

    return (
        <div>
            <div className="flex flex-wrap items-center gap-4">
                <div>
                    <label htmlFor="start-date" className="font-medium">Start Date:</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="ml-2 p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="end-date" className="font-medium">End Date:</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="ml-2 p-2 border rounded-md"
                    />
                </div>
            </div>
            {difference && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Difference is:</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                         <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="text-4xl font-bold text-primary">{difference.days}</div>
                            <div className="text-sm text-gray-500">Days</div>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="text-4xl font-bold text-primary">{difference.weeks}</div>
                            <div className="text-sm text-gray-500">Weeks</div>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="text-4xl font-bold text-primary">{difference.years}</div>
                            <div className="text-sm text-gray-500">Years</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateDifferenceCalculator;
