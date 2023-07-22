'use client';

import { userPrivateStore } from '@/store';
import { useRouter } from 'next/navigation';

async function setFireSpotByServer() {
  const data = await fetch('/api/firebase', { method: 'POST' });
  const formatedData = await data.json();

  if (!data.ok) {
    throw new Error('Failed to fetch data');
  }
}

function Page() {
  const router = useRouter();
  const uid = userPrivateStore((state) => state.userInfo?.uid);

  if (uid && uid !== '103297287668013279342') {
    return router.push('/');
  }

  return (
    <>
      <button onClick={setFireSpotByServer}>更新spot</button>
    </>
  );
}

export default Page;
