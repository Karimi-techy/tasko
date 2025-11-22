import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import TaskCreate from '../components/TaskCreate';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ taskId: null, rating: 5, comment: '' });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let endpoint = '/api/tasks/client';
      if (user.role === 'worker') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const res = await axios.get(`/api/tasks/available?lat=${latitude}&lng=${longitude}`);
                setTasks(res.data);
              } catch (error) {
                console.error('Failed to fetch nearby tasks', error);
                const res = await axios.get('/api/tasks/worker');
                setTasks(res.data);
              }
              setLoading(false);
            },
            async () => {
              try {
                const res = await axios.get('/api/tasks/worker');
                setTasks(res.data);
              } catch (error) {
                console.error('Failed to fetch tasks', error);
              }
              setLoading(false);
            }
          );
        } else {
          const res = await axios.get('/api/tasks/worker');
          setTasks(res.data);
          setLoading(false);
        }
        return;
      }
      const res = await axios.get(endpoint);
      setTasks(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      setLoading(false);
    }
  };

  const handleAccept = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/accept`);
      fetchTasks();
    } catch (error) {
      alert('Failed to accept task');
    }
  };

  const handleDeposit = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/deposit`);
      fetchTasks();
    } catch (error) {
      alert('Failed to deposit');
    }
  };

  const handleStart = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/start`);
      fetchTasks();
    } catch (error) {
      alert('Failed to start task');
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (error) {
      alert('Failed to complete task');
    }
  };

  const handleReview = async (taskId, rating, comment) => {
    try {
      await axios.post(`/api/tasks/${taskId}/review`, { rating, comment });
      fetchTasks();
      setReviewForm({ taskId: null, rating: 5, comment: '' });
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  if (!user && !loading) return <Navigate to="/login" />;
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <div>
          <span className={`role-badge ${user.role}`}>
            {user.role === 'client' ? '👤 Client' : '🔧 Worker'}
          </span>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>

        {user.role === 'client' && (
          <div className="dashboard-actions">
            <button 
              onClick={() => setShowCreate(!showCreate)} 
              className="btn btn-primary"
            >
              {showCreate ? '✕ Cancel' : '+ Create New Task'}
            </button>
          </div>
        )}
      </div>

      {showCreate && <TaskCreate onTaskCreated={() => { setShowCreate(false); fetchTasks(); }} />}

      <div className="tasks-container">
        <h2>{user.role === 'client' ? 'Your Tasks' : 'Available Tasks'}</h2>
        
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>
              {user.role === 'client' 
                ? "You haven't created any tasks yet." 
                : "No available tasks at the moment."}
            </p>
            {user.role === 'client' && (
              <button onClick={() => setShowCreate(true)} className="btn btn-primary">
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                
                <div className="task-meta">
                  <div className="task-meta-item">
                    <strong className="price-highlight">KES {task.price}</strong>
                  </div>
                  <div className="task-meta-item">
                    <span className={`status-badge ${task.status}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="task-meta-item">
                    📅 {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  {task.location && !task.location.isRemote && (
                    <div className="task-meta-item">
                      📍 {task.location.address}
                    </div>
                  )}
                  {task.location && task.location.isRemote && (
                    <div className="task-meta-item">
                      💻 Remote
                    </div>
                  )}
                </div>

                {task.client && user.role === 'worker' && (
                  <p><strong>Client:</strong> {task.client.name}</p>
                )}
                {task.worker && user.role === 'client' && (
                  <p><strong>Worker:</strong> {task.worker.name}</p>
                )}
                {task.escrow && task.escrow.deposited && (
                  <p style={{color: '#10b981'}}>✓ Payment Secured</p>
                )}

                <div className="task-actions">
                  {user.role === 'worker' && task.status === 'open' && (
                    <button onClick={() => handleAccept(task._id)} className="btn btn-success">
                      Accept Task
                    </button>
                  )}
                  
                  {user.role === 'client' && task.status === 'assigned' && task.escrow && !task.escrow.deposited && (
                    <button onClick={() => handleDeposit(task._id)} className="btn btn-primary">
                      💳 Pay via M-PESA
                    </button>
                  )}
                  
                  {task.status === 'assigned' && task.escrow && task.escrow.deposited && (
                    <button onClick={() => handleStart(task._id)} className="btn btn-success">
                      ▶ Start Task
                    </button>
                  )}
                  
                  {user.role === 'worker' && task.status === 'in-progress' && (
                    <button onClick={() => handleComplete(task._id)} className="btn btn-success">
                      ✓ Mark Complete
                    </button>
                  )}
                </div>

                {user.role === 'client' && task.status === 'completed' && task.reviews && task.reviews.length === 0 && (
                  <div className="review-section">
                    <h4>Review Worker</h4>
                    <select 
                      className="rating-select"
                      value={reviewForm.taskId === task._id ? reviewForm.rating : 5}
                      onChange={(e) => setReviewForm({ ...reviewForm, taskId: task._id, rating: e.target.value })}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="1">⭐ 1 Star</option>
                    </select>
                    <textarea
                      className="form-textarea"
                      placeholder="Share your experience..."
                      value={reviewForm.taskId === task._id ? reviewForm.comment : ''}
                      onChange={(e) => setReviewForm({ ...reviewForm, taskId: task._id, comment: e.target.value })}
                    />
                    <button 
                      onClick={() => handleReview(task._id, reviewForm.rating, reviewForm.comment)} 
                      className="btn btn-primary btn-sm"
                    >
                      Submit Review
                    </button>
                  </div>
                )}

                {task.status === 'completed' && user.role === 'worker' && (
                  <div>
                    <p style={{color: '#10b981', fontWeight: 'bold'}}>
                      💰 Payout: KES {(task.price * 0.9).toFixed(2)} (after 10% commission)
                    </p>
                    {task.reviews && task.reviews.length > 0 && (
                      <div style={{marginTop: '15px', padding: '15px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0'}}>
                        <h4 style={{marginBottom: '10px', color: '#065f46'}}>Client Review</h4>
                        {task.reviews.map((review, idx) => (
                          <div key={idx}>
                            <div style={{marginBottom: '5px'}}>
                              <span style={{fontSize: '1.2rem'}}>
                                {'⭐'.repeat(review.rating)}
                              </span>
                              <span style={{color: '#6b7280', marginLeft: '8px'}}>
                                ({review.rating}/5)
                              </span>
                            </div>
                            {review.comment && (
                              <p style={{color: '#374151', fontStyle: 'italic', margin: '8px 0'}}>
                                "{review.comment}"
                              </p>
                            )}
                            <p style={{color: '#9ca3af', fontSize: '0.85rem'}}>
                              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;