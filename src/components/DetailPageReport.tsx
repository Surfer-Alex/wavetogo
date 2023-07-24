'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore, userPrivateStore } from '@/store';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTimePicker } from '@mui/x-date-pickers';
import { db } from '@/firebase';

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import Link from 'next/link';

interface ChartProps {
  id: string;
}
interface MyDate extends Date {
  ts: number;
}
interface Report {
  conditionsTime: number;
  serverTime: Timestamp;
  content: string;
  userPhoto: string;
  uid: string;
  displayName: string;
}

function DetailPageReport({ id }: ChartProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [message, setMessage] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);
  const [dateTimeError, setDateTimeError] = useState<string>('');

  // console.log(message);

  const { spotData } = useStore();
  const getUserInfo = userPrivateStore((state) => state.userInfo);

  useEffect(() => {
    getSub();
  }, []);

  useEffect(() => {
    if (getUserInfo && (getUserInfo.uid as string).length > 0) {
      setIsLogin(true);
    }
  }, [getUserInfo]);

  const q = query(collection(db, 'surfSpots'), where('id', '==', id));

  async function addReport(e: React.FormEvent) {
    e.preventDefault();
    if (selectedDateTime === null) {
      setDateTimeError('DateTimePicker Required!');
      return;
    } else {
      setDateTimeError('');
    }

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((i) => {
      const docRef = collection(db, 'surfSpots', i.id, 'reports');
      addDoc(docRef, {
        conditionsTime: (selectedDateTime as MyDate).ts,
        serverTime: serverTimestamp(),
        content: message,
        userPhoto: getUserInfo?.photoURL,
        uid: getUserInfo?.uid,
        displayName: getUserInfo?.displayName,
      });
    });

    setSelectedDateTime(null);
    setMessage('');
    setOpen(false);
  }

  async function getSub() {
    const querySnapshot = await getDocs(q);
    const docId = querySnapshot.docs[0].id;

    const ref = collection(db, `surfSpots/${docId}/reports`);
    const sorted = query(ref, orderBy('serverTime', 'desc'));
    const unsub = onSnapshot(sorted, (doc) => {
      const list: Report[] = [];
      doc.forEach((doc) => {
        list.push(doc.data() as Report);
      });
      setReports(list);
    });
    return () => unsub();
  }

  const spotInfo = spotData.data.spots
    .map((i) => i)
    .filter((i) => i._id === id);

  if (spotInfo.length === 0) {
    return (
      <div className="w-screen h-negativeHeader flex justify-center items-center">
        <div
          className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] flex ">
      <div className="w-1/2 h-full relative">
        <Image
          priority={true}
          width={1200}
          height={600}
          quality={100}
          className="w-full h-full"
          alt="spot static map with marker"
          src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/pin-l+f44546(${spotInfo[0].lon},${spotInfo[0].lat})/${spotInfo[0].lon},${spotInfo[0].lat},15,0/1200x600?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}
        />
        <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center font-black text-6xl text-white opacity-70 ">
          {spotInfo[0].name}
        </div>
      </div>

      <div className="w-1/2 flex flex-col bg-slate-200">
        <div className="w-full flex justify-center text-2xl font-bold mt-4">
          <div className="text-4xl">
            <FlagCircleIcon fontSize="inherit" />
          </div>
          <div className="ml-1 flex items-center">WAVE REPORT</div>
        </div>
        <div className="w-full h-[280px] px-12 font-bold overflow-auto ">
          {reports && reports.length > 0 ? (
            reports.map((i, idx) => {
              return (
                <div
                  key={idx}
                  className="mt-4 flex flex-col rounded-2xl px-2 py-2 shadow-[5px_5px_0px_0px_rgba(110,116,139)] bg-white"
                >
                  <div className="flex">
                    <div className="flex items-center">
                      <Image
                        src={i.userPhoto}
                        alt={'userPhoto'}
                        width={30}
                        height={30}
                        quality={100}
                        className="rounded-full"
                      />
                      <div className="ml-2">{i.displayName}</div>
                    </div>
                    <div className="ml-auto w-5/6 text-base font-normal flex items-center">
                      {i.content}
                    </div>
                  </div>
                  <div className="ml-auto mt-1 font-normal text-slate-800">
                    Report time :{' '}
                    {new Date(i.conditionsTime).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex justify-center items-center text-2xl">
              No current reports
            </div>
          )}
        </div>
        <div className="text-2xl h-[54px] font-bold flex items-center justify-center">
          <button
            onClick={() => setOpen(true)}
            className="text-lg rounded-xl border border-gray-700 text-gray-700 px-2 py-2 opacity-60 hover:opacity-100"
          >
            Report conditions
          </button>
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 flex justify-center items-center transition-colors bg-black bg-opacity-50  z-50  ${
              open ? 'visible ' : 'invisible'
            }`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-1/3 h-2/3 bg-white  text-black relative rounded-xl`}
            >
              {isLogin ? (
                <div className="h-full">
                  <div className="text-2xl text-center mt-3">
                    WAVE CONDITIONS REPORT
                  </div>

                  <div className=" mt-4 px-4">
                    <form
                      onSubmit={(e) => addReport(e)}
                      className="w-full flex flex-col"
                    >
                      <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DateTimePicker
                          label="Condition Report Time"
                          // defaultValue={DateTime.local()}
                          value={selectedDateTime}
                          onChange={(newValue) => setSelectedDateTime(newValue)}
                          // maxDate={new Date('2020-08-18')}
                        />
                        <span className="text-xs text-red-700 ml-2">
                          {dateTimeError}
                        </span>

                        <label
                          htmlFor="message"
                          className="block mb-2 text-xl font-medium text-gray-900 dark:text-white mt-4"
                        >
                          Report content
                        </label>
                        <textarea
                          id="message"
                          rows={8}
                          className=" block p-2.5 w-full text-xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Write your thoughts here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        ></textarea>
                      </LocalizationProvider>
                      <div className="flex h-full items-center justify-center">
                        <button className=" w-1/3 rounded-2xl bg-black text-white px-2 py-1 mt-4">
                          submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <div className="text-2xl text-center mt-3">
                    WAVE CONDITIONS REPORT
                  </div>
                  <div className="w-full h-3/5 flex flex-col mt-4 px-4 justify-center items-center">
                    <div className="flex items-center justify-center text-lg">
                      Please log in to leave a comment.
                    </div>
                    <Link href="/member" className="text-lg mt-4 w-1/2">
                      <button className="w-full border-slate-400 border rounded-full px-3 py-3">
                        Login
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={() => setOpen(false)}
                className="absolute right-2 top-2 text-gray-400 text-3xl hover:text-black "
              >
                <CancelRoundedIcon fontSize="inherit" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPageReport;

// onChange={evt=>handleInputChange(evt)}/>
