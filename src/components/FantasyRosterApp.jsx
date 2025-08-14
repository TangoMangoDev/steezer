// src/components/FantasyRosterApp.jsx
import React, { useState, useEffect } from 'react';

const FantasyRosterApp = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [teamData, setTeamData] = useState({
    name: 'Loading...',
    record: '--',
    myScore: '--',
    oppScore: '--',
    opponentName: 'Loading...'
  });
  const [rosterPlayers, setRosterPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    column: 'points',
    direction: 'desc'
  });

  useEffect(() => {
    loadRosterData();
  }, [currentWeek]);

  const loadRosterData = async () => {
    try {
      // Load roster data using your existing API
      const data = await window.rosterAPI?.loadWeekData(currentWeek);
      if (data) {
        setTeamData(data.team);
        setRosterPlayers(data.players);
      }
    } catch (error) {
      console.error('Failed to load roster data:', error);
    }
  };

  const changeWeek = (delta) => {
    const newWeek = Math.max(1, Math.min(18, currentWeek + delta));
    setCurrentWeek(newWeek);
  };

  const openPlayerModal = (player) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  const handleSort = (column) => {
    const direction = sortConfig.column === column && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ column, direction });

    const sorted = [...rosterPlayers].sort((a, b) => {
      let aValue = a[column] || 0;
      let bValue = b[column] || 0;

      if (typeof aValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setRosterPlayers(sorted);
  };

  const filteredPlayers = rosterPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="fantasy-roster-app">
      {/* Header Section */}
      <header className="app-header">
        <div className="header-content">
          <div className="team-info">
            <h1 className="team-name">{teamData.name}</h1>
            <div className="team-record">{teamData.record}</div>
          </div>

          <div className="week-navigator">
            <button 
              className="nav-btn prev-week" 
              onClick={() => changeWeek(-1)}
              aria-label="Previous week"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <div className="current-week">Week {currentWeek}</div>
            <button 
              className="nav-btn next-week" 
              onClick={() => changeWeek(1)}
              aria-label="Next week"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>

          <div className="matchup-score">
            <div className="score-display">
              <span className="my-score">{teamData.myScore}</span>
              <span className="score-separator">vs</span>
              <span className="opp-score">{teamData.oppScore}</span>
            </div>
            <div className="opponent-name">{teamData.opponentName}</div>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="position-filter"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          <option value="all">All Positions</option>
          <option value="QB">QB</option>
          <option value="RB">RB</option>
          <option value="WR">WR</option>
                   <option value="TE">TE</option>
                   <option value="K">K</option>
                   <option value="DEF">DEF</option>
                 </select>
               </div>

               {/* Roster Display */}
               <div className="roster-container">
                 <div className="roster-table-wrapper">
                   <table className="roster-table">
                     <thead>
                       <tr>
                         <th onClick={() => handleSort('position')}>
                           Position
                           {sortConfig.column === 'position' && (
                             <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                           )}
                         </th>
                         <th onClick={() => handleSort('name')}>
                           Player
                           {sortConfig.column === 'name' && (
                             <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                           )}
                         </th>
                         <th onClick={() => handleSort('points')}>
                           Points
                           {sortConfig.column === 'points' && (
                             <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                           )}
                         </th>
                         <th onClick={() => handleSort('projected')}>
                           Projected
                           {sortConfig.column === 'projected' && (
                             <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                           )}
                         </th>
                         <th>Status</th>
                         <th>Matchup</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredPlayers.map((player, index) => (
                         <tr
                           key={`${player.playerId}-${index}`}
                           className="roster-row"
                           onClick={() => openPlayerModal(player)}
                         >
                           <td className="position-cell">
                             <span className={`position-badge ${player.position.toLowerCase()}`}>
                               {player.position}
                             </span>
                           </td>
                           <td className="player-cell">
                             <div className="player-info">
                               <div className="player-name">{player.name}</div>
                               <div className="player-team">{player.team}</div>
                             </div>
                           </td>
                           <td className="points-cell">
                             <span className="points-value">{player.points || 0}</span>
                           </td>
                           <td className="projected-cell">
                             <span className="projected-value">{player.projected || 0}</span>
                           </td>
                           <td className="status-cell">
                             <span className={`status-indicator ${player.status?.toLowerCase() || 'active'}`}>
                               {player.status || 'Active'}
                             </span>
                           </td>
                           <td className="matchup-cell">
                             <div className="matchup-info">
                               <span className="opponent">vs {player.opponent || 'BYE'}</span>
                               <span className="game-time">{player.gameTime || ''}</span>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>

               {/* Player Modal */}
               {selectedPlayer && (
                 <PlayerModal
                   player={selectedPlayer}
                   onClose={closeModal}
                 />
               )}
             </div>
           );
          };

          // Player Modal Component
          const PlayerModal = ({ player, onClose }) => {
           return (
             <div className="modal-overlay" onClick={onClose}>
               <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                 <div className="modal-header">
                   <h3>{player.name}</h3>
                   <button className="modal-close" onClick={onClose}>×</button>
                 </div>

                 <div className="modal-body">
                   <div className="player-details">
                     <div className="detail-row">
                       <span className="detail-label">Position:</span>
                       <span className="detail-value">{player.position}</span>
                     </div>
                     <div className="detail-row">
                       <span className="detail-label">Team:</span>
                       <span className="detail-value">{player.team}</span>
                     </div>
                     <div className="detail-row">
                       <span className="detail-label">Points:</span>
                       <span className="detail-value">{player.points || 0}</span>
                     </div>
                     <div className="detail-row">
                       <span className="detail-label">Projected:</span>
                       <span className="detail-value">{player.projected || 0}</span>
                     </div>
                   </div>

                   {player.stats && (
                     <div className="expanded-stats-grid">
                       {Object.entries(player.stats).map(([stat, value]) => (
                         <div key={stat} className="expanded-stat">
                           <span className="stat-label">{stat}</span>
                           <span className="stat-value">{value}</span>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             </div>
           );
          };

          export default FantasyRosterApp;