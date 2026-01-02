import VisitCard from './VisitCard';

const VisitDayGroup = ({ day, visits }: any) => {
  return (
    <div className="visit-day-group">
      <h3 className="visit-day">{day}</h3>

      <div className="visit-list">
        {visits.map((visit: any) => (
          <VisitCard key={visit.id} visit={visit} />
        ))}
      </div>
    </div>
  );
};

export default VisitDayGroup;
