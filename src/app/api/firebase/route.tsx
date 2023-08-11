import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  writeBatch,
  doc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const ref = collection(db, "surfSpots");
    if (id) {
      const q = query(ref, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data());

      return NextResponse.json(docs);
    } else {
      const querySnapshot = await getDocs(ref);
      const docs = querySnapshot.docs.map((doc) => doc.data());
      return NextResponse.json(docs);
    }
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}

export async function POST() {
  try {
    return NextResponse.json(200);
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}
