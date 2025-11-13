import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { calendarAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [monthInput, setMonthInput] = useState(() => new Date().getMonth() + 1);
  const [yearInput, setYearInput] = useState(() => new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const calendarDays = useMemo(() => buildDaysForMonth(currentMonth), [currentMonth]);

  // Check if user can manage events (faculty or admin)
  const canManageEvents = user && (user.role === 'faculty' || user.role === 'admin');

  // Fetch events for the current month
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const response = await calendarAPI.getEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      if (response.data.success) {
        setEvents(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthYearSubmit = (e) => {
    e.preventDefault();
    if (!yearInput || !monthInput) return;
    const newDate = new Date(yearInput, monthInput - 1, 1);
    setCurrentMonth(newDate);
  };

  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    try {
      await calendarAPI.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = {};
    events.forEach(event => {
      const eventDate = new Date(event.event_date);
      const dateKey = formatKey(eventDate);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  // Format time from event date
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {currentMonth.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h1>
              {canManageEvents && (
                <button
                  onClick={() => navigate('/calendar/create')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Event
                </button>
              )}
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

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading events...</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-200 bg-white">
                {calendarDays.map(({ date, dayNumber, dayName }) => {
                  const isTodayFlag = isSameDay(date, today);
                  const dateKey = formatKey(date);
                  const eventsForDay = eventsByDate[dateKey] || [];

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
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {`${eventsForDay.length} event${eventsForDay.length > 1 ? 's' : ''}`}
                      </div>
                      {eventsForDay.length > 0 && (
                        <div className="w-full px-10 pb-4">
                          <div className="space-y-3">
                            {eventsForDay.map((event) => {
                              const canEdit = canManageEvents && (
                                user.role === 'admin' || 
                                (event.organizer && event.organizer.id === user.id)
                              );
                              
                              return (
                                <div
                                  key={event.id}
                                  className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
                                      <p className="text-xs text-gray-500 mt-1">{event.department || 'N/A'}</p>
                                      <p className="text-xs text-gray-500">Time: {formatTime(event.event_date)}</p>
                                      {event.location && (
                                        <p className="text-xs text-gray-500">Location: {event.location}</p>
                                      )}
                                      {event.description && (
                                        <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                                      )}
                                      {event.event_type && (
                                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                          {event.event_type.replace('_', ' ')}
                                        </span>
                                      )}
                                    </div>
                                    {canEdit && (
                                      <div className="flex gap-2 ml-4">
                                        <button
                                          onClick={() => navigate(`/calendar/event/${event.id}`)}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                          title="View Event"
                                        >
                                          <EyeIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => navigate(`/calendar/create?edit=${event.id}`)}
                                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                          title="Edit Event"
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(event.id, event.title)}
                                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                          title="Delete Event"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {Object.keys(eventsByDate).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No events scheduled for this month.</p>
                    {canManageEvents && (
                      <button
                        onClick={() => navigate('/calendar/create')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add First Event
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Calendar;
