import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';

function groupByDay(users, days = 30) {
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const key = format(d, 'yyyy-MM-dd');
    map[key] = 0;
  }
  users.forEach(u => {
    const ts = u.fechaCreacion?.toDate ? u.fechaCreacion.toDate() : (u.fechaCreacion ? new Date(u.fechaCreacion) : null);
    if (!ts) return;
    const key = format(ts, 'yyyy-MM-dd');
    if (key in map) map[key]++;
  });
  return Object.keys(map).map(k => ({ date: k, count: map[k] }));
}

export default function UsersStats({ days = 30 }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const col = collection(db, 'usuarios');
        const snap = await getDocs(col);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const grouped = groupByDay(docs, days);
        if (mounted) setData(grouped);
      } catch (e) {
        console.error('Error cargando stats de usuarios', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [days]);

  if (loading) return <CircularProgress />;

  const total = data.reduce((s, item) => s + item.count, 0);

  return (
    <Box>
      <Typography variant="h6">Usuarios nuevos últimos {days} días: total en rango {total}</Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
