import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserLocation, fetchLoginLogs } from '../services/api'; // Update the API imports
import '../styles/AdminDashboard.css'; // Add styles for the cards and overlay

const AdminDashboard = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  // Fetch list of users on component mount
  useEffect(() => {
    fetchUsers()
      .then((response) => {
        setUsers(response.data); // Set the fetched users to state
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setShowOverlay(true); // Show overlay when user is selected
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setSelectedUserId(null);
    setUserDetails(null);
    setLoginLogs([]);
  };

  // Fetch the user details (last login and location) when a user is selected
  useEffect(() => {
    if (selectedUserId) {
      // Fetch user location details (latitude, longitude, last login)
      fetchUserLocation(selectedUserId)
        .then((response) => {
          if (response.data && response.data.latitude && response.data.longitude) {
            setUserDetails({
              lastLogin: response.data.timestamp,
              latitude: response.data.latitude,
              longitude: response.data.longitude,
            });
          } else {
            setUserDetails({
              lastLogin: 'Location not available',
              latitude: 'Location not available',
              longitude: 'Location not available',
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
          setUserDetails({
            lastLogin: 'Location not available',
            latitude: 'Location not available',
            longitude: 'Location not available',
          });
        });

      // Fetch login logs for the selected user
      fetchLoginLogs(selectedUserId)
        .then((response) => {
          setLoginLogs(response.data); // Assuming the API returns the login logs in response.data
        })
        .catch((error) => {
          console.error('Error fetching login logs:', error);
          setLoginLogs([]);
        });
    }
  }, [selectedUserId]);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* List of users displayed as cards */}
      <div className="user-cards-container">
        <h3>Registered Users</h3>
        <div className="cards-grid">
          {users.map((user) => (
            <div
              key={user._id}
              className="user-card"
              onClick={() => handleUserSelect(user._id)}
            >
              <h4>{user.name}</h4>
              <p>Email: {user.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay card for user details */}
      {showOverlay && selectedUserId && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-button" onClick={closeOverlay}>
              &times;
            </button>
            {userDetails ? (
              <div>
                <h3>Details for {selectedUserId}</h3>
                <p>Last Login: {new Date(userDetails.lastLogin).toLocaleString()}</p>
                <p>
                  Last Location: {userDetails.latitude !== 'Location not available'
                    ? `${userDetails.latitude}, ${userDetails.longitude}`
                    : 'Location not available'}
                </p>
              </div>
            ) : (
              <p>Loading...</p>
            )}

            {/* Display Login Logs */}
            {loginLogs.length > 0 ? (
              <div>
                <h4>Login Logs</h4>
                <ul>
                  {loginLogs.map((log) => (
                    <li key={log._id}>
                      <p>{new Date(log.timestamp).toLocaleString()}</p>
                      <p>{log.isSuccess ? 'Login Successful' : 'Login Failed'}</p>
                      <p>Location: {log.location}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No login logs available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
