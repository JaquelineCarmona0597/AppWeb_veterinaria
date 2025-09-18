import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

// Recibimos la función 'onNavigateToLogin' para poder volver al login
export default function SignUp({ onNavigateToLogin }) {

  // Esta función solo mostrará los datos en la consola por ahora
    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
        email: data.get('email'),
        password: data.get('password'),
    });
    alert('Formulario enviado (revisa la consola para ver los datos)');
    };

    return (
    <>
        <CssBaseline />
        <Stack
        direction="column"
        justifyContent="center"
        sx={{ height: '100vh', padding: 2 }}
        >
        <Card
            variant="outlined"
            sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            padding: 4,
            gap: 2,
            maxWidth: '450px',
            boxShadow: 'md',
            }}
        >
            <Typography component="h1" variant="h4">
            Crea tu Cuenta
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
                required
                id="email"
                placeholder="tu@email.com"
                name="email"
                autoComplete="email"
            />
            </FormControl>
            <FormControl fullWidth>
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <TextField
                required
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
            />
            </FormControl>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                Registrarme
            </Button>

            <Typography sx={{ textAlign: 'center', mt: 2 }}>
                ¿Ya tienes una cuenta?{' '}
            <Button variant="text" size="small" onClick={onNavigateToLogin}>
                Inicia Sesión
            </Button>
            </Typography>
        </Box>
        </Card>
    </Stack>
    </>
);
}