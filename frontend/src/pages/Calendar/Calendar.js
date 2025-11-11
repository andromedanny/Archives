import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MOCK_EVENTS = {
  '2025-11-03': [
    {
      id: 'evt-101',
      title: 'Thesis Defense: Smart Irrigation System',
      department: 'College of Engineering',
      time: '10:00 AM',
      location: 'Room 402',
      description: 'Final defense with panel.',
    },
  ],
  '2025-11-10': [
    {
      id: 'evt-201',
      title: 'Submission: AI-driven Fraud Detection',
      department: 'College of Business and Accountancy',
      time: 'All Day',
      location: 'Registrar Office',
      description: 'Final manuscript submission.',
    },
    {
      id: 'evt-202',
      title: 'Thesis Defense: Interactive VR Tour',
      department: 'College of Computing',
      time: '2:00 PM',
      location: 'Innovation Lab',
      description: 'Defense for VR project.',
    },
  ],
  '2025-11-18': [
    {
      id: 'evt-301',
      title: 'Proposal Review: Green Campus Initiative',
      department: 'School of Graduate Studies',
      time: '1:30 PM',
      location: 'Conference Room B',
      description: 'Proposal review with committee.',
    },
  ],
};

const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getLastDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const buildDaysForMonth = (currentMonth) => {
  const totalDays = getLastDayOfMonth(currentMonth).getDate();
  return Array.from({ length: totalDays }, (_, idx) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), idx + 1);
    return {
      date,
      dayNumber: idx + 1,
      dayName: DAYS_OF_WEEK[date.getDay()],
    };
  });
};

const formatKey = (date) => date.toISOString().split('T')[0];
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const Calendar = () => {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [monthInput, setMonthInput] = useState(() => new Date().getMonth() + 1);
  const [yearInput, setYearInput] = useState(() => new Date().getFullYear());

  const calendarDays = useMemo(() => buildDaysForMonth(currentMonth), [currentMonth]);

  const handleMonthYearSubmit = (e) => {
    e.preventDefault();
    if (!yearInput || !monthInput) return;
    const newDate = new Date(yearInput, monthInput - 1, 1);
    setCurrentMonth(newDate);
  };

  return (
    <>
      <Helmet>
        <title>Calendar - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="View the academic calendar." />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main
        className="min-h-screen pt-16 pb-20"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="w-11/12 max-w-4xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/60"
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {currentMonth.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h1>
            </div>

            <form
              onSubmit={handleMonthYearSubmit}
              className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 rounded-2xl px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="month" className="text-sm font-medium text-gray-600">
                  Month
              </label>
              <select
                  id="month"
                  value={monthInput}
                  onChange={(e) => setMonthInput(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 12 }).map((_, index) => (
                    <option key={index} value={index + 1}>
                      {new Date(0, index).toLocaleDateString('en-US', { month: 'long' })}
                    </option>
                ))}
              </select>
            </div>
              <div className="flex items-center gap-2">
                <label htmlFor="year" className="text-sm font-medium text-gray-600">
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={1900}
                  max={2100}
                  required
                />
              </div>
              <button
                type="submit"
                className="ml-auto px-5 py-2 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
              >
                Go
              </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-200 bg-white">
              {calendarDays.map(({ date, dayNumber, dayName }) => {
                const isTodayFlag = isSameDay(date, today);
                const eventsForDay = MOCK_EVENTS[formatKey(date)] || [];
                if (eventsForDay.length === 0) {
                  return null;
                }

                return (
                  <div
                    key={date.toISOString()}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 gap-3 bg-white"
                    style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border ${
                          isTodayFlag
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-gray-300 text-gray-700 bg-gray-50'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wide font-semibold">{dayName}</span>
                        <span className="text-lg font-bold">{dayNumber}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {eventsForDay.length === 0 ? (
                          <p className="text-xs text-gray-400">No events scheduled.</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {eventsForDay.length === 0
                          ? 'Departments can populate thesis events for this date.'
                          : `${eventsForDay.length} event${eventsForDay.length > 1 ? 's' : ''}`}
                  </div>
                    {eventsForDay.length > 0 && (
                      <div className="px-10 pb-4">
                        <div className="space-y-3">
                          {eventsForDay.map((event) => (
                            <div
                              key={event.id}
                              className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3"
                            >
                              <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
                              <p className="text-xs text-gray-500">{event.department}</p>
                              <p className="text-xs text-gray-500">Time: {event.time}</p>
                              <p className="text-xs text-gray-500">Location: {event.location}</p>
                              {event.description && (
                                <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                              )}
                  </div>
                ))}
              </div>
            </div>
                        )}
                      </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Calendar;
