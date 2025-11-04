import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const CalendarEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockEvent = {
      id: id,
      title: "Thesis Defense - Web Development",
      type: "defense",
      date: "2023-06-20T10:00:00",
      defenders: "Alice Johnson",
      panelists: "Dr. Smith, Dr. Brown",
      defenseType: "Thesis Defense",
      notes: "Final defense presentation"
    };
    
    setEvent(mockEvent);
    setIsLoading(false);
  }, [id]);

  const handleBack = () => {
    navigate('/calendar');
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
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{event?.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span><strong>Type:</strong> {event?.type}</span>
                <span><strong>Date:</strong> {new Date(event?.date).toLocaleString()}</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              {event?.type === 'defense' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Defense Details</h2>
                    <div className="space-y-3">
                      <p><strong>Defense Type:</strong> {event?.defenseType}</p>
                      <p><strong>Defenders:</strong> {event?.defenders}</p>
                      <p><strong>Panelists:</strong> {event?.panelists}</p>
                      {event?.notes && (
                        <p><strong>Notes:</strong> {event?.notes}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Print Event
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
