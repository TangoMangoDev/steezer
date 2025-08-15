// src/components/player/AnalyticsCards.tsx
import React from 'react';
import { PlayerAnalytics } from '../../types/player';
import { 
  getConsistencyDescription, 
  getConsistencyColor,
  getVolatilityDescription,
  getVolatilityColor 
} from '../../utils/formatting';

interface AnalyticsCardsProps {
  analytics: PlayerAnalytics;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ analytics }) => {
  return (
    <div className="analytics-cards">
      <div className="analytics-card">
        <h3 className="card-title">Consistency</h3>
        <div 
          className="card-value" 
          style={{ color: getConsistencyColor(analytics.consistency) }}
        >
          {analytics.consistency.toFixed(1)}%
        </div>
        <div className="card-description">
          {getConsistencyDescription(analytics.consistency)}
        </div>
      </div>

      <div className="analytics-card">
        <h3 className="card-title">Volatility</h3>
        <div 
          className="card-value"
          style={{ color: getVolatilityColor(analytics.volatility) }}
        >
          {analytics.volatility.toFixed(2)}
        </div>
        <div className="card-description">
          {getVolatilityDescription(analytics.volatility)}
        </div>
      </div>

      <div className="analytics-card">
        <h3 className="card-title">Boom Rate</h3>
        <div className="card-value">
          {analytics.boomRate.toFixed(1)}%
        </div>
        <div className="card-description">
          Games above 1.5x average
        </div>
      </div>

      <div className="analytics-card">
        <h3 className="card-title">Bust Rate</h3>
        <div className="card-value">
          {analytics.bustRate.toFixed(1)}%
        </div>
        <div className="card-description">
          Games below 0.5x average
        </div>
      </div>

      <div className="analytics-card">
        <h3 className="card-title">Average Points</h3>
        <div className="card-value">
          {analytics.averagePoints.toFixed(1)}
        </div>
        <div className="card-description">
          Per game average
        </div>
      </div>

      <div className="analytics-card">
        <h3 className="card-title">TD Dependency</h3>
        <div className="card-value">
          {analytics.tdDependency.toFixed(1)}%
        </div>
        <div className="card-description">
          Points from touchdowns
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCards;