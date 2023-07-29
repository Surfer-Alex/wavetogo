"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useStore, userPrivateStore } from "@/store";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTimePicker } from "@mui/x-date-pickers";
import { db } from "@/firebase";

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
} from "firebase/firestore";
import Link from "next/link";

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
  const [message, setMessage] = useState<string>("");
  const [reports, setReports] = useState<Report[]>([]);
  const [dateTimeError, setDateTimeError] = useState<string>("");

  // console.log(message);

  const { spotData } = useStore();
  const getUserInfo = userPrivateStore((state) => state.userInfo);

  useEffect(() => {
    getSub();
  }, []);

  useEffect(() => {
    if (getUserInfo && (getUserInfo.uid as string)?.length > 0) {
      setIsLogin(true);
    }
  }, [getUserInfo]);

  const q = query(collection(db, "surfSpots"), where("id", "==", id));

  async function addReport(e: React.FormEvent) {
    e.preventDefault();
    if (selectedDateTime === null) {
      setDateTimeError("DateTimePicker Required!");
      return;
    } else {
      setDateTimeError("");
    }

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((i) => {
      const docRef = collection(db, "surfSpots", i.id, "reports");
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
    setMessage("");
    setOpen(false);
  }

  async function getSub() {
    const querySnapshot = await getDocs(q);
    const docId = querySnapshot.docs[0].id;

    const ref = collection(db, `surfSpots/${docId}/reports`);
    const sorted = query(ref, orderBy("serverTime", "desc"));
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
      <div className="flex h-negativeHeader w-screen items-center justify-center">
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
    <div className="flex h-[400px] w-full ">
      <div className="relative h-full w-1/2">
        <Image
          priority={true}
          width={1200}
          height={600}
          quality={100}
          className="h-full w-full"
          alt="spot static map with marker"
          src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/pin-l+f44546(${spotInfo[0].lon},${spotInfo[0].lat})/${spotInfo[0].lon},${spotInfo[0].lat},15,0/1200x600?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}
        />
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-6xl font-black text-white opacity-70 ">
          {spotInfo[0].name}
        </div>
      </div>

      <div className="flex w-1/2 flex-col bg-slate-200">
        <div className="mt-4 flex w-full justify-center text-2xl font-bold">
          <div className="text-4xl">
            <FlagCircleIcon fontSize="inherit" />
          </div>
          <div className="ml-1 flex items-center">WAVE REPORT</div>
        </div>
        <div className="h-[280px] w-full overflow-auto px-12 font-bold ">
          {reports && reports.length > 0 ? (
            reports.map((i, idx) => {
              return (
                <div
                  key={idx}
                  className="mt-4 flex flex-col rounded-2xl bg-white px-2 py-2 shadow-[5px_5px_0px_0px_rgba(110,116,139)]"
                >
                  <div className="flex">
                    <div className="flex items-center">
                      <Image
                        src={i.userPhoto}
                        alt={"userPhoto"}
                        width={30}
                        height={30}
                        quality={100}
                        className="rounded-full"
                      />
                      <div className="ml-2">{i.displayName}</div>
                    </div>
                    <div className="ml-auto flex w-5/6 items-center text-base font-normal">
                      {i.content}
                    </div>
                  </div>
                  <div className="ml-auto mt-1 font-normal text-slate-800">
                    Report time :{" "}
                    {new Date(i.conditionsTime).toLocaleString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">
              No current reports
            </div>
          )}
        </div>
        <div className="flex h-[54px] items-center justify-center text-2xl font-bold">
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-gray-700 px-2 py-2 text-lg text-gray-700 opacity-60 hover:opacity-100"
          >
            Report conditions
          </button>
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  transition-colors  ${
              open ? "visible " : "invisible"
            }`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative h-2/3 w-1/3  rounded-xl bg-white text-black`}
            >
              {isLogin ? (
                <div className="h-full">
                  <div className="mt-3 text-center text-2xl">
                    WAVE CONDITIONS REPORT
                  </div>

                  <div className=" mt-4 px-4">
                    <form
                      onSubmit={(e) => addReport(e)}
                      className="flex w-full flex-col"
                    >
                      <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DateTimePicker
                          label="Condition Report Time"
                          // defaultValue={DateTime.local()}
                          value={selectedDateTime}
                          onChange={(newValue) => setSelectedDateTime(newValue)}
                          // maxDate={new Date('2020-08-18')}
                        />
                        <span className="ml-2 text-xs text-red-700">
                          {dateTimeError}
                        </span>

                        <label
                          htmlFor="message"
                          className="mb-2 mt-4 block text-xl font-medium text-gray-900 dark:text-white"
                        >
                          Report content
                        </label>
                        <textarea
                          id="message"
                          rows={8}
                          className=" block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Write your thoughts here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        ></textarea>
                      </LocalizationProvider>
                      <div className="flex h-full items-center justify-center">
                        <button className=" mt-4 w-1/3 rounded-2xl bg-black px-2 py-1 text-white">
                          submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <div className="mt-3 text-center text-2xl">
                    WAVE CONDITIONS REPORT
                  </div>
                  <div className="mt-4 flex h-3/5 w-full flex-col items-center justify-center px-4">
                    <div className="flex items-center justify-center text-lg">
                      Please log in to leave a comment.
                    </div>
                    <Link href="/member" className="mt-4 w-1/2 text-lg">
                      <button className="w-full rounded-full border border-slate-400 px-3 py-3">
                        Login
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={() => setOpen(false)}
                className="absolute right-2 top-2 text-3xl text-gray-400 hover:text-black "
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
