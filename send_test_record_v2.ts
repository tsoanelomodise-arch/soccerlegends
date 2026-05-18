
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import config from './firebase-applet-config.json';

const app = initializeApp(config);
const db = getFirestore(app, (config as any).firestoreDatabaseId);

async function sendTest() {
  console.log('Sending test record to Firestore...');
  try {
    const docRef = await addDoc(collection(db, 'registrations'), {
      title: "Mr.",
      firstName: "Test",
      surname: "User",
      email: "tsoanelomodise@gmail.com",
      identification: "TEST-ID-9999",
      cellphone: "0123456789",
      doctorName: "Dr. Health",
      doctorContact: "111-111-1111",
      nextOfKin: "Emergency Contact",
      socialConsent: "Yes, I consent",
      comments: "This is a new test record created by the AI agent to verify the Firebase integration.",
      playerName: "Legend Test Jr",
      playerDob: "2015-01-01",
      playerPosition: "Forward",
      playerSkillLevel: "Intermediate",
      goals: "10",
      assists: "5",
      minutesPlayed: "500",
      createdAt: serverTimestamp()
    });
    console.log('Test record added with ID:', docRef.id);
    process.exit(0);
  } catch (err) {
    console.error('Error adding test record:', err);
    process.exit(1);
  }
}

sendTest();
