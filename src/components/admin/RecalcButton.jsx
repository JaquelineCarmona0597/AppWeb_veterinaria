import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { recalcStatsFromUsuarios } from '../../utils/recalcClient';

export default function RecalcButton() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!userData || userData.rol !== 'admin') return null;

  const handleRecalc = async () => {
    setLoading(true);
    try {
      const res = await recalcStatsFromUsuarios();
      alert(`Recalculated: ${res.total} usuarios`);
    } catch (e) {
      console.error(e);
      alert('Error recalculando stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="contained" onClick={handleRecalc} disabled={loading}>
      {loading ? <CircularProgress size={18} /> : 'Recalcular stats'}
    </Button>
  );
}
