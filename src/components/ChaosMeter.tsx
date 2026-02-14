import React from 'react';

interface ChaosMeterProps {
  chaosScore: number;
}

export const ChaosMeter: React.FC<ChaosMeterProps> = ({ chaosScore }) => {
  const percentage = Math.min(Math.max(chaosScore, 0), 100);
  const getColor = (score: number) => {
    if (score < 25) return '#4caf50'; // Green
    if (score < 50) return '#ffc107'; // Yellow
    if (score < 75) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const color = getColor(chaosScore);

  return (
    <div className="chaos-meter">
      <h2>Chaos Meter</h2>
      <div className="meter-container">
        <div className="meter-bar">
          <div 
            className="meter-fill" 
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <div className="meter-value" style={{ color }}>
          {chaosScore.toFixed(1)}
        </div>
      </div>
      <div className="meter-levels">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  );
};
