'use client';
import { useStore } from '@/store';
import { useEffect } from 'react';

const DataProvider = () => {
  const getCurrentInfo = useStore((state) => state.fetch);
  useEffect(() => {
    getCurrentInfo('/api/currentAllSpot');
  }, []);
  return null;
};

export default DataProvider;
