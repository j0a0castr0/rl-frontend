import React, { useEffect, useState } from 'react';
import { apiRequest, registerAuthTokenGetter } from '../api/api';
import { useAuth } from '../auth/AuthContext';
import NavBar from '../components/NavBar';
import '../index.css';

interface Visit {
  id: string;
  listingId: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string | null;
  visitStartTime: string;
  visitEndTime: string;
  listingReference?: string;
}

type VisitGroup = 'Today' | 'Tomorrow' | 'Next Week' | 'Next Month' | 'Past';

const VisitsPage: React.FC = () => {
  const { accessToken, idToken, logout  } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    registerAuthTokenGetter(() => ({ accessToken, idToken }));
  }, [accessToken, idToken]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
        setError('');
        const data: Visit[] = await apiRequest('/visit');

        // Sort by visitStartTime ascending
        const sorted = data.sort(
          (a, b) =>
            new Date(a.visitStartTime).getTime() - new Date(b.visitStartTime).getTime()
        );
        setVisits(sorted);
      } catch (err: any) {
        setError(err.message || 'Error fetching visits');
      } finally {
        setLoading(false);
      }
    };

    if (idToken) fetchVisits();
  }, [idToken]);

  // Group visits by timeframe
  const groupVisits = (visitList: Visit[]) => {
    const now = new Date();
    const groups: Record<VisitGroup, Visit[]> = {
      Today: [],
      Tomorrow: [],
      'Next Week': [],
      'Next Month': [],
      Past: [],
    };

    visitList.forEach(visit => {
      const start = new Date(visit.visitStartTime);
      const diffDays = Math.floor(
        (start.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 0) groups.Past.push(visit);
      else if (diffDays === 0) groups.Today.push(visit);
      else if (diffDays === 1) groups.Tomorrow.push(visit);
      else if (diffDays <= 7) groups['Next Week'].push(visit);
      else groups['Next Month'].push(visit);
    });

    return groups;
  };

  const getBadgeColor = (group: VisitGroup) => {
    switch (group) {
      case 'Today':
        return { bg: '#D1FAE5', color: '#065F46' };
      case 'Tomorrow':
        return { bg: '#E0E7FF', color: '#3730A3' };
      case 'Next Week':
        return { bg: '#EDE9FE', color: '#5B21B6' };
      case 'Next Month':
        return { bg: '#FCE7F3', color: '#9D174D' };
      case 'Past':
        return { bg: '#E5E7EB', color: '#374151' };
      default:
        return { bg: '#E5E7EB', color: '#374151' };
    }
  };

  const grouped = groupVisits(visits);

  return (
    <div>
      <NavBar />
      <div className="container">

        {loading && <p>Loading visits...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !visits.length && <p>No visits scheduled yet.</p>}

        {(['Today', 'Tomorrow', 'Next Week', 'Next Month', 'Past'] as VisitGroup[]).map(
          group => {
            const groupVisits = grouped[group];
            if (!groupVisits.length) return null;

            const badgeColor = getBadgeColor(group);

            return (
              <div key={group}>
                <h2
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    marginBottom: '12px',
                    color: badgeColor.color,
                  }}
                >
                  {group}
                </h2>

                <div className="content">
                  {groupVisits.map(visit => {
                    const start = new Date(visit.visitStartTime);
                    const end = new Date(visit.visitEndTime);

                    return (
                      <div
                        key={visit.id}
                        className={`card slide-in ${group === 'Today' ? 'visit-today' : ''}`}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            marginBottom: '20px',
                            transition: 'transform 0.2s, box-shadow 0.2s', // smooth hover
                        }}
                        >
                        {/* Property Image */}
                        <div
                          style={{
                            height: '180px',
                            width: '100%',
                            overflow: 'hidden',
                            position: 'relative',
                            borderRadius: '16px',  
                          }}
                        >
                          <img
                            src={`https://picsum.photos/800/360?random=${visit.listingId}`}
                            srcSet={`
                              https://picsum.photos/400/180?random=${visit.listingId} 400w,
                              https://picsum.photos/800/360?random=${visit.listingId} 800w,
                              https://picsum.photos/1200/540?random=${visit.listingId} 1200w
                            `}
                            sizes="(max-width: 600px) 100vw, 50vw"
                            alt="Property"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s',
                              borderRadius: '16px',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.2))',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>

                        <div style={{ padding: '16px' }}>
                          {/* Listing Reference */}
                          {visit.listingReference && (
                            <span
                              style={{
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: '#6c63ff',
                                marginBottom: '4px',
                                display: 'inline-block',
                              }}
                            >
                              {visit.listingReference}
                            </span>
                          )}

                          {/* Visitor Name */}
                          <strong
                            style={{ fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}
                          >
                            {visit.visitorName}
                          </strong>

                          {/* Visit time badge */}
                          <div
                            style={{
                              display: 'inline-block',
                              fontWeight: 600,
                              padding: '6px 12px',
                              borderRadius: '12px',
                              marginBottom: '12px',
                              fontSize: '0.875rem',
                              backgroundColor: badgeColor.bg,
                              color: badgeColor.color,
                            }}
                          >
                            {start.toLocaleDateString([], { dateStyle: 'medium' })} •{' '}
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          

                          {/* Contact info */}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              fontSize: '0.875rem',
                              color: '#555',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {/* Phone SVG */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 5a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 012 2v2a2 2 0 01-2 2h-1v2h1a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1h-2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-2"
                                />
                              </svg>
                              <span>{visit.visitorPhone || 'N/A'}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {/* Email SVG */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 8l9 6 9-6M21 8v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8"
                                />
                              </svg>
                              <span>{visit.visitorEmail}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default VisitsPage;
