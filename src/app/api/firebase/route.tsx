import db from '@/firebase';
import {
  collection,
  getDocs,
  // query,
  // where,
  // addDoc,
  // writeBatch,
  // doc,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // const query = collection(db, 'surfSpots');
    // const querySnapshot = await getDocs(query);
    // const docs = querySnapshot.docs.map(doc => doc.data());
    // console.log(docs);

    const ref = collection(db, 'surfSpots');
    // const q = query(ref, where('name', '!=', 'jialeshuei'));
    const querySnapshot = await getDocs(ref);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    // console.log(docs);

    return NextResponse.json(docs);
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}

export async function POST() {
  try {
    

    // const batch = writeBatch(db);
    // const docs = [
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Baishawan' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Shalun' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Jin Shan' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Green Bay' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Fulong' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Pa-li Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Chu-wei Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Kuan-yin Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Nan-liao Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Qiding Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Tongxiao Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Hualien' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Gongs' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Jigi Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Jici Beach' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Fongbin' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Bashien Dong' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Cheng Gong' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Taitung' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'PD SPOT(Windmill)' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'West Bay' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Dabaisha' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Xiaomeijun' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Sanshuei' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Cijin Island' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Nanwan' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Jialeshuei' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Donghe Rivermouth' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Jinzun Harbor' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Chunan' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Taoyuan Beachbreak' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Dashi' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Wai Ao' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Wushi' },
    //     { bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['初階'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: '西南',
    //     bestSeason: '7~9月',
    //     boardTypes: ['魚板'],
    //     name: 'Toucheng' },
    //    // Add more documents here
    // ];

    

    // docs.forEach((i) => {
    //   let docRef = doc(collection(db, 'surfSpots'),i.name);
    //   batch.set(docRef, i);
    // });
    // // Commit the batch
    // await batch.commit();

    //單一浪點新增方法
    // let docRef = await addDoc(collection(db, "surfSpots"), {
    // bottom: 'reef',
    // popularity: 0,
    // difficulty: ['進階'],
    // category: ['beach break'],
    // surfWay: 'left&right',
    // direction: '北',
    // name: 'Jin Shan',
    // bestSeason: '12~1月',
    // boardTypes: ['魚板']
    // });

    return NextResponse.json(200);
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}
