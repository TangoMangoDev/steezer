import React, { useState, useEffect, useContext } from 'react';
import DashboardTabs from './DashboardTabs';
import UserDetailsModal from './UserDetailsModal';
import { getMoonInfo, Logout } from '../../utils/authUtils';
import { NotesContext } from '../../components/Contexts/NotesContext';

const Dashboard = () => {
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const { resetNotes } = useContext(NotesContext);

  useEffect(() => {
    const checkUserStatus = () => {
      const moon = getMoonInfo();
      if (moon === null) {
        console.log('Not Authorized');
        Logout();
      } else if (moon.user_status === 'partial') {
        setShowUserDetailsModal(true);
      } else {
        setShowUserDetailsModal(false);
      }
    };

    checkUserStatus();

  }, []);

  const closeUserDetailsModal = () => {
    setShowUserDetailsModal(false);
  };

  return (
    <>
      {showUserDetailsModal && (
        <UserDetailsModal open={showUserDetailsModal} onClose={closeUserDetailsModal} />
      )}
      {!showUserDetailsModal && <DashboardTabs />}
    </>
  );
};

export default Dashboard;