import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    type: 'thesis',
    thesisTitle: '',
    thesisAuthors: '',
    defenseType: 'Thesis Defense',
    defenders: '',
    panelists: '',
    defenseDate: '',
    defenseNotes: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock events data - replace with actual API call
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Machine Learning Research",
        type: "thesis",
        date: "2023-05-15",
        authors: "John Doe, Jane Smith"
      },
      {
        id: 2,
        title: "Thesis Defense - Web Development",
        type: "defense",
        date: "2023-06-20T10:00:00",
        defenders: "Alice Johnson",
        panelists: "Dr. Smith, Dr. Brown",
        defenseType: "Thesis Defense"
      }
    ];
    
    setEvents(mockEvents);
    setIsLoading(false);
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
  };

  const handleDateClick = (date) => {
    setModalData({
      title: 'Add Event',
      type: 'thesis',
      thesisTitle: '',
      thesisAuthors: '',
      defenseType: 'Thesis Defense',
      defenders: '',
      panelists: '',
      defenseDate: date + 'T09:00',
      defenseNotes: ''
    });
    setShowModal(true);
  };

  const handleEventClick = (event) => {
    if (event.type === 'defense') {
      setModalData({
        title: 'Edit Defense',
        type: 'defense',
        thesisTitle: '',
        thesisAuthors: '',
        defenseType: event.defenseType || 'Thesis Defense',
        defenders: event.defenders || '',
        panelists: event.panelists || '',
        defenseDate: event.date,
        defenseNotes: event.notes || ''
      });
    } else {
      setModalData({
        title: 'Edit Thesis',
        type: 'thesis',
        thesisTitle: event.title,
        thesisAuthors: event.authors || '',
        defenseType: 'Thesis Defense',
        defenders: '',
        panelists: '',
        defenseDate: event.date + 'T09:00',
        defenseNotes: ''
      });
    }
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submit event:', modalData);
    setShowModal(false);
  };

  const handleModalDelete = async () => {
    if (window.confirm('Delete this event?')) {
      // Handle deletion
      console.log('Delete event');
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Generate year options
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = 2015; year <= currentYear + 5; year++) {
    yearOptions.push(year);
  }

  return (
    <>
      <Helmet>
        <title>Calendar - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="View and manage thesis events and defenses on the calendar" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-6xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Thesis Calendar</h1>
            
            {/* Year Selector */}
            <div className="mb-6">
              <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700 mb-2">
                <strong>Jump to Year:</strong>
              </label>
              <select
                id="yearSelect"
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Calendar Placeholder */}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Calendar View</h3>
              <p className="text-gray-600 mb-4">
                This would integrate with FullCalendar or similar library
              </p>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => (
                  <div
                    key={i}
                    className="p-2 h-16 bg-white border border-gray-200 rounded cursor-pointer hover:bg-blue-50"
                    onClick={() => handleDateClick(`2023-05-${String(i + 1).padStart(2, '0')}`)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Events List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {event.type === 'defense' ? 'Defense' : 'Thesis Submission'} • {event.date}
                        </p>
                        {event.authors && (
                          <p className="text-sm text-gray-500">Authors: {event.authors}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        event.type === 'defense' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {event.type === 'defense' ? 'Defense' : 'Thesis'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{modalData.title}</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type:
                </label>
                <select
                  value={modalData.type}
                  onChange={(e) => setModalData({...modalData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="thesis">Thesis Submission</option>
                  <option value="defense">Defense</option>
                </select>
              </div>

              {modalData.type === 'thesis' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title:
                    </label>
                    <input
                      type="text"
                      value={modalData.thesisTitle}
                      onChange={(e) => setModalData({...modalData, thesisTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Authors:
                    </label>
                    <input
                      type="text"
                      value={modalData.thesisAuthors}
                      onChange={(e) => setModalData({...modalData, thesisAuthors: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Defense Type:
                    </label>
                    <select
                      value={modalData.defenseType}
                      onChange={(e) => setModalData({...modalData, defenseType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Thesis Defense">Thesis Defense</option>
                      <option value="Title Defense">Title Defense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Defenders:
                    </label>
                    <input
                      type="text"
                      value={modalData.defenders}
                      onChange={(e) => setModalData({...modalData, defenders: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Panelists:
                    </label>
                    <input
                      type="text"
                      value={modalData.panelists}
                      onChange={(e) => setModalData({...modalData, panelists: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time:
                    </label>
                    <input
                      type="datetime-local"
                      value={modalData.defenseDate}
                      onChange={(e) => setModalData({...modalData, defenseDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes:
                    </label>
                    <textarea
                      value={modalData.defenseNotes}
                      onChange={(e) => setModalData({...modalData, defenseNotes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleModalDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Calendar;
