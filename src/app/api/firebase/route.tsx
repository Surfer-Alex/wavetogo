import { db } from '@/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const ref = collection(db, 'surfSpots');
    if (id) {
      const q = query(ref, where('id', '==', id));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data());

      return NextResponse.json(docs);
    } else {
      const querySnapshot = await getDocs(ref);
      const docs = querySnapshot.docs.map((doc) => doc.data());
      // console.log(docs);
      return NextResponse.json(docs);
    }
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}

export async function POST() {
  try {
    // const response = await fetch(
    //   'https://services.surfline.com/kbyg/mapview?south=21.755561&west=119.438618&north=25.365470&east=122.025492',
    //   { cache: 'no-store' }
    // );
    // const data = await response.json();
    // const spotData = data.data.spots;
    // const ref = collection(db, 'surfSpots');
    // const querySnapshot = await getDocs(ref);
    // const fireSpotInfo = querySnapshot.docs.map((doc) => doc.data());

    // const newSpotInfo= fireSpotInfo.map(
    //   (item2)=>{
    //     const item1 = spotData.find(item=>item.name === item2.name)
    //     return {...item2,id:item1._id}
    //   }
    // );
    // const batch = writeBatch(db);
    // docs.forEach((i) => {
    //   let docRef = doc(collection(db, 'surfSpots'),i.name);
    //   batch.set(docRef, i);
    // });
    // // Commit the batch
    // await batch.commit();

    // const batch = writeBatch(db);
    // const docs = [
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Baishawan',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Shalun',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Jin Shan',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Green Bay',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Fulong',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Pa-li Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Chu-wei Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Kuan-yin Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Nan-liao Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Qiding Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Tongxiao Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Hualien',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Gongs',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Jigi Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Jici Beach',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Fongbin',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Bashien Dong',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Cheng Gong',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Taitung',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'PD SPOT(Windmill)',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'West Bay',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Dabaisha',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Xiaomeijun',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Sanshuei',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Cijin Island',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Nanwan',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Jialeshuei',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Donghe Rivermouth',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Jinzun Harbor',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Chunan',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Taoyuan Beachbreak',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Dashi',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Wai Ao',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Wushi',
    //   },
    //   {
    //     bottom: 'sand',
    //     popularity: 0,
    //     difficulty: ['Beginner'],
    //     category: ['beach break'],
    //     surfWay: 'left&right',
    //     direction: 'South',
    //     bestSeason: 'March-October',
    //     boardTypes: ['ShortBoard'],
    //     name: 'Toucheng',
    //   },
    //   // Add more documents here
    // ];

    // const newSpotInfo = docs.map((item2) => {
    //   const item1 = spotData.find((item) => item.name === item2.name);
    //   return { ...item2, id: item1._id };
    // });

    // newSpotInfo.forEach((i) => {
    //   const docRef = doc(collection(db, 'surfSpots'), i.name);
    //   batch.set(docRef, i);
    // });
    // // Commit the batch
    // await batch.commit();

    // 單一浪點新增方法
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
