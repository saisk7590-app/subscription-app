import { useState } from 'react';

export default function useStore() {
  const [subscriptions, setSubscriptions] = useState([]);

  return {
    subscriptions,
    setSubscriptions,
  };
}
