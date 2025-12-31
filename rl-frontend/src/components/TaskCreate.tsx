import React, { useState } from "react";
import { createListing } from "../api/api";

function TaskCreate() {
  const [propertyReference, setPropertyReference] = useState("");
  const [agent, setAgent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createListing({ propertyReference, agent });
    setPropertyReference(""); setAgent("");
    alert("Listing created!");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input placeholder="Property Reference" value={propertyReference} onChange={e => setPropertyReference(e.target.value)} required />
      <input placeholder="Agent" value={agent} onChange={e => setAgent(e.target.value)} required />
      <button type="submit">Create Listing</button>
    </form>
  );
}

export default TaskCreate;
