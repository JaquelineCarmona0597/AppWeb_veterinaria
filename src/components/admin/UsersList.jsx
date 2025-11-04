import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Box, Typography, Button, TextField, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

export default function UsersList({ pageSize = 20 }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [search, setSearch] = useState('');

  const loadPage = async (next = false) => {
    setLoading(true);
    try {
      const base = collection(db, 'usuarios');
      let q = query(base, orderBy('fechaCreacion', 'desc'), limit(pageSize));
      if (next && lastDoc) q = query(base, orderBy('fechaCreacion', 'desc'), startAfter(lastDoc), limit(pageSize));
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(docs);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
    } catch (e) {
      console.error('Error cargando usuarios', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = users.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (u.nombre || '').toLowerCase().includes(s) || (u.correo || '').toLowerCase().includes(s);
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Buscar por nombre o correo" value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => loadPage(false)}>Recargar</Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <>
          <Typography variant="h6">Usuarios en esta página: {filtered.length}</Typography>
          <List>
            {filtered.map(u => (
              <ListItem key={u.id} divider>
                <ListItemText primary={u.nombre || u.correo} secondary={`${u.correo || ''} ${u.rol ? '— ' + u.rol : ''}`} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={() => loadPage(false)}>Anterior</Button>
            <Button variant="outlined" onClick={() => loadPage(true)}>Siguiente</Button>
          </Box>
        </>
      )}
    </Box>
  );
}
