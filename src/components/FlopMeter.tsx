import React from 'react';
import '../styles/FlopMeter.css';

export interface FlopMeterProps {
  flopRisk: number;
}

export const FlopMeter: React.FC<FlopMeterProps> = ({ flopRisk }) => {
  // Dynamic color based on risk level
  const getColor = (risk: number) => {
    if (risk < 40) return '#4caf50';      // Green - Safe
    if (risk < 60) return '#ffc107';      // Yellow - Caution
    if (risk < 75) return '#ff9800';      // Orange - High Risk
    if (risk < 90) return '#f44336';      // Red - Critical
    return '#ff1744';                     // Deep Red - CRITICAL FLOP
  };

  const getLabel = (risk: number) => {
    if (risk < 40) return 'Safe';
    if (risk < 60) return 'Caution';
    if (risk < 75) return 'High Risk';
    if (risk < 90) return 'Critical';
    return 'FLOP ZONE';
  };

  const color = getColor(flopRisk);
  const label = getLabel(flopRisk);

  return (
    <div className="flop-meter">
      <h3>⚠️ Flop Meter</h3>
      <div className="flop-bar">
        <div 
          className="flop-fill" 
          style={{ 
            width: `${flopRisk}%`, 
            backgroundColor: color 
          }} 
        />
      </div>
      <div className="flop-info">
        <div className="flop-value">{flopRisk.toFixed(1)}%</div>
        <div className="flop-label" style={{ color }}>{label}</div>
      </div>
    </div>
  );
};
