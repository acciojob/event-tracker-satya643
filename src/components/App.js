
import React, { useState } from "react";
import moment from 'moment';
import './../styles/App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());

  // Filter events based on current filter
  const getFilteredEvents = () => {
    const now = moment();
    switch (filter) {
      case 'past':
        return events.filter(event => moment(event.start).isBefore(now));
      case 'upcoming':
        return events.filter(event => moment(event.start).isAfter(now));
      default:
        return events;
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return getFilteredEvents().filter(event => 
      moment(event.start).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
    );
  };

  // Handle date click
  const handleDateClick = (date) => {
    const eventsForDate = getEventsForDate(date);
    if (eventsForDate.length > 0) {
      // If events exist, show edit/delete popup for the first event
      setSelectedEvent(eventsForDate[0]);
      setSelectedDate(null);
    } else {
      // If no events, show create popup
      setSelectedDate({ start: date, end: moment(date).add(1, 'hour') });
      setSelectedEvent(null);
    }
  };

  // Create new event
  const createEvent = () => {
    const titleInput = document.querySelector('[placeholder="Event Title"]');
    const locationInput = document.querySelector('[placeholder="Event Location"]');
    const title = titleInput?.value || '';
    const location = locationInput?.value || '';
    
    if (title && selectedDate) {
      const newEvent = {
        id: Date.now(),
        title,
        location,
        start: selectedDate.start,
        end: selectedDate.end
      };
      setEvents([...events, newEvent]);
      setSelectedDate(null);
      // Clear inputs
      if (titleInput) titleInput.value = '';
      if (locationInput) locationInput.value = '';
    }
  };

  // Edit existing event
  const editEvent = () => {
    const titleInput = document.querySelector('[placeholder="Event Title"]');
    const title = titleInput?.value || '';
    
    if (title && selectedEvent) {
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...event, title } : event
      ));
      setSelectedEvent(null);
    }
  };

  // Delete event
  const deleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setSelectedEvent(null);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const startOfCalendar = startOfMonth.clone().startOf('week');
    const endOfCalendar = endOfMonth.clone().endOf('week');
    
    const days = [];
    const day = startOfCalendar.clone();
    
    while (day.isSameOrBefore(endOfCalendar, 'day')) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    
    return days;
  };

  // Get event color based on date
  const getEventColor = (event) => {
    const now = moment();
    return moment(event.start).isBefore(now) ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)';
  };

  return (
    <div className="app">
      <h1>Event Tracker Calendar</h1>
      
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className="btn" 
          onClick={() => setFilter('all')}
          style={{ backgroundColor: filter === 'all' ? '#007bff' : '#6c757d', color: 'white' }}
        >
          All Events
        </button>
        <button 
          className="btn" 
          onClick={() => setFilter('past')}
          style={{ backgroundColor: filter === 'past' ? '#007bff' : '#6c757d', color: 'white' }}
        >
          Past Events
        </button>
        <button 
          className="btn" 
          onClick={() => setFilter('upcoming')}
          style={{ backgroundColor: filter === 'upcoming' ? '#007bff' : '#6c757d', color: 'white' }}
        >
          Upcoming Events
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-nav">
        <button onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))}>
          ← Previous
        </button>
        <h2>{currentMonth.format('MMMM YYYY')}</h2>
        <button onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))}>
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {generateCalendarDays().map((day, index) => {
            const eventsForDay = getEventsForDate(day);
            const isCurrentMonth = day.isSame(currentMonth, 'month');
            const isToday = day.isSame(moment(), 'day');
            
            return (
              <div 
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="day-number">{day.format('D')}</div>
                {eventsForDay.map((event, eventIndex) => (
                  <div 
                    key={eventIndex}
                    className="event-item"
                    style={{ backgroundColor: getEventColor(event) }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setSelectedDate(null);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Creation Popup */}
      {selectedDate && (
        <div className="mm-popup mm-popup--opened">
          <div className="mm-popup__box">
            <div className="mm-popup__box__header">
              <h3>Create New Event</h3>
            </div>
            <div className="mm-popup__box__body">
              <input 
                type="text" 
                placeholder="Event Title" 
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Event Location" 
                className="form-input"
              />
            </div>
            <div className="mm-popup__box__footer">
              <div className="mm-popup__box__footer__left-space">
                <button className="btn btn-secondary" onClick={() => setSelectedDate(null)}>
                  Cancel
                </button>
              </div>
              <div className="mm-popup__box__footer__right-space">
                <button className="mm-popup__btn" onClick={createEvent}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Edit/Delete Popup */}
      {selectedEvent && (
        <div className="mm-popup mm-popup--opened">
          <div className="mm-popup__box">
            <div className="mm-popup__box__header">
              <h3>Event Options</h3>
            </div>
            <div className="mm-popup__box__body">
              <input 
                type="text" 
                placeholder="Event Title" 
                defaultValue={selectedEvent.title}
                className="form-input"
              />
            </div>
            <div className="mm-popup__box__footer">
              <div className="mm-popup__box__footer__left-space">
                <button className="mm-popup__btn--danger" onClick={deleteEvent}>
                  Delete
                </button>
              </div>
              <div className="mm-popup__box__footer__right-space">
                <button className="mm-popup__btn--info" onClick={editEvent}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
