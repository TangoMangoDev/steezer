import React, { useState, useMemo } from 'react';
import { useRosterData } from '@hooks/useRosterData';
import { useAppStore } from '@stores/appStore';
import { RosterPlayer } from '../types/roster';

import Header from '@components/layout/Header';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import WeekNavigator from '@components/roster/WeekNavigator';
import TabNavigation from '@components/common/TabNavigation';
import PositionFilter from '@components/common/PositionFilter';
import OwnedPlayersTab from '@components/roster/OwnedPlayersTab';
import AvailablePlayersTab from '@components/roster/AvailablePlayersTab';
import WeeklyLogsTab from '@components/roster/WeeklyLogsTab';
import MetricsTab from '@components/roster/MetricsTab';
import { POSITIONS } from '@utils/constants';
import './RosterPage.css';

const RosterPage: React.FC = () => {
  const { activeLeagueId } = useAppStore();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeTab, setActiveTab] = useState<'owned' | 'available' | 'weekly' | 'metrics'>('owned');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');

  const { 
    rosterData, 
    loading, 
    error,
    allWeeksData,
    loadAllWeeks
  } = useRosterData(currentWeek, activeLeagueId || undefined);

  const filteredOwnedPlayers = useMemo(() => {
    if (!rosterData?.Owned) return [];

    const allOwnedPlayers: RosterPlayer[] = Object.values(rosterData.Owned).flat();

    return positionFilter === 'ALL' 
      ? allOwnedPlayers 
      : allOwnedPlayers.filter((p: RosterPlayer) => p.position === positionFilter);
  }, [rosterData, positionFilter]);

  const filteredAvailablePlayers = useMemo(() => {
    if (!rosterData?.NotOwned) return [];

    const allAvailablePlayers: RosterPlayer[] = Object.values(rosterData.NotOwned).flat();

    return positionFilter === 'ALL'
      ? allAvailablePlayers
      : allAvailablePlayers.filter((p: RosterPlayer) => p.position === positionFilter);
  }, [rosterData, positionFilter]);

  
  React.useEffect(() => {
    if (activeTab === 'weekly' && Object.keys(allWeeksData).length === 0) {
      loadAllWeeks();
    }
  }, [activeTab, allWeeksData, loadAllWeeks]);

  if (loading && !rosterData) {
    return <LoadingSpinner fullScreen message="Loading roster data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  const tabs = [
    { id: 'owned', label: `Owned (${filteredOwnedPlayers.length})` },
    { id: 'available', label: `Available (${filteredAvailablePlayers.length})` },
    { id: 'weekly', label: 'Weekly Logs' },
    { id: 'metrics', label: 'Metrics' }
  ];

  return (
    <div className="roster-page">
      <Header />

      <div className="roster-header">
        <h1>Team Roster Management</h1>
        <WeekNavigator 
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
          maxWeek={18}
        />
      </div>

      <div className="roster-controls">
        <PositionFilter
          positions={POSITIONS}
          activePosition={positionFilter}
          onChange={setPositionFilter}
        />

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as any)}
        />
      </div>

      <div className="roster-content">
        {activeTab === 'owned' && (
          <OwnedPlayersTab 
            players={filteredOwnedPlayers}
            week={currentWeek}
          />
        )}

        {activeTab === 'available' && (
          <AvailablePlayersTab 
            players={filteredAvailablePlayers}
            week={currentWeek}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyLogsTab 
            allWeeksData={allWeeksData}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsTab 
            ownedPlayers={filteredOwnedPlayers}
            availablePlayers={filteredAvailablePlayers}
          />
        )}
      </div>
    </div>
  );
};

export default RosterPage;