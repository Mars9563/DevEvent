export const revalidate = 60; // optional: ISR revalidate seconds

import React from 'react';
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {IEvent} from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  let events: IEvent[] = [];

  try {
    // You may add a timeout or set next options for ISR
    const res = await fetch(`${BASE_URL}/api/events`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();
    events = data.events ?? [];
  } catch (err) {
    console.warn('events fetch failed — using fallback:', err);
    // optionally load local fallback JSON (from /public) or cached data:
    // const fallback = await import('@/data/events-fallback.json');
    // events = fallback.default;
    events = []; // safe empty fallback
  }

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        {events.length === 0 ? (
          <p className="text-muted">No events available right now. Check back soon.</p>
        ) : (
          <ul className="events decoration-0">
            {events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Page;
