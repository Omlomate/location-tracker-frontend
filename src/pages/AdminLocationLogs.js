import React, { useEffect, useState } from 'react';
import { fetchLocationLogs } from '../services/api'; // Import the function to fetch location logs

const AdminLocationLogs = ({ userId }) => {
  const [locationLogs, setLocationLogs] = useState([]);

  useEffect(() => {
    if (userId) {
      // Use the imported fetchLocationLogs function
      fetchLocationLogs(userId)
        .then((response) => {
          setLocationLogs(response.data); // Set the fetched logs to state
        })
        .catch((error) => {
          console.error('Error fetching location logs:', error);
        });
    }
  }, [userId]);

  return (
    <div>
      <h3>Location Logs for User: {userId}</h3>
      {locationLogs.length > 0 ? (
        <ul>
          {locationLogs.map((log, index) => (
            <li key={index}>
              <p>{new Date(log.timestamp).toLocaleString()} - {log.location}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No location logs available for this user.</p>
      )}
    </div>
  );
};

export default AdminLocationLogs;
