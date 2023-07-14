'use client';
import {useEffect} from 'react';
import {db} from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection,
  getDocs,
  query,
  where,
  // addDoc,
  // writeBatch,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';

async function setFireSpotByServer() {
  const data = await fetch('/api/firebase', { method: 'POST' });
  const formatedData = await data.json();
  console.log(formatedData);
  if (!data.ok) {
    throw new Error('Failed to fetch data');
  }
}

async function addSub(){
  const q = query(collection(db, "surfSpots"), where("id", "==", '640a7555606c45a93fbd4112'));
  const querySnapshot = await getDocs(q);


querySnapshot.forEach((i) => {
  const docRef = doc(db, "surfSpots", i.id, "reports", "custom id");
setDoc(docRef, {
  field1: 'value1',
  field2: 'value2',
});
});
}

async function getSub(){
  const q = query(collection(db, "surfSpots"), where("id", "==", '640a7555606c45a93fbd4112'));
  
  const querySnapshot = await getDocs(q);
  const docId = querySnapshot.docs[0].id;
  
  
  
  const ref = collection(db, `surfSpots/${docId}/reports`);

  const unsub = onSnapshot(ref, (doc) => {
    doc.forEach(doc=>{console.log(doc.data())});
  });
}

function Page(){
  useEffect(() => {
    // setFireSpotByServer();
    // getSub();
  }, []);
  
  
  
  
  
  return (<><button onClick={setFireSpotByServer}>更新spot</button>
  <button  className='ml-4 hover:opacity-40' onClick={addSub}>加sub collection</button>
  
  </>);
}

export default Page;
