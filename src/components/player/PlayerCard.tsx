import React from 'react';
import { Player } from '../types/player';
import { formatFantasyPoints, formatRank, getPositionColor } from '@utils/formatting';
import { STATS_CONFIG } from '@utils/constants';
import './PlayerCard.css';

interface PlayerCardProps {
  player: Player;
  onClick: (player: Player) => void;
  showFantasyPoints?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  onClick,
  showFantasyPoints = true 
}) => {
  const keyStats = STATS_CONFIG.getKeyStatsForPosition(player.position);

  return (
    <div 
      className="player-card fade-in"
      onClick={() => onClick(player)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(player);
        }
      }}
    >
      <div className="player-header">
        <img 
          src={player.photoUrl || '/default-player.jpg'} 
          alt={player.name}
          className="player-photo"
          loading="lazy"
        />
        <div className="player-info">
          <h3 className="player-name">{player.name}</h3>
          <div className="player-meta">
            <span 
              className="position-tag"
              style={{ backgroundColor: getPositionColor(player.position) }}
            >
              {player.position}
            </span>
            <span className="team-tag">{player.team}</span>
            {player.isInjured && (
              <span className="injury-indicator" title={player.status}>
                🚑
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="player-stats">
        {showFantasyPoints && (
          <div className="stat-item">
            <div className="stat-value fantasy-points">
              {formatFantasyPoints(player.fantasyPoints)}
            </div>
            <div className="stat-label">Fantasy Pts</div>
          </div>
        )}
        <div className="stat-item">
          <div className="stat-value">
            {formatRank(player.overallRank)}
          </div>
          <div className="stat-label">Overall</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {formatRank(player.positionRank)}
          </div>
          <div className="stat-label">{player.position}</div>
        </div>
      </div>

      {keyStats.length > 0 && (
        <div className="player-key-stats">
          {keyStats.slice(0, 3).map(statName => {
            const value = player.stats[statName];
            if (!value) return null;
            return (
              <div key={statName} className="key-stat">
                <span className="key-stat-value">{value}</span>
                <span className="key-stat-label">{statName}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;