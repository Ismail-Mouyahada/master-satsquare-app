import { useState, useEffect } from 'react';

type UseApiHookResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (url: string, headers?: HeadersInit) => Promise<void>;
  postData: (url: string, body: any, headers?: HeadersInit) => Promise<void>;
};

export const useApiHook = <T,>(initialUrl?: string): UseApiHookResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (url: string, headers: HeadersInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (url: string, body: any, headers: HeadersInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      fetchData(initialUrl);
    }
  }, [initialUrl]);

  return { data, error, loading, fetchData, postData };
};
