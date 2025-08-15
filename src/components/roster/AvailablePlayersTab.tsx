// src/components/roster/AvailablePlayersTab.tsx
import React from 'react';
import { RosterPlayer } from '../../types/roster';

interface AvailablePlayersTabProps {
  players: RosterPlayer[];
  week: number;
}

const AvailablePlayersTab: React.FC<AvailablePlayersTabProps> = ({ players, week }) => {
  return (
    <div className="available-players-tab">
      <h2>Available Players - Week {week}</h2>
      <div className="players-grid">
        {players.map(player => (
          <div key={player.playerId} className="player-card">
            <h3>{player.name}</h3>
            <div className="player-meta">
              <span>{player.position}</span>
              <span>{player.team}</span>
            </div>
            {player.projection && (
              <div className="projection">
                Proj: {player.projection.toFixed(1)} pts
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailablePlayersTab;