import { useState } from 'react';
import axios from 'axios';
import '../css_files/receptionist.css'

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: '',
    preferredDoctor: '',
    appointmentType: '',
    insuranceDetails: '',
    emergencyContact: '',
    specialRequests: '',
    abhaCardDetails: '',
    confirmationMethod: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/save-appointment', formData)
      .then(() => {
        alert('Appointment saved successfully');
      })
      .catch(() => {
        alert('Error saving appointment');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <h2>Schedule Appointment</h2>

      <div className="form-group">
        <label>Full Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Phone Number:</label>
        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Appointment Date:</label>
        <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Appointment Time:</label>
        <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Reason for Visit:</label>
        <textarea name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Preferred Doctor:</label>
        <input type="text" name="preferredDoctor" value={formData.preferredDoctor} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Appointment Type:</label>
        <select name="appointmentType" value={formData.appointmentType} onChange={handleChange}>
          <option value="in-person">In-person</option>
          <option value="virtual">Virtual/Telehealth</option>
        </select>
      </div>

      <div className="form-group">
        <label>Insurance Details:</label>
        <input type="text" name="insuranceDetails" value={formData.insuranceDetails} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Emergency Contact:</label>
        <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Special Requests or Notes:</label>
        <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>ABHA Card Details:</label>
        <input type="text" name="abhaCardDetails" value={formData.abhaCardDetails} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Confirmation Method:</label>
        <select name="confirmationMethod" value={formData.confirmationMethod} onChange={handleChange}>
          <option value="SMS">SMS</option>
          <option value="email">Email</option>
        </select>
      </div>

      <button type="submit">Schedule Appointment</button>
    </form>
  );
};

export default AppointmentForm;
