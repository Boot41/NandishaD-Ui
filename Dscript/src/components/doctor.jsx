import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../css_files/doctor.css';

const SlidingMenu = () => {
  const [appointments, setAppointments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch appointments
  useEffect(() => {
    axios.get('http://localhost:5000/appointments')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  // Toggle menu open/closed
  const handleToggleMenu = () => setIsMenuOpen(prevState => !prevState);

  // Handle click outside of the menu
  const handleOutsideClick = useCallback((e) => {
    if (isMenuOpen && !e.target.closest('.sliding-menu') && !e.target.closest('.toggle-button')) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMenuOpen, handleOutsideClick]);

  // Handle patient selection
  const handleAllowPatient = (id) => {
    const patient = appointments.find(appointment => appointment.id === id);
    setSelectedPatient(patient);
  };

  // Handle chat prompt change
  const handleChange = (event) => setPrompt(event.target.value);

  // Handle chat submission
  const handleSubmit = () => {
    axios.post('http://localhost:5000/chat', { prompt })
      .then(response => {
        const newMessage = { prompt, response: response.data };
        setChatHistory(prevHistory => [...prevHistory, newMessage]);
        console.log(response);
        setPrompt('');
      })
      .catch(error => console.error('Error sending prompt to server:', error));
  };
  

  return (
    <div className="doctor-dashboard">
      {/* Toggle Menu Button */}
      <button className="toggle-button" onClick={handleToggleMenu}>
        {isMenuOpen ? 'Close Menu' : 'Open Menu'}
      </button>

      {/* Sliding Menu */}
      <div className={`sliding-menu ${isMenuOpen ? 'open' : ''}`}>
        {appointments.map(appointment => (
          <div key={appointment.id} className="appointment-card">
            <p>ID: {appointment.id}</p>
            <p>Name: {appointment.fullName}</p>
            <button onClick={() => handleAllowPatient(appointment.id)}>Allow Patient</button>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Prescription Section */}
        <div className="prescription-section">
          {selectedPatient ? (
            <>
              <h2>Prescription for {selectedPatient.fullName}</h2>
              <div className="prescription-grid">
                <div className="grid-item">
                  <label>Patient Name:</label>
                  <input type="text" value={selectedPatient.fullName} readOnly />
                </div>
                <div className="grid-item">
                  <label>Age:</label>
                  <input type="text" value={selectedPatient.dateOfBirth} readOnly />
                </div>
                <div className="grid-item">
                  <label>Appointment Date:</label>
                  <input type="text" value={selectedPatient.appointmentDate} readOnly />
                </div>
                <div className="grid-item">
                  <label>Diagnosis:</label>
                  <textarea placeholder="Enter diagnosis here"></textarea>
                </div>
                {/* Add more fields as needed */}
              </div>
            </>
          ) : (
            <div className="no-patient-message">
              <p>No patient selected yet. Please select a patient from the menu.</p>
            </div>
          )}
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-container">
          <div className="chat-box">
            {chatHistory.map((message, index) => (
              <div key={index} className="message">
                <div className="user-prompt">{message.prompt}</div>
                <div className="bot-response">{message.response}</div>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              className="input-field"
              type="text"
              value={prompt}
              onChange={handleChange}
              placeholder="Enter Your Prompt"
            />
            <button className="button" onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingMenu;
