import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { calendarAPI, departmentsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CalendarCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    event_type: 'other',
    department: user?.department || '',
    is_public: true
  });
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
    if (isEditMode && editId) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, editId]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getDepartments();
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await calendarAPI.getEvent(editId);
      if (response.data.success) {
        const event = response.data.data;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
          end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
          location: event.location || '',
          event_type: event.event_type || 'other',
          department: event.department || user?.department || '',
          is_public: event.is_public !== undefined ? event.is_public : true
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event');
      navigate('/calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.title.trim()) {
        toast.error('Event title is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.event_date) {
        toast.error('Event date is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.department || !formData.department.trim()) {
        toast.error('Department is required');
        setIsSubmitting(false);
        return;
      }

      // Prepare event data with proper formatting
      const eventData = {
        title: formData.title.trim(),
        description: formData.description ? formData.description.trim() : '',
        event_date: new Date(formData.event_date).toISOString(),
        location: formData.location ? formData.location.trim() : '',
        event_type: formData.event_type,
        department: formData.department.trim(),
        is_public: formData.is_public
      };

      // Only add end_date if it's provided and not empty
      if (formData.end_date && formData.end_date.trim()) {
        eventData.end_date = new Date(formData.end_date).toISOString();
      }

      if (isEditMode) {
        await calendarAPI.updateEvent(editId, eventData);
        toast.success('Event updated successfully');
      } else {
        await calendarAPI.createEvent(eventData);
        toast.success('Event created successfully');
      }
      
      navigate('/calendar');
    } catch (error) {
      console.error('Error saving event:', error);
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors ? 
                            error.response.data.errors.map(e => e.msg).join(', ') : 
                            `Failed to ${isEditMode ? 'update' : 'create'} event`);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Edit Calendar Event' : 'Create Calendar Event'} - FAITH Colleges Thesis Archive</title>
        <meta name="description" content={isEditMode ? 'Edit calendar event' : 'Create a new calendar event'} />
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              {isEditMode ? 'Edit Calendar Event' : 'Create Calendar Event'}
            </h1>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading event...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="thesis_submission">Thesis Submission</option>
                    <option value="thesis_defense">Thesis Defense</option>
                    <option value="title_defense">Title Defense</option>
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="event_date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.filter(d => d.is_active).map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event location"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_public"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                    Make this event public
                  </label>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Event' : 'Create Event')}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/calendar')}
                    className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CalendarCreate;
