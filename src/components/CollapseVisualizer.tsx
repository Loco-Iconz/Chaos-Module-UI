import React from 'react';

interface CollapseVisualizerProps {
  collapseRisk: number;
}

export const CollapseVisualizer: React.FC<CollapseVisualizerProps> = ({ collapseRisk }) => {
  const risk = Math.min(Math.max(collapseRisk, 0), 100);
  const getRiskCategory = (r: number) => {
    if (r < 20) return 'Safe';
    if (r < 40) return 'Low Risk';
    if (r < 60) return 'Moderate Risk';
    if (r < 80) return 'High Risk';
    return 'Critical';
  };

  const getRiskColor = (r: number) => {
    if (r < 20) return '#4caf50';
    if (r < 40) return '#8bc34a';
    if (r < 60) return '#ffc107';
    if (r < 80) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="collapse-visualizer">
      <h2>Collapse Risk Analysis</h2>
      <div className="ring-container">
        <svg viewBox="0 0 200 200" className="risk-ring">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          />
          {/* Risk indicator circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke={getRiskColor(risk)}
            strokeWidth="15"
            strokeDasharray={`${(risk / 100) * 2 * Math.PI * 85} ${2 * Math.PI * 85}`}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '100px 100px',
            }}
          />
          {/* Center text */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill={getRiskColor(risk)}
          >
            {risk.toFixed(1)}%
          </text>
          <text
            x="100"
            y="120"
            textAnchor="middle"
            fontSize="14"
            fill="#999"
          >
            {getRiskCategory(risk)}
          </text>
        </svg>
      </div>
    </div>
  );
};
