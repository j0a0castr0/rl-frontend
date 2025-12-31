import React, { useEffect, useState } from "react";
import { getListings } from "../api/api";

function TaskList() {
  const [listings, setListings] = useState<{ propertyReference: string; agent: string }[]>([]);

  useEffect(() => {
    getListings().then(setListings);
  }, []);

  return (
    <div>
      <h2>Listings</h2>
      <ul>
        {listings.map((l, i) => (
          <li key={i}>{l.propertyReference} - {l.agent}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
