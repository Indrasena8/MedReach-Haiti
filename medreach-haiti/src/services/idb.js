await db.collection("patients").add({
  ...data,
  doctorId: auth.currentUser.uid
});