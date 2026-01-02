const VisitCard = ({ visit }: any) => {
    const start = new Date(visit.visitStartTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const end = new Date(visit.visitEndTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    return (
      <div className="visit-card">
        <div className="visit-time">
          {start} – {end}
        </div>
  
        <div className="visit-name">{visit.visitorName}</div>
  
        <div className="visit-listing">
          {/* Home / Listing icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 22V12h6v10"
            />
          </svg>
          Listing {visit.listingId}
        </div>
  
        <div className="visit-actions">
          {/* Phone */}
          {visit.visitorPhone && (
            <a href={`tel:${visit.visitorPhone}`} aria-label="Call visitor">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
          )}
  
          {/* Email */}
          <a href={`mailto:${visit.visitorEmail}`} aria-label="Email visitor">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l9 6 9-6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  };
  
  export default VisitCard;
  