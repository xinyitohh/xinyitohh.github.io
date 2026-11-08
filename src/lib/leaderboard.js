// Public typing leaderboard stored in Firestore: /leaderboard/{mode}/scores/{id}
// One sub-collection per test length, so reading the top scores only needs the automatic
// single-field index on `wpm` (no composite index to create by hand).
import {
  collection, addDoc, getDocs, getCountFromServer, query, orderBy, limit, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const NAME_RE = /^[A-Za-z0-9 _.-]{1,16}$/; // mirrored in the Firestore rules
export const MAX_WPM = 300; // above this a score is not accepted
export const MIN_ACC = 70; // below this a score is not accepted

const scoresRef = (mode) => collection(db, "leaderboard", String(mode), "scores");

// Best scores first. Returns plain objects: { id, name, wpm, acc, at }
export const fetchTop = async (mode, n = 50) => {
  const snap = await getDocs(query(scoresRef(mode), orderBy("wpm", "desc"), limit(n)));
  return snap.docs.map((d) => {
    const x = d.data();
    return { id: d.id, name: x.name, wpm: x.wpm, acc: x.acc, at: x.createdAt?.toDate?.() ?? null };
  });
};

// Where a score would land: { rank, total } (rank 1 = best).
export const fetchRank = async (mode, wpm) => {
  const [ahead, total] = await Promise.all([
    getCountFromServer(query(scoresRef(mode), where("wpm", ">", wpm))),
    getCountFromServer(scoresRef(mode)),
  ]);
  return { rank: ahead.data().count + 1, total: total.data().count };
};

export const postScore = (mode, { name, wpm, acc }) =>
  addDoc(scoresRef(mode), { name, wpm, acc, createdAt: serverTimestamp() });
