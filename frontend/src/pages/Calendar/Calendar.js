import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// FullCalendar CSS is loaded via CDN in index.html
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

const Calendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const calendarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user can manage events (faculty or admin only - advisers can view but not create)
  const canManageEvents = user && (user.role === 'faculty' || user.role === 'admin');

  // Transform API events to FullCalendar format
  const transformEvents = (apiEvents) => {
    return apiEvents.map(event => ({
      id: String(event.id),
      title: event.title,
      start: event.event_date,
      end: event.end_date || null,
      allDay: !event.event_date.includes('T') || event.event_date.split('T')[1] === '00:00:00',
      backgroundColor: getEventColor(event.event_type),
      borderColor: getEventColor(event.event_type),
      textColor: '#ffffff',
      extendedProps: {
        department: event.department,
        event_type: event.event_type,
        location: event.location,
        description: event.description,
        organizer: event.organizer,
        originalEvent: event
      }
    }));
  };

  // Get color based on event type
  const getEventColor = (eventType) => {
    const colors = {
      thesis_defense: '#dc2626',      // red
      title_defense: '#ea580c',       // orange
      thesis_submission: '#2563eb',   // blue
      meeting: '#059669',             // green
      deadline: '#7c3aed',            // purple
      other: '#6b7280'                // gray
    };
    return colors[eventType] || colors.other;
  };

  // Fetch events function for FullCalendar - using useCallback to ensure stable reference
  const fetchEvents = useCallback(async (info, successCallback, failureCallback) => {
    try {
      setIsLoading(true);
      const response = await calendarAPI.getEvents({
        startDate: info.start.toISOString(),
        endDate: info.end.toISOString()
      });

      if (response.data.success) {
        const transformedEvents = transformEvents(response.data.data || []);
        if (successCallback && typeof successCallback === 'function') {
          successCallback(transformedEvents);
        }
      } else {
        // Return empty array instead of calling failureCallback to prevent infinite retries
        if (successCallback && typeof successCallback === 'function') {
          successCallback([]);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Only show error if it's not a 401 (unauthorized) - user might not be logged in
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        // Use a single toast that won't spam
        const errorMessage = error.response?.data?.message || 'Failed to load calendar events';
        // Only show toast if we haven't shown it recently (prevent spam)
        if (!window.calendarErrorShown) {
          toast.error(errorMessage);
          window.calendarErrorShown = true;
          setTimeout(() => {
            window.calendarErrorShown = false;
          }, 5000); // Reset after 5 seconds
        }
      }
      // Return empty array instead of calling failureCallback to prevent infinite retries
      if (successCallback && typeof successCallback === 'function') {
        successCallback([]);
      }
    } finally {
      // Always hide loading indicator - use a small timeout to ensure state updates properly
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, []);

  // Handle event click
  const handleEventClick = (clickInfo) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    navigate(`/calendar/event/${originalEvent.id}`);
  };

  // Handle date click (to create new event)
  const handleDateClick = (dateClickInfo) => {
    if (canManageEvents) {
      const dateStr = dateClickInfo.dateStr;
      navigate(`/calendar/create?date=${dateStr}`);
    }
  };

  // Handle delete event
  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    try {
      await calendarAPI.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      // Refresh calendar
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <>
      <Helmet>
        <title>Calendar - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="View the academic calendar and thesis defense schedules." />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main
        className="min-h-screen pt-16 pb-20"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/60"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Academic Calendar</h1>
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

            <div className="calendar-container" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <style>{`
                .fc {
                  background-color: white !important;
                }
                .fc-theme-standard td, .fc-theme-standard th {
                  border-color: #e5e7eb !important;
                }
                .fc-scrollgrid {
                  background-color: white !important;
                }
                .fc-daygrid-day {
                  background-color: white !important;
                }
                .fc-col-header-cell {
                  background-color: #f9fafb !important;
                }
              `}</style>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={fetchEvents}
                loading={(loading) => setIsLoading(loading)}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                editable={false}
                selectable={canManageEvents}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                height="auto"
                eventDisplay="block"
                eventTimeFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={true}
                eventContent={(eventInfo) => {
                  const event = eventInfo.event;
                  return (
                    <div className="fc-event-main-frame">
                      <div className="fc-event-time">{eventInfo.timeText}</div>
                      <div className="fc-event-title-container">
                        <div className="fc-event-title fc-sticky">
                          {event.title}
                        </div>
                      </div>
                      {event.extendedProps.location && (
                        <div className="fc-event-location text-xs opacity-75">
                          📍 {event.extendedProps.location}
                        </div>
                      )}
                    </div>
                  );
                }}
                eventDidMount={(info) => {
                  // Add tooltip on hover
                  info.el.setAttribute('title', 
                    `${info.event.title}\n${info.event.extendedProps.location || 'No location'}\n${info.event.extendedProps.department || ''}`
                  );
                }}
              />
            </div>

            {/* Event Type Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                <span>Thesis Defense</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ea580c' }}></div>
                <span>Title Defense</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2563eb' }}></div>
                <span>Thesis Submission</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#059669' }}></div>
                <span>Meeting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7c3aed' }}></div>
                <span>Deadline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6b7280' }}></div>
                <span>Other</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Calendar;
