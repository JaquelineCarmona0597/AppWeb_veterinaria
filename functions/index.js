// Imports v2
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onDocumentUpdated, onDocumentCreated } = require('firebase-functions/v2/firestore');

// Imports v1 (functions SDK for onCall)
const functions = require('firebase-functions');

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

admin.initializeApp();

const db = getFirestore();
const messaging = getMessaging();

// ===============================================
// FUNCIÓN 1: ENVIAR RECORDATORIOS (V2)
// ===============================================
exports.enviarRecordatoriosDeCitas = onSchedule(
  {
    region: 'northamerica-northeast1',
    schedule: 'every 60 minutes',
    timeZone: 'America/Mexico_City',
  },
  async (event) => {
    const now = admin.firestore.Timestamp.now();
    const oneHourFromNow = admin.firestore.Timestamp.fromMillis(now.toMillis() + 3600000);
    console.log('Buscando citas entre:', now.toDate(), 'y', oneHourFromNow.toDate());

    const query = db
      .collection('citas')
      .where('estado', '==', 'Programada')
      .where('fecha', '>=', now)
      .where('fecha', '<=', oneHourFromNow);

    const citasParaRecordar = await query.get();
    if (citasParaRecordar.empty) {
      console.log('No se encontraron citas para recordar.');
      return null;
    }

    const propietarioIds = [...new Set(citasParaRecordar.docs.map((doc) => doc.data().idPropietario))];
    const userRefs = propietarioIds.map((id) => db.collection('usuarios').doc(id));
    const userDocs = await db.getAll(...userRefs);
    const tokenMap = new Map();
    userDocs.forEach((doc) => {
      if (doc.exists) {
        const fcmToken = doc.data() && doc.data().fcmToken;
        if (fcmToken) {
          tokenMap.set(doc.id, fcmToken);
        }
      }
    });

    console.log(`Se encontraron ${citasParaRecordar.size} citas para ${tokenMap.size} usuarios con tokens.`);

    const promises = [];
    citasParaRecordar.forEach((doc) => {
      const cita = doc.data();
      const idPropietario = cita.idPropietario;
      const horaCita = cita.fecha.toDate().toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Mexico_City',
      });
      const mensaje = `Recordatorio: Tu cita para ${cita.nombreMascota} es hoy ${horaCita}.`;

      const notiRef = db.collection('usuarios').doc(idPropietario).collection('notificaciones').doc();
      const notificacion = {
        id: notiRef.id,
        titulo: 'Recordatorio de Cita',
        mensaje: mensaje,
        fechaMillis: Date.now(),
        tipo: 'RECORDATORIO',
        leida: false,
        idPropietario: idPropietario,
      };
      promises.push(notiRef.set(notificacion));

      const fcmToken = tokenMap.get(idPropietario);
      if (fcmToken) {
        const payload = {
          notification: {
            title: 'Recordatorio de Cita',
            body: mensaje,
          },
          token: fcmToken,
        };
        promises.push(messaging.send(payload));
      } else {
        console.log(`No se encontró fcmToken para el usuario: ${idPropietario}`);
      }
    });

    await Promise.all(promises);
    console.log(`Se procesaron ${citasParaRecordar.size} recordatorios.`);
    return null;
  }
);


// ===============================================
// FUNCIÓN 2: NOTIFICAR CAMBIO DE CITA (V2)
// ===============================================
exports.notificarCambioDeCita = onDocumentUpdated(
  {
    region: 'northamerica-northeast1',
    document: 'citas/{citaId}',
  },
  async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    if (beforeData.estado === afterData.estado) {
      console.log('El estado no cambió, no se notifica.');
      return null;
    }
    const idPropietario = afterData.idPropietario;
    const nuevoEstado = afterData.estado;
    console.log(`Estado de cita ${event.params.citaId} cambió a: ${nuevoEstado}`);
    let tituloNoti = '';
    let mensajeNoti = '';
    let tipoNoti = 'GENERAL';
    if (nuevoEstado === 'Confirmada') {
      tituloNoti = '¡Cita Confirmada!';
      mensajeNoti = `Tu cita para ${afterData.nombreMascota} ha sido confirmada.`;
      tipoNoti = 'CITA_CONFIRMADA';
    } else if (nuevoEstado === 'Rechazada' || nuevoEstado === 'Cancelada') {
      // Maneja ambos
      tituloNoti = 'Cita Rechazada/Cancelada';
      mensajeNoti = `Tu cita para ${afterData.nombreMascota} ha sido ${nuevoEstado.toLowerCase()}.`;
      tipoNoti = 'CITA_CANCELADA';
    } else {
      console.log(`Estado ${nuevoEstado} no requiere notificación.`);
      return null;
    }
    const userDoc = await db.collection('usuarios').doc(idPropietario).get();
    if (!userDoc.exists) {
      console.log(`No se encontró el usuario ${idPropietario}`);
      return null;
    }

    const fcmToken = userDoc.data() && userDoc.data().fcmToken;

    const promises = [];

    const notiRef = db.collection('usuarios').doc(idPropietario).collection('notificaciones').doc();
    const notificacion = {
      id: notiRef.id,
      titulo: tituloNoti,
      mensaje: mensajeNoti,
      fechaMillis: Date.now(),
      tipo: tipoNoti,
      leida: false,
      idPropietario: idPropietario,
    };
    promises.push(notiRef.set(notificacion));

    if (fcmToken) {
      const payload = {
        notification: {
          title: tituloNoti,
          body: mensajeNoti,
        },
        token: fcmToken,
      };
      promises.push(messaging.send(payload));
    } else {
      console.log(`No se encontró fcmToken para ${idPropietario}, solo se guardó en BD.`);
    }

    await Promise.all(promises);
    console.log(`Notificación de ${nuevoEstado} enviada a ${idPropietario}`);
    return null;
  }
);


