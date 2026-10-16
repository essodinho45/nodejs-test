// client/src/hooks/useTickets.js
import { useState, useEffect, useRef } from 'react';

export function useTickets(filters, refreshTrigger = 0) {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use refs to track the latest AbortController for race conditions
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel previous request
    }
    
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const fetchTickets = async () => {
      setLoading(true);
      setError(null);

      // Build query string, omitting empty values
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      try {
        const res = await fetch(`http://localhost:3000/api/tickets?${params.toString()}`, { signal });
        if (!res.ok) throw new Error('Failed to fetch tickets');
        
        const json = await res.json();
        setTickets(json.data);
        setTotal(json.total);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch (Requirement 2 & useTickets skeleton requirement)
    const timeoutId = setTimeout(fetchTickets, 300);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [filters.page, filters.limit, filters.status, filters.q, refreshTrigger]); // Re-run when filters change

  // Optimistic update function
  const updateStatus = async (id, newStatus) => {
    // 1. Snapshot previous state
    const previousTickets = [...tickets];
    
    // 2. Optimistically update UI
    setTickets(current => 
      current.map(t => t.id === id ? { ...t, status: newStatus } : t)
    );

    // 3. Send request
    try {
      const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Update failed');
    } catch (err) {
      // 4. Rollback on failure
      setTickets(previousTickets);
      alert('Failed to update status. Reverting changes.');
    }
  };

  return { tickets, total, loading, error, updateStatus };
}