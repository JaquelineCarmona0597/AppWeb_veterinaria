import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import UsersList from './UsersList';
import UsersStats from './UsersStats';
import RecalcButton from './RecalcButton';

export default function AdminUsersPage() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Gestión de Usuarios</Typography>
      <Box sx={{ mb: 2 }}>
        <RecalcButton />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <UsersStats days={30} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <UsersList pageSize={20} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
