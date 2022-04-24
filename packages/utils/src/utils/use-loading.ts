import { useState, useCallback } from 'react';

export const useLoading = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const switchLoading = useCallback(() => setLoading((prev) => !prev), []);
  return {
    setLoading,
    switch: switchLoading,
    loading,
  };
};
