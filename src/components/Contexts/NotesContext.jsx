import React, { createContext, useState, useRef } from 'react';
import api from '../../api/axios';
import { Logout } from '../../utils/authUtils';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [dashboardNotes, setDashboardNotes] = useState([]);
  const [feedNotes, setFeedNotes] = useState([]);
  const [oldFeedNotes, setOldFeedNotes] = useState([]);
  const dashboardCallMade = useRef(false);
  const feedCallMade = useRef(false);
  const oldFeedCallMade = useRef(false);

  const handleApiResponse = (response) => {
    if (response.status === 401) {
      Logout();
      return [];
    }
    if (response.status === 201 || !response.data || !response.data.notes) {
      return [];
    }
    return response.data.notes;
  };

  const fetchNotes = async (url, setState, callMadeRef) => {
    if (callMadeRef.current) {
      return setState;
    }

    try {
      const response = await api.post(url, {
        message: 'feed me'
      }, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: (status) => status < 500 // handle all statuses except 500 and above
      });
      const notesData = handleApiResponse(response);
      setState(notesData);
      callMadeRef.current = true;
      return notesData;
    } catch (error) {
      setState([]);
      callMadeRef.current = true;
      return [];
    }
  };

  const getDashboardNotes = async () => {
    if (dashboardNotes.length > 0 || dashboardCallMade.current) {
      return dashboardNotes;
    }
    return await fetchNotes('/api/user/mynotes', setDashboardNotes, dashboardCallMade);
  };

  const getFeedNotes = async () => {
    if (feedNotes.length > 0 || feedCallMade.current) {
      return feedNotes;
    }
    return await fetchNotes('/api/user/userfeed', setFeedNotes, feedCallMade);
  };

  const getOldFeedNotes = async () => {
    if (oldFeedNotes.length > 0 || oldFeedCallMade.current) {
      return oldFeedNotes;
    }
    return await fetchNotes('/api/user/oldfeed', setOldFeedNotes, oldFeedCallMade);
  };

  const getAllNotes = async () => {
    const allNotes = [];
    allNotes.push(...(await getDashboardNotes()));
    allNotes.push(...(await getFeedNotes()));
    allNotes.push(...(await getOldFeedNotes()));
    return removeDuplicateNotes(allNotes);
  };

  const removeDuplicateNotes = (notes) => {
    const uniqueNotes = [];
    const seen = new Set();
    for (const note of notes) {
      if (!seen.has(note.note_id)) {
        uniqueNotes.push(note);
        seen.add(note.note_id);
      }
    }
    return uniqueNotes;
  };

  const resetNotes = () => {
    setDashboardNotes([]);
    setFeedNotes([]);
    setOldFeedNotes([]);
    dashboardCallMade.current = false;
    feedCallMade.current = false;
    oldFeedCallMade.current = false;
  };

  return (
    <NotesContext.Provider value={{
      dashboardNotes, feedNotes, oldFeedNotes,
      getDashboardNotes, getFeedNotes, getOldFeedNotes, getAllNotes,
      resetNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};