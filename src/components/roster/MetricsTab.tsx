// src/components/roster/MetricsTab.tsx
import React from 'react';
import { RosterPlayer } from '../../types/roster';

interface MetricsTabProps {
  ownedPlayers: RosterPlayer[];
  availablePlayers: RosterPlayer[];
}

const MetricsTab: React.FC<MetricsTabProps> = ({ ownedPlayers, availablePlayers }) => {
  const totalOwned = ownedPlayers.length;
  const totalAvailable = availablePlayers.length;
  const avgOwnedPoints = ownedPlayers.reduce((sum, p) => sum + (p.fantasyPoints || 0), 0) / totalOwned;

  return (
    <div className="metrics-tab">
      <h2>Roster Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Owned Players</h3>
          <div className="metric-value">{totalOwned}</div>
        </div>
        <div className="metric-card">
          <h3>Available Players</h3>
          <div className="metric-value">{totalAvailable}</div>
        </div>
        <div className="metric-card">
          <h3>Avg Points (Owned)</h3>
          <div className="metric-value">{avgOwnedPoints.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

export default MetricsTab;