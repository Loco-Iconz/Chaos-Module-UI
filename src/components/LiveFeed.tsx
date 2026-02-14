import React from 'react';

interface LiveFeedEvent {
  id: string;
  league: 'ESPN' | 'NFL' | 'NBA' | 'NCAA';
  title: string;
  timestamp: string;
}

interface LiveFeedProps {
  // We'll use mock data for now since we don't have live data endpoints
}

export const LiveFeed: React.FC<LiveFeedProps> = () => {
  const mockEvents: LiveFeedEvent[] = [
    {
      id: '1',
      league: 'NFL',
      title: 'Super Bowl LX - Live Coverage',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: '2',
      league: 'NBA',
      title: 'Lakers vs Celtics - Q4 Updates',
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
    },
    {
      id: '3',
      league: 'NCAA',
      title: 'March Madness - Elite Eight Preview',
      timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
    },
    {
      id: '4',
      league: 'ESPN',
      title: 'College Football Playoff Analysis',
      timestamp: new Date(Date.now() - 900000).toLocaleTimeString(),
    },
  ];

  const getLeagueColor = (league: string) => {
    switch (league) {
      case 'NFL':
        return '#007BC7';
      case 'NBA':
        return '#1D428A';
      case 'NCAA':
        return '#942911';
      case 'ESPN':
        return '#FF6600';
      default:
        return '#999';
    }
  };

  return (
    <div className="live-feed">
      <h2>Live Sports Feed</h2>
      <div className="feed-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">NFL</button>
        <button className="filter-btn">NBA</button>
        <button className="filter-btn">NCAA</button>
        <button className="filter-btn">ESPN</button>
      </div>

      <div className="feed-events">
        {mockEvents.map((event) => (
          <div key={event.id} className="feed-event">
            <div className="event-league" style={{ backgroundColor: getLeagueColor(event.league) }}>
              {event.league}
            </div>
            <div className="event-content">
              <div className="event-title">{event.title}</div>
              <div className="event-timestamp">{event.timestamp}</div>
            </div>
            <div className="event-status">
              <span className="live-dot">●</span>
              <span>LIVE</span>
            </div>
          </div>
        ))}
      </div>

      <div className="feed-footer">
        <p>Mock data - Connect to ESPN, NFL, NBA, NCAA APIs for real-time updates</p>
      </div>
    </div>
  );
};
