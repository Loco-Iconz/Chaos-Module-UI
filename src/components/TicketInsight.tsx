import React from 'react';
import type { ChaosTicketResponse } from '../types';
import { FlopMeter } from './FlopMeter';
import '../styles/TicketInsight.css';

export interface TicketInsightProps {
  data?: ChaosTicketResponse;
}

export const TicketInsight: React.FC<TicketInsightProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="ticket-insight empty">
        <h2>🔍 Chaos Ticket Insights</h2>
        <p>Submit a ticket to see chaos analysis</p>
      </div>
    );
  }

  const getChaosColor = (score: number) => {
    if (score >= 80) return '#ff4444';
    if (score >= 60) return '#ffaa00';
    if (score >= 40) return '#ffdd00';
    return '#44aa44';
  };

  const getCollapseColor = (risk: number) => {
    if (risk >= 75) return '#dd0000';
    if (risk >= 50) return '#ff6600';
    if (risk >= 25) return '#ffdd00';
    return '#00dd00';
  };

  return (
    <div className="ticket-insight">
      <h2>🔍 Chaos Ticket Insights</h2>

      <div className="insight-metrics">
        {/* Chaos Score */}
        <div className="insight-card">
          <h3>Chaos Score</h3>
          <div 
            className="metric-display"
            style={{ backgroundColor: getChaosColor(data.chaosScore) }}
          >
            <span className="metric-value">{data.chaosScore.toFixed(1)}</span>
            <span className="metric-label">/100</span>
          </div>
        </div>

        {/* Collapse Risk */}
        <div className="insight-card">
          <h3>Collapse Risk</h3>
          <div 
            className="metric-display"
            style={{ backgroundColor: getCollapseColor(data.collapseRisk) }}
          >
            <span className="metric-value">{data.collapseRisk.toFixed(1)}</span>
            <span className="metric-label">/100</span>
          </div>
        </div>
      </div>

      {/* Flop Meter */}
      <FlopMeter flopRisk={data.flopRisk} />

      {/* Bands */}
      <div className="bands-container">
        <div className="band-card">
          <h3>Total Band (House-Bait)</h3>
          <div className="band-values">
            <div className="band-value">
              <span className="label">Low</span>
              <span className="value">{data.totalBand.low[0].toFixed(1)}–{data.totalBand.low[1].toFixed(1)}</span>
            </div>
            <div className="band-value">
              <span className="label">Mid</span>
              <span className="value">{data.totalBand.mid[0].toFixed(1)}–{data.totalBand.mid[1].toFixed(1)}</span>
            </div>
            <div className="band-value">
              <span className="label">High</span>
              <span className="value">{data.totalBand.high[0].toFixed(1)}–{data.totalBand.high[1].toFixed(1)}</span>
            </div>
            <div className="band-value insane">
              <span className="label">Insane</span>
              <span className="value">{data.totalBand.insane[0].toFixed(1)}–{data.totalBand.insane[1].toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="band-card">
          <h3>Spread Band (House-Bait)</h3>
          <div className="band-values">
            <div className="band-value">
              <span className="label">Min</span>
              <span className="value">{data.spreadBand.min.toFixed(1)}</span>
            </div>
            <div className="band-value">
              <span className="label">Max</span>
              <span className="value">{data.spreadBand.max.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="tags-section">
        <h3>🎭 Archetypes</h3>
        <div className="tags">
          {data.tags.length > 0 ? (
            data.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))
          ) : (
            <p className="no-items">No archetypes identified</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="notes-section">
        <h3>🎯 Edge Notes & Traps</h3>
        <div className="notes">
          {data.notes.length > 0 ? (
            <ul>
              {data.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="no-items">No edge notes available</p>
          )}
        </div>
      </div>
    </div>
  );
};
