import React, { createContext, useState, useRef } from 'react';
import api from '../../api/axios';
import { Logout } from '../../utils/authUtils';

export const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pending, setPending] = useState([]);
  const friendsCallMade = useRef(false);
  const requestsCallMade = useRef(false);

  const handleApiResponse = (response) => {
    if (response.status === 401) {
      Logout();
      return [];
    }
    if (response.status === 201 || !response.data || (!response.data.friends && !response.data.requests)) {
      return [];
    }
    return response.data.friends || response.data.requests || [];
  };

  const fetchFriends = async () => {
    if (friends.length > 0 || friendsCallMade.current) {
      return friends;
    }

    try {
      const response = await api.post('/user/friends', {}, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: (status) => status < 500 // handle all statuses except 500 and above
      });
      const friendsData = handleApiResponse(response);
      setFriends(friendsData);
      friendsCallMade.current = true;
      return friendsData;
    } catch (error) {
      console.error(`Error fetching friends:`, error);
      setFriends([]);
      friendsCallMade.current = true;
      return [];
    }
  };

  const fetchRequests = async () => {
    if ((requests.length > 0 || pending.length > 0) || requestsCallMade.current) {
      return requests;
    }

    try {
      const response = await api.post('/user/requests', {}, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: (status) => status < 500 // handle all statuses except 500 and above
      });

      if (response.status === 200) {
        const requestsData = response.data.requests || [];
        const pendingData = response.data.pending || [];
        setRequests(requestsData);
        setPending(pendingData);
      } else {
        console.error('Unexpected response structure:', response);
      }

      requestsCallMade.current = true;
      return response.data.requests || [];
    } catch (error) {
      console.error(`Error fetching requests:`, error);
      setRequests([]);
      setPending([]);
      requestsCallMade.current = true;
      return [];
    }
  };

  const resetFriends = () => {
    setFriends([]);
    setRequests([]);
    setPending([]);
    friendsCallMade.current = false;
    requestsCallMade.current = false;
  };

  return (
    <FriendsContext.Provider value={{ friends, fetchFriends, requests, fetchRequests, pending, resetFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};