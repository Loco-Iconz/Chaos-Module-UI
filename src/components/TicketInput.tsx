import React, { useState } from 'react';
import type { ChaosTicketRequest, ChaosTicketResponse } from '../types';
import { submitChaosTicket } from '../api';
import '../styles/TicketInput.css';

export interface TicketInputProps {
  onSubmit?: (response: ChaosTicketResponse) => void;
  onError?: (error: string) => void;
}

export const TicketInput: React.FC<TicketInputProps> = ({ onSubmit, onError }) => {
  const [gameId, setGameId] = useState('');
  const [houseTotal, setHouseTotal] = useState('');
  const [houseSpread, setHouseSpread] = useState('');
  const [pickSide, setPickSide] = useState<'home' | 'away'>('home');
  const [pickType, setPickType] = useState<'spread' | 'ml' | 'total'>('spread');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!gameId || !houseTotal || !houseSpread) {
      setError('Please fill in all fields');
      onError?.('Please fill in all fields');
      return;
    }

    const ticket: ChaosTicketRequest = {
      gameId: Number(gameId),
      houseTotal: Number(houseTotal),
      houseSpread: Number(houseSpread),
      pickSide,
      pickType,
    };

    setLoading(true);
    try {
      const response = await submitChaosTicket(ticket);
      if (response.success && response.data) {
        setGameId('');
        setHouseTotal('');
        setHouseSpread('');
        setPickSide('home');
        setPickType('spread');
        setError(undefined);
        onSubmit?.(response.data);
      } else {
        const errorMsg = response.error || 'Failed to submit ticket';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-input">
      <h2>📋 House Bait Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="gameId">Game ID</label>
          <input
            id="gameId"
            type="number"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="e.g., 1"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="houseTotal">House Total (O/U)</label>
            <input
              id="houseTotal"
              type="number"
              step="0.5"
              value={houseTotal}
              onChange={(e) => setHouseTotal(e.target.value)}
              placeholder="e.g., 210.5"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="houseSpread">House Spread</label>
            <input
              id="houseSpread"
              type="number"
              step="0.5"
              value={houseSpread}
              onChange={(e) => setHouseSpread(e.target.value)}
              placeholder="e.g., 5.5"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pickSide">Pick Side</label>
            <select
              id="pickSide"
              value={pickSide}
              onChange={(e) => setPickSide(e.target.value as 'home' | 'away')}
              disabled={loading}
            >
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pickType">Pick Type</label>
            <select
              id="pickType"
              value={pickType}
              onChange={(e) => setPickType(e.target.value as 'spread' | 'ml' | 'total')}
              disabled={loading}
            >
              <option value="spread">Spread</option>
              <option value="ml">Moneyline</option>
              <option value="total">Total</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Computing...' : 'Compute Chaos'}
        </button>
      </form>
    </div>
  );
};
