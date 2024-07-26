import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../css_files/doctor.css';

const DoctorDash = () => {
  const [appointments, setAppointments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({
    name: 'Dr. John Doe',
    chamber: 'XYZ Clinic',
    address: '123 Main St',
    room: '101'
  });
  const [symptoms, setSymptoms] = useState('');
  const [tests, setTests] = useState('');
  const [advice, setAdvice] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch appointments
  useEffect(() => {
    axios.get('https://backend-dscript-nandishnaik01.onrender.com/appointments')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  // Toggle menu open/closed
  const handleToggleMenu = () => setIsMenuOpen(prevState => !prevState);

  
  const handlePrint = () => {
    const printContent = document.querySelector('.prescription-section').innerHTML;
    const originalContent = document.body.innerHTML;
  
    const newWindow = window.open('', '', 'height=700,width=900');
    newWindow.document.write('<html><head><title>Print Prescription</title>');
    newWindow.document.write('<style>/* Include your CSS styles here */</style>');
    newWindow.document.write('</head><body>');
    newWindow.document.write(printContent);
    newWindow.document.write('</body></html>');
  
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
  };

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


  const handleAllowPatient = (id) => {
    const patient = appointments.find(appointment => appointment.id === id);
    if (patient) {
      // Set selected patient and update doctor details
      setSelectedPatient(patient);
      setDoctorDetails(prev => ({
        ...prev,
        name: 'Dr. John Doe', // Update with actual doctor's name
        chamber: 'XYZ Clinic', // Update with actual chamber name
        address: '123 Main St', // Update with actual address
        mobile: '0XXXXXXXXX', // Update with actual mobile number
        room: '101' // Update with actual room number
      }));
  
      // Send the patient data to be added to attendedpatients.json
      axios.post('https://backend-dscript-nandishnaik01.onrender.com/attend-patient', { patient })
        .then(response => {
          // Handle successful response, remove card from the UI
          const cardElement = document.querySelector(`.appointment-card[data-id="${id}"]`);
          if (cardElement) {
            cardElement.classList.add('fade-out');
            setTimeout(() => {
              setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
            }, 300); // Match the transition duration
          }
        })
        .catch(error => {
          // console.error('Error sending patient to attended list:', error);
          alert('patient allowed.');
        });
    }
  };

  // Handle change for chat prompt
  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  // Handle chat submission
  const handleSubmit = () => {
    axios.post('https://backend-dscript-nandishnaik01.onrender.com/chat', { prompt })
      .then(response => {
        const newMessage = { prompt, response: response.data };
        setChatHistory(prevHistory => [...prevHistory, newMessage]);
        console.log(response);
        setPrompt('');
      })
      .catch(error => console.error('Error sending prompt to server:', error));
  };

  // Handle save action
  const handleSave = () => {
    if (selectedPatient) {
      const data = {
        patientId: selectedPatient.id,
        patientname: selectedPatient.fullName,
        patientphoneNumber: selectedPatient.phoneNumber,
        doctorDetails,
        symptoms,
        tests,
        advice,
        diagnosis
      };
      axios.post('https://backend-dscript-nandishnaik01.onrender.com/save-report', data)
        .then(response => {
          console.log('Report saved successfully:', response.data);
          alert('Report saved successfully!');
        })
        .catch(error => console.error('Error saving report:', error));
    } else {
      alert('No patient selected.');
    }
  };

  return (
<div className="whole">
    <button className="toggle-button" onClick={handleToggleMenu}>
    {isMenuOpen ? 'Close Menu' : 'Open Menu'}
  </button>
    <div className="doctor-dashboard">
      {/* Toggle Menu Button */}
     

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

      <div className="main-content">
        {/* Prescription Section */}
        <div className="prescription-section">
        {selectedPatient ? (
          <div className="wrapper">
            <div className="prescription_form">
              <table className="prescription" border="1">
                <tbody>
                  <tr height="15%">
                    <td colSpan="2">
                      <div className="header">
                        <div className="logo">
                          <img src="https://seeklogo.com/images/H/hospital-clinic-plus-logo-7916383C7A-seeklogo.com.png" alt="Logo" />
                        </div>
                        <div className="credentials">
                          <h4>{doctorDetails.name}</h4>
                          <p>{doctorDetails.chamber}</p>
                          <small>{doctorDetails.address}</small>
                          <br />
                          <small>Mb. {doctorDetails.mobile}</small>
                          <br />
                          <small>Room No: {doctorDetails.room}</small>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td width="40%">
                    <div className="desease_details">
  <div className="patient-details">
    <h4 className="d-header">Patient Details</h4>
    <p><strong>Name:</strong> {selectedPatient.fullName}</p>
    <p><strong>Age:</strong> {selectedPatient.age}</p>
    <p><strong>Appointment Date:</strong> {selectedPatient.appointmentDate}</p>
  </div>
  <div className="symptoms">
    <h4 className="d-header">Symptoms</h4>
    <textarea
      className="inputs"
      value={symptoms}
      onChange={(e) => {
        setSymptoms(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      placeholder=""
      required
    />
  </div>
  <div className="tests">
    <h4 className="d-header">Tests</h4>
    <textarea
      className="inputs"
      value={tests}
      onChange={(e) => {
        setTests(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      placeholder=""
    />
  </div>
  <div className="advice">
    <h4 className="d-header">Advice</h4>
    <textarea
      className="inputs"
      value={advice}
      onChange={(e) => {
        setAdvice(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      placeholder=""
    />
  </div>
</div>

                    </td>
                    <td width="60%" valign="top">
                      <span style={{ fontSize: '3em' }}>R<sub>x</sub></span>
                      <hr />
                      <div className="medicine">
                        <h4 className="d-header">Diagnosis</h4>
                        <section className="med_list">
                          <textarea
                            id="add_med"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder=""
                          />
                        </section>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
            </div>
           
          </div>
        ) : (
          <div className="no-patient-message">
            <p>No patient selected yet. Please select a patient from the menu.</p>
          </div>
        )}
         <div className="button_group">
                <button className="issue_prescription btn btn-success" onClick={handleSave}>Save</button>
                {/* <button className="btn btn-info" onClick={handleShare}>Share</button> */}
                <button className="issue_prescription btn btn-success" onClick={handlePrint}>Print</button> 
               
              </div>
      </div>

{/* Chatbot Section */}
        <div className="chatbot-container">
    <div className="chat-box">
      {chatHistory.map((message, index) => (
        <div key={index} className="message">
          <div className="user-prompt">{message.prompt}</div>
          <div
            className="bot-response"
            dangerouslySetInnerHTML={{ __html: message.response }}
            style={{
              marginBottom: '15px',
          lineHeight: '1.8' // Adjust line spacing here
            }}
          />
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
      <div className="savewrapper">
        <button className="button" onClick={handleSubmit}>Send</button>
      </div>
    </div>
  </div>
      </div>
    </div>
    </div>
  );
};

export default DoctorDash;
