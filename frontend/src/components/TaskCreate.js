import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TaskCreate = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    price: '',
    lat: '',
    lng: '',
    address: '',
    isRemote: false,
    deadline: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  if (user?.role !== 'client') return <p>Access denied</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const taskData = {
        ...formData,
        price: parseFloat(formData.price),
        location: {
          lat: formData.isRemote ? 0 : parseFloat(formData.lat),
          lng: formData.isRemote ? 0 : parseFloat(formData.lng),
          address: formData.isRemote ? 'Remote' : formData.address,
          isRemote: formData.isRemote
        }
      };
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      await axios.post('/api/tasks', taskData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Task created successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'other',
        price: '',
        lat: '',
        lng: '',
        address: '',
        isRemote: false,
        deadline: ''
      });
      
      setTimeout(() => {
        if (onTaskCreated) onTaskCreated();
      }, 1500);
    } catch (err) {
      console.error('Task creation error:', err);
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tasks-container" style={{ marginBottom: '30px' }}>
      <h2>Create New Task</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Deliver groceries from supermarket"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            placeholder="Provide details about the task..."
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            <option value="delivery">🚚 Delivery</option>
            <option value="pickup">📦 Pickup</option>
            <option value="data-entry">⌨️ Data Entry</option>
            <option value="laundry">👕 Laundry</option>
            <option value="tutoring">📚 Tutoring</option>
            <option value="babysitting">👶 Babysitting</option>
            <option value="other">🔧 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Price (KES)</label>
          <input
            type="number"
            name="price"
            placeholder="500"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="form-input"
          />
          <small style={{color: '#6b7280', display: 'block', marginTop: '5px'}}>
            Worker will receive 90% after completion (10% platform fee)
          </small>
        </div>

        <div className="form-checkbox-wrapper">
          <input
            type="checkbox"
            name="isRemote"
            checked={formData.isRemote}
            onChange={handleChange}
            className="form-checkbox"
            id="remote-checkbox"
          />
          <label htmlFor="remote-checkbox" style={{cursor: 'pointer'}}>
            💻 This is a remote task (no physical location needed)
          </label>
        </div>

        {!formData.isRemote && (
          <>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                placeholder="123 Main Street, Nairobi"
                value={formData.address}
                onChange={handleChange}
                required={!formData.isRemote}
                className="form-input"
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  type="text"
                  name="lat"
                  placeholder="-1.2921"
                  value={formData.lat}
                  onChange={handleChange}
                  required={!formData.isRemote}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  type="text"
                  name="lng"
                  placeholder="36.8219"
                  value={formData.lng}
                  onChange={handleChange}
                  required={!formData.isRemote}
                  className="form-input"
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;