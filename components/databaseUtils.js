import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA-Y9IONYfFSFcElU_cAihFVgmUOAltw_E",
  authDomain: "ostoslista-firebase-c2a65.firebaseapp.com",
  databaseURL: "https://ostoslista-firebase-c2a65-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ostoslista-firebase-c2a65",
  storageBucket: "ostoslista-firebase-c2a65.appspot.com",
  messagingSenderId: "372232178586",
  appId: "1:372232178586:web:a96a69494902c02580c823",
  measurementId: "G-NGZWG22D1T"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const useSearchDatabase = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    
      try {
        const itemsRef = ref(database, 'scraped_data/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsArray = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        setItems(itemsArray);
      } else {
        setItems([]);
      }
    });
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
        setError('An error occurred while fetching data. Please try again.');
      }
    });

   

  return { items, error };
};
