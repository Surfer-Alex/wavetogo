import {db} from '@/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  // addDoc,
  // writeBatch,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    const docSnap = await getDoc(doc(db, `users/${uid}`));
    if(docSnap.exists()) {
    return NextResponse.json(docSnap.data());
    }
      
    
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}

export async function POST(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const uid = searchParams.get('uid');
      const id = searchParams.get('id');
      const docRef = doc(db, `users/${uid}`);
      await updateDoc(docRef, {
        favorites: arrayUnion(id),
      });
     
      return NextResponse.json('add completed');
    } catch (error) {
      return new NextResponse(error as undefined);
    }
  }

  export async function DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const uid = searchParams.get('uid');
      const id = searchParams.get('id');
      const docRef = doc(db, `users/${uid}`);
      await updateDoc(docRef, {
        favorites: arrayRemove(id),
      });
     
      return NextResponse.json('delete completed');
    } catch (error) {
      return new NextResponse(error as undefined);
    }
  }