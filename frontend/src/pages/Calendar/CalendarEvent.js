import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { calendarAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const CalendarEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await calendarAPI.getEvent(id);
      if (response.data.success) {
        setEvent(response.data.data);
      } else {
        toast.error('Event not found');
        navigate('/calendar');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      if (error.response?.status === 404) {
        toast.error('Event not found');
      } else {
        toast.error('Failed to load event');
      }
      navigate('/calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/calendar');
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await calendarAPI.deleteEvent(id);
      toast.success('Event deleted successfully');
      navigate('/calendar');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  // Check if user can edit/delete this event
  const canEdit = user && (
    user.role === 'admin' || 
    (event && event.organizer && event.organizer.id === user.id)
  );
  const canManage = user && (user.role === 'faculty' || user.role === 'admin');

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <>
        <BackgroundImage />
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event?.title} - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="View calendar event details" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-4xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              ← Back to Calendar
            </button>

            {/* Event Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{event?.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>Type:</strong> {event?.event_type ? event.event_type.replace('_', ' ') : 'N/A'}
                    </span>
                    <span>
                      <strong>Date:</strong> {formatDateTime(event?.event_date)}
                    </span>
                    {event?.end_date && (
                      <span>
                        <strong>End:</strong> {formatDateTime(event?.end_date)}
                      </span>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/calendar/create?edit=${id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Event Details</h2>
                <div className="space-y-3">
                  {event?.department && (
                    <p>
                      <strong>Department:</strong> {event.department}
                    </p>
                  )}
                  {event?.location && (
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                  )}
                  {event?.organizer && (
                    <p>
                      <strong>Organizer:</strong> {event.organizer.firstName} {event.organizer.lastName}
                    </p>
                  )}
                  {event?.status && (
                    <p>
                      <strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${
                        event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </p>
                  )}
                  {event?.description && (
                    <div>
                      <strong>Description:</strong>
                      <p className="mt-2 text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Print Event
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Calendar
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CalendarEvent;
