import React from 'react';
import type { Game } from '../types';
import { GameCard } from './GameCard';

interface GameCardsProps {
  games: Game[];
  loading: boolean;
  error?: string;
}

export const GameCards: React.FC<GameCardsProps> = ({ games, loading, error }) => {
  if (loading) {
    return <div className="game-cards loading">Loading games...</div>;
  }

  if (error) {
    return <div className="game-cards error">Error: {error}</div>;
  }

  if (!games || games.length === 0) {
    return <div className="game-cards empty">No games available</div>;
  }

  // Calculate average chaos and collapse risk
  const avgChaos = games.reduce((sum, g) => sum + g.chaosScore, 0) / games.length;
  const avgCollapseRisk = games.reduce((sum, g) => sum + g.collapseRisk, 0) / games.length;

  return (
    <div className="game-cards-container">
      <div className="cards-header">
        <h2>Games Analysis</h2>
        <div className="summary">
          <span>Total: {games.length} games</span>
          <span>Avg Chaos: {avgChaos.toFixed(1)}</span>
          <span>Avg Risk: {avgCollapseRisk.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="game-cards">
        {games.map((game) => (
          <GameCard key={game.gameId} game={game} />
        ))}
      </div>
    </div>
  );
};
