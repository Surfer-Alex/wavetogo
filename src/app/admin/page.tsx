'use client';
import React from 'react';
async function setFireSpotByServer() {
  const data = await fetch('/api/firebase', { method: 'POST' });
  const formatedData = await data.json();
  console.log(formatedData);
  if (!data.ok) {
    throw new Error('Failed to fetch data');
  }
}

function Page(){
  // useEffect(() => {
  //   setFireSpotByServer();
  // }, []);
  return <button onClick={setFireSpotByServer}>更新spot</button>;
}

export default Page;
