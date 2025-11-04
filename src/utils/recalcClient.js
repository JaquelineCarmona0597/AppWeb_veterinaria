import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function recalcStatsFromUsuarios() {
  const col = collection(db, 'usuarios');
  const snap = await getDocs(col);
  const total = snap.size;

  const daysMap = {};
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const ts = data.fechaCreacion;
    let d;
    if (ts && ts.toDate) d = ts.toDate();
    else if (ts) d = new Date(ts);
    else d = new Date();
    const key = formatDateKey(d);
    daysMap[key] = (daysMap[key] || 0) + 1;
  });

  const batch = writeBatch(db);
  const summaryRef = doc(db, 'stats', 'summary');
  batch.set(summaryRef, { usuariosCount: total, updatedAt: serverTimestamp() }, { merge: true });

  Object.keys(daysMap).forEach(k => {
    const ref = doc(db, 'stats', 'users_by_day', k);
    batch.set(ref, { count: daysMap[k] }, { merge: true });
  });

  await batch.commit();
  return { total, days: daysMap };
}
