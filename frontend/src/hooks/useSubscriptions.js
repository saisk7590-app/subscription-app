import { useEffect, useState } from 'react';

import api from '../services/api';

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSubscriptions = async () => {
      try {
        const result = await api.getSubscriptions();

        if (active) {
          setSubscriptions(result);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSubscriptions();

    return () => {
      active = false;
    };
  }, []);

  return {
    subscriptions,
    loading,
    setSubscriptions,
  };
}