// ===============================================
// FUNCIÓN 3: COMPLETAR INVITACIÓN (V1 callable)
// ===============================================
exports.completarInvitacion = functions.region('northamerica-northeast1').https.onCall(async (data, context) => {
  const { token, nombre, password } = data || {};

  if (!token || !nombre || !password) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan datos (token, nombre, o password).');
  }

  const invitacionRef = db.collection('invitaciones').doc(token);
  const usuarioRef = db.collection('usuarios');

  try {
    const resultado = await db.runTransaction(async (transaction) => {
      const invitacionDoc = await transaction.get(invitacionRef);
      if (!invitacionDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'El token de invitación no es válido.');
      }
      const invitacionData = invitacionDoc.data();
      if (invitacionData.estado !== 'pendiente') {
        throw new functions.https.HttpsError('already-exists', 'Esta invitación ya ha sido utilizada.');
      }

      let nuevoAuthUser;
      try {
        nuevoAuthUser = await admin.auth().createUser({
          email: invitacionData.correo,
          password: password,
          displayName: nombre,
        });
      } catch (authError) {
        if (authError.code === 'auth/email-already-exists') {
          throw new functions.https.HttpsError('already-exists', 'El correo de esta invitación ya está registrado.');
        }
        throw new functions.https.HttpsError('internal', 'Error al crear el usuario en Authentication.');
      }

      const newUserId = nuevoAuthUser.uid;
      const nuevoPerfilUsuario = {
        id: newUserId,
        nombre: nombre,
        correo: invitacionData.correo,
        rol: invitacionData.rol,
        telefono: '',
        urlFoto: '',
        fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
        fcmToken: '',
      };
      transaction.set(usuarioRef.doc(newUserId), nuevoPerfilUsuario);

      transaction.update(invitacionRef, {
        estado: 'completada',
        usadoPor: newUserId,
        fechaUso: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        uid: newUserId,
        email: invitacionData.correo,
      };
    });

    return resultado;
  } catch (error) {
    console.error('Error en transacción completarInvitacion:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Ocurrió un error al procesar el registro.', error.message);
  }
});


// ===============================================
// FUNCIÓN 4: NOTIFICAR A VETS DE NUEVA CITA (V2)
// ===============================================
exports.notificarVetNuevaCita = onDocumentCreated(
  {
    region: 'northamerica-northeast1',
    document: 'citas/{citaId}',
  },
  async (event) => {
    const cita = event.data.data();

    // 1. Solo notificar si la cita es nueva y está 'Programada'
    if (cita.estado !== 'Programada') {
      console.log(`Cita ${event.params.citaId} creada con estado ${cita.estado}, no se notifica a vets.`);
      return null;
    }
    console.log(`Nueva cita programada detectada: ${event.params.citaId}`);

    // 2. Obtener el nombre del cliente para un mensaje más claro
    let nombrePropietario = 'Un cliente';
    try {
      const userDoc = await db.collection('usuarios').doc(cita.idPropietario).get();
      if (userDoc.exists) {
        nombrePropietario = userDoc.data().nombre || nombrePropietario;
      }
    } catch (e) {
      console.warn('No se pudo obtener el nombre del propietario', e);
    }

    // 3. Definir el mensaje
    const tituloNoti = 'Nueva Solicitud de Cita';
    const mensajeNoti = `${nombrePropietario} ha solicitado una cita para ${cita.nombreMascota}.`;
    const tipoNoti = 'NUEVA_SOLICITUD';

    // 4. Buscar a TODOS los veterinarios
    const vetsQuery = db.collection('usuarios').where('rol', '==', 'vet');
    const vetDocs = await vetsQuery.get();

    if (vetDocs.empty) {
      console.log('No se encontraron veterinarios para notificar.');
      return null;
    }

    const promises = [];

    // 5. Enviar notificación (en-app y push) a CADA veterinario
    vetDocs.forEach((doc) => {
      const vet = doc.data();
      const vetId = doc.id;
      const fcmToken = vet.fcmToken;

      // A. Crear la notificación en la subcolección del VETERINARIO
      const notiRef = db.collection('usuarios').doc(vetId).collection('notificaciones').doc();
      const notificacion = {
        id: notiRef.id,
        titulo: tituloNoti,
        mensaje: mensajeNoti,
        fechaMillis: Date.now(),
        tipo: tipoNoti,
        leida: false,
        idPropietario: vetId,
      };
      promises.push(notiRef.set(notificacion));

      // B. Enviar la notificación PUSH
      if (fcmToken) {
        const payload = {
          notification: {
            title: tituloNoti,
            body: mensajeNoti,
          },
          token: fcmToken,
        };
        promises.push(messaging.send(payload));
      } else {
        console.log(`Veterinario ${vetId} no tiene fcmToken.`);
      }
    });

    await Promise.all(promises);
    console.log(`Notificaciones de nueva cita enviadas a ${vetDocs.size} veterinarios.`);
    return null;
  }
);
