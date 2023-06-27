'use client';
import React, { useEffect} from 'react';
async function setFireSpotByServer() {
  const data = await fetch('/api/firebase', { method: 'POST' });
  const formatedData = await data.json();
  console.log(formatedData);
  if (!data.ok) {
    throw new Error('Failed to fetch data');
  }
}

function Page(){
  useEffect(() => {
    setFireSpotByServer();
  }, []);
  return <div>page</div>;
}

export default Page;
