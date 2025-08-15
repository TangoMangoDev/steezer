// src/components/roster/WeeklyLogsTab.tsx - Fixed
import React from 'react';
import { RosterData } from '../../types/roster';

interface WeeklyLogsTabProps {
  allWeeksData: { [week: number]: RosterData };
}

const WeeklyLogsTab: React.FC<WeeklyLogsTabProps> = ({ allWeeksData }) => {
  const weeks = Object.keys(allWeeksData).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="weekly-logs-tab">
      <h2>Weekly Performance Logs</h2>
      <div className="weeks-container">
        {weeks.map(week => {
          const weekData = allWeeksData[parseInt(week)];
          return (
            <div key={week} className="week-summary">
              <h3>Week {week}</h3>
              <div className="week-stats">
                <div>Total Players: {weekData.totalPlayers}</div>
                <div>Teams: {weekData.totalTeams}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyLogsTab;