import React, { useEffect, useState } from 'react';
import type { Game, ChaosTicketResponse } from './types';
import { fetchChaosGames } from './api';
import { ChaosMeter } from './components/ChaosMeter';
import { CollapseVisualizer } from './components/CollapseVisualizer';
import { GameCards } from './components/GameCards';
import { LiveFeed } from './components/LiveFeed';
import { TicketInput } from './components/TicketInput';
import { TicketInsight } from './components/TicketInsight';
import './App.css';

export const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [ticketResponse, setTicketResponse] = useState<ChaosTicketResponse>();
  const [ticketError, setTicketError] = useState<string>();

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const response = await fetchChaosGames();
        if (response.success && response.data) {
          setGames(response.data);
          setError(undefined);
        } else {
          setError(response.error || 'Failed to load games');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
    // Refresh data every 30 seconds
    const interval = setInterval(loadGames, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate average metrics
  const avgChaos = games.length > 0 
    ? games.reduce((sum, g) => sum + g.chaosScore, 0) / games.length 
    : 0;

  const avgCollapseRisk = games.length > 0 
    ? games.reduce((sum, g) => sum + g.collapseRisk, 0) / games.length 
    : 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌪️ Chaos Module Dashboard</h1>
        <p>Real-time Sports Chaos Analysis</p>
      </header>

      <main className="app-content">
        <div className="dashboard-grid">
          {/* Ticket Input Section */}
          <div className="ticket-section">
            <TicketInput 
              onSubmit={(response) => {
                setTicketResponse(response);
                setTicketError(undefined);
              }}
              onError={(error) => {
                setTicketError(error);
              }}
            />
          </div>

          {/* Ticket Insight Section */}
          <div className="insight-section">
            <TicketInsight data={ticketResponse} />
          </div>

          {/* Top metrics row */}
          <div className="metrics-row">
            <ChaosMeter chaosScore={ticketResponse?.chaosScore ?? avgChaos} />
            <CollapseVisualizer collapseRisk={ticketResponse?.collapseRisk ?? avgCollapseRisk} />
          </div>

          {/* Games section */}
          <div className="games-section">
            <GameCards games={games} loading={loading} error={error} />
          </div>

          {/* Live feed section */}
          <div className="feed-section">
            <LiveFeed />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Chaos Module UI v1.0 | Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
};
