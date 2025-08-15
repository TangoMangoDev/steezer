// src/components/roster/OwnedPlayersTab.tsx
import React from 'react';
import { RosterPlayer } from '../../types/roster';

interface OwnedPlayersTabProps {
  players: RosterPlayer[];
  week: number;
}

const OwnedPlayersTab: React.FC<OwnedPlayersTabProps> = ({ players, week }) => {
  return (
    <div className="owned-players-tab">
      <h2>Owned Players - Week {week}</h2>
      <div className="players-grid">
        {players.map(player => (
          <div key={player.playerId} className="player-card">
            <h3>{player.name}</h3>
            <div className="player-meta">
              <span>{player.position}</span>
              <span>{player.team}</span>
              {player.teamName && <span>({player.teamName})</span>}
            </div>
            {player.fantasyPoints && (
              <div className="fantasy-points">
                {player.fantasyPoints.toFixed(1)} pts
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnedPlayersTab;