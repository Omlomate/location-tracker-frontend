import React, { useEffect, useState } from 'react';
import { trackLocation } from '../services/api'; // Import the trackLocation function

const Dashboard = () => {
  // Log to check what is stored in localStorage
  const storedUserId = localStorage.getItem('userId');
  console.log('Stored userId from localStorage:', storedUserId);  // Log to verify if it exists

  const [userId, setUserId] = useState(storedUserId || ''); // Fetching userId from localStorage or set it manually

  useEffect(() => {
    let intervalId = null; // Declare intervalId variable to store the ID

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('User location:', latitude, longitude);
            sendLocationToServer(latitude, longitude);
            
            // Start sending location every 4 seconds
            intervalId = setInterval(() => {
              sendLocationToServer(latitude, longitude);
            }, 4000);
          },
          (error) => {
            if (error.code === 1) {
              console.log('User denied geolocation');
              alert('Please enable location access to use the service');
            } else {
              console.log('Error getting location:', error.message);
            }
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    };

    const sendLocationToServer = async (latitude, longitude) => {
      // Log to ensure all values are being passed correctly
      console.log('Sending location with userId:', userId);
      console.log('Latitude:', latitude, 'Longitude:', longitude);

      if (!userId || !latitude || !longitude) {
        console.error('Missing userId, latitude, or longitude');
        return;
      }

      try {
        const response = await trackLocation({ userId, latitude, longitude });
        console.log('Location sent:', response.data);
      } catch (error) {
        console.log('Error sending location:', error.response?.data || error.message);
      }
    };

    // Call the function to get the user location and send it to the server
    getUserLocation();

    // Cleanup function to clear the interval when the component unmounts or re-renders
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [userId]); // Only run the effect when userId changes

  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
      {/* Add any other content for the Dashboard */}
    </div>
  );
};

export default Dashboard;
