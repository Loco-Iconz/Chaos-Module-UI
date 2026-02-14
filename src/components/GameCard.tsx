import React from 'react';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const chaosLevel = game.chaosScore < 40 ? 'low' : game.chaosScore < 70 ? 'medium' : 'high';
  
  return (
    <div className={`game-card chaos-${chaosLevel}`}>
      <div className="game-header">
        <div className="game-id">Game #{game.gameId}</div>
        <div className="chaos-score">
          <span className="label">Chaos:</span>
          <span className="value">{game.chaosScore.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="game-matchup">
        <div className="team home-team">
          <div className="team-name">{game.homeTeam}</div>
          <div className="score">{game.homeScore}</div>
        </div>
        
        <div className="vs">VS</div>
        
        <div className="team away-team">
          <div className="team-name">{game.awayTeam}</div>
          <div className="score">{game.awayScore}</div>
        </div>
      </div>
      
      <div className="game-metrics">
        <div className="metric">
          <span className="label">Collapse Risk:</span>
          <span className={`value ${game.collapseRisk > 40 ? 'high-risk' : 'low-risk'}`}>
            {game.collapseRisk.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
