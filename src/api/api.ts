// src/api/api.ts or wherever
import { Listing, Availability } from '../components/types';


export const getListings = async (): Promise<Listing[]> => {
  const res = await fetch('/api/listings');
  return res.json();
};

export const createListing = async (listing: Listing): Promise<Listing> => {
  const res = await fetch('/api/listing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing)
  });
  return res.json();
};

export const addAvailability = async (listingId: string, slot: Availability) => {
  const res = await fetch(`/api/listing/${listingId}/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slot)
  });
  return res.json();
};
