    import React from 'react';
    import { Typography, Box } from '@mui/material';

    // Este es un componente "puro" que solo muestra el texto.
    // No tiene lógica, solo se encarga de la presentación.
    export default function TermsAndConditions() {
    return (
        // Usamos un Fragment (<>) para no añadir un div innecesario.
        <>
        <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
            Fecha de última actualización: 19 de septiembre de 2025
        </Typography>
        <Typography variant="body2" gutterBottom>
            Bienvenido a Patita Feliz desarrollada por Equipo 4. Estos Términos y Condiciones de Servicio y nuestra Política de Privacidad rigen el uso de nuestra Plataforma. Al crear una cuenta o utilizar nuestro Servicio, usted (en adelante, "el Usuario") acepta y se compromete a cumplir con los presentes términos en su totalidad. Si no está de acuerdo con alguno de estos puntos, no deberá utilizar el Servicio.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Sección I: Términos y Condiciones de Servicio
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            1. Aceptación de los Términos
        </Typography>
        <Typography variant="body2" gutterBottom>
            El uso de la Plataforma Patita Feliz está condicionado a la aceptación sin modificaciones de todos los términos, condiciones y avisos aquí contenidos. El acto de registrarse y marcar la casilla de aceptación constituye un acuerdo legalmente vinculante entre el Usuario y la Plataforma.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            2. Descripción del Servicio
        </Typography>
        <Typography variant="body2" gutterBottom>
            Patita Feliz es una plataforma integral diseñada para modernizar la gestión de clínicas veterinarias. Ofrece una aplicación móvil para que los dueños de mascotas puedan agendar citas, consultar historiales clínicos y recibir recordatorios importantes. A su vez, provee un sistema de administración web para que el personal de la clínica centralice expedientes, gestione la agenda y optimice sus operaciones.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            3. Cuentas de Usuario
        </Typography>
        <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <Typography component="li" variant="body2">
            <strong>Registro:</strong> Para utilizar el Servicio, el Usuario debe registrarse proporcionando información veraz, precisa y actualizada, incluyendo nombre completo y correo electrónico.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Responsabilidad:</strong> El Usuario es el único responsable de mantener la confidencialidad de su contraseña y de toda la actividad que ocurra en su cuenta. Deberá notificar inmediatamente a Patita Feliz sobre cualquier uso no autorizado de su cuenta.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Edad:</strong> El Usuario debe tener la edad legal para celebrar un contrato vinculante en su jurisdicción.
            </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            4. Uso Aceptable de la Plataforma
        </Typography>
        <Typography variant="body2" gutterBottom>
            El Usuario se compromete a no utilizar el Servicio para ningún fin que sea ilegal o esté prohibido por estos términos. El Usuario no deberá:
        </Typography>
        <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <Typography component="li" variant="body2">
            Cargar o transmitir contenido ofensivo, fraudulento, o que infrinja los derechos de terceros.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            Intentar obtener acceso no autorizado a los sistemas o redes de la Plataforma.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            Utilizar el Servicio de manera que pueda dañar, deshabilitar o sobrecargar nuestros servidores.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            Realizar ingeniería inversa, descompilar o desensamblar cualquier parte del software de la Plataforma.
            </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            5. Propiedad Intelectual
        </Typography>
        <Typography variant="body2" gutterBottom>
            Todo el software, código, diseño, logotipos, y el nombre "Patita Feliz" son propiedad exclusiva de sus desarrolladores (Equipo 4). Por otro lado, todo el contenido que el Usuario cargue en su cuenta (datos de la mascota, fotos, documentos) sigue siendo de su propiedad. Sin embargo, al cargarlo, el Usuario otorga a Patita Feliz una licencia mundial y libre de regalías para almacenar, mostrar y gestionar dicho contenido con el único fin de prestar el Servicio.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            6. Terminación de la Cuenta
        </Typography>
        <Typography variant="body2" gutterBottom>
            El Usuario puede terminar su cuenta en cualquier momento a través de la sección de configuración de la aplicación. Patita Feliz se reserva el derecho de suspender o terminar una cuenta si se determina que el Usuario ha violado gravemente estos Términos de Servicio.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            7. Limitación de Responsabilidad
        </Typography>
        <Typography variant="body2" gutterBottom>
            El Servicio se proporciona "tal cual". Patita Feliz no garantiza que el servicio sea ininterrumpido o libre de errores. La información clínica registrada en la plataforma es responsabilidad del personal veterinario y del usuario que la proporciona. Patita Feliz actúa como un intermediario tecnológico y no se hace responsable de diagnósticos, tratamientos o decisiones médicas.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            8. Modificaciones a los Términos
        </Typography>
        <Typography variant="body2" gutterBottom>
            Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Notificaremos a los Usuarios sobre cambios significativos a través de un aviso en la aplicación o por correo electrónico. El uso continuado del Servicio después de dichos cambios constituirá la aceptación de los nuevos términos.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Sección II: Política de Privacidad y Uso de Datos
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            9. Nuestro Compromiso con su Privacidad
        </Typography>
        <Typography variant="body2" gutterBottom>
            En Patita Feliz, la privacidad y seguridad de sus datos son nuestra máxima prioridad. Esta política describe qué información recopilamos, por qué lo hacemos y cómo puede usted gestionar y controlar su información.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            10. Información que Recopilamos
        </Typography>
        <Typography variant="body2" gutterBottom>
            Recopilamos la información necesaria para ofrecer y mejorar nuestro Servicio:
        </Typography>
        <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <Typography component="li" variant="body2">
            <strong>Datos del Dueño de la Mascota:</strong> Nombre completo, correo electrónico, contraseña cifrada y número de teléfono.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Datos de la Mascota:</strong> Nombre, especie, raza, fecha de nacimiento, sexo, señas particulares y fotografías (opcional).
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Información Clínica (Datos Sensibles):</strong> Historial de consultas, diagnósticos, tratamientos, resultados de laboratorio y calendarios de vacunación/desparasitación.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Datos de Interacción:</strong> Citas agendadas (fecha, hora, estado) y notificaciones recibidas.
            </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            11. Finalidad del Uso de la Información
        </Typography>
        <Typography variant="body2" gutterBottom>
            Utilizamos su información exclusivamente para los siguientes propósitos:
        </Typography>
        <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <Typography component="li" variant="body2">
            <strong>Para operar el Servicio:</strong> Crear y gestionar su cuenta, identificar a su mascota en la clínica y permitir la funcionalidad principal de la app, como agendar citas.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Para comunicarnos con usted:</strong> Enviar recordatorios de citas, avisos de vacunación, confirmaciones y otra información relevante para el cuidado de su mascota.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Para proveer un cuidado de salud de calidad:</strong> Permitir que el personal veterinario tenga acceso a un historial clínico unificado para tomar decisiones informadas y precisas.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Para mejorar la Plataforma:</strong> Analizar datos de uso de forma anónima para entender qué funciones son más útiles y detectar errores.
            </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            12. Con Quién Compartimos su Información
        </Typography>
        <Typography variant="body2" gutterBottom>
            No vendemos ni alquilamos su información personal. Solo compartimos datos con terceros proveedores de servicios tecnológicos que son esenciales para nuestro funcionamiento, bajo estrictos acuerdos de confidencialidad:
        </Typography>
        <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <Typography component="li" variant="body2">
            <strong>Proveedores de Infraestructura en la Nube (Ej. Firebase, AWS):</strong> Para alojar de forma segura nuestra base de datos y servidores.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Servicios de Notificaciones Push (Ej. Firebase Cloud Messaging):</strong> Para enviar los recordatorios a su dispositivo móvil.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Herramientas de Analítica (Ej. Google Analytics):</strong> Para el análisis de uso agregado y anónimo de la aplicación.
            </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            13. Seguridad de sus Datos
        </Typography>
        <Typography variant="body2" gutterBottom>
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
        </Typography>
        <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <Typography component="li" variant="body2">
            <strong>Cifrado en Tránsito:</strong> Toda la comunicación entre la app, el sistema web y nuestros servidores utiliza el protocolo seguro HTTPS.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Cifrado en Reposo:</strong> Sus contraseñas se almacenan de forma irreversible utilizando algoritmos de hashing modernos.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Control de Acceso:</strong> El acceso a la información en el sistema web está restringido por roles (Administrador, Veterinario), asegurando que cada persona solo vea lo que necesita para su trabajo.
            </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            14. Sus Derechos de Privacidad (Derechos ARCO)
        </Typography>
        <Typography variant="body2" gutterBottom>
            Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México, usted tiene derecho a:
        </Typography>
        <Box component="ul" sx={{ pl: 2, my: 1 }}>
            <Typography component="li" variant="body2">
            <strong>Acceso:</strong> Solicitar una copia de los datos que tenemos sobre usted.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Rectificación:</strong> Corregir datos inexactos o incompletos. Puede editar la mayoría de sus datos directamente en el perfil de la app.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Cancelación:</strong> Solicitar la eliminación de su cuenta y todos sus datos asociados. Esto se puede realizar desde la sección "Ajustes Mi Cuenta" en la aplicación.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mt: 1 }}>
            <strong>Oposición:</strong> Oponerse al uso de sus datos para fines específicos.
            </Typography>
        </Box>
        <Typography variant="body2" gutterBottom>
            Para ejercer cualquiera de estos derechos, puede utilizar las herramientas de la aplicación o contactarnos directamente.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            15. Consentimiento
        </Typography>
        <Typography variant="body2" gutterBottom>
            Al registrarse, usted otorga su consentimiento explícito para que recopilemos y procesemos su información como se describe en esta Política de Privacidad, marcando la casilla de aceptación correspondiente.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            16. Cambios a esta Política de Privacidad
        </Typography>
        <Typography variant="body2" gutterBottom>
            Podemos actualizar esta política ocasionalmente. Le notificaremos sobre cambios sustanciales publicando un aviso visible en nuestra aplicación o enviando una notificación.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Sección III: Contacto
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            17. Dudas y Contacto
        </Typography>
        <Typography variant="body2" gutterBottom>
            Si tiene alguna pregunta sobre estos Términos y Condiciones o sobre nuestra Política de Privacidad, no dude en contactarnos en <strong>contacto.patitafeliz@gmail.com</strong>.
        </Typography>
        </>
    );
    }