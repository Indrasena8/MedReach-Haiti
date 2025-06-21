# MedReach Haiti 🇭🇹
> Offline-first Electronic Health Record (EHR) app built for Haiti's healthcare challenges.

## 🌍 Problem
Haitians in rural areas lack access to consistent internet and proper health records, leading to misdiagnoses and poor treatment outcomes.

## 💡 Solution
MedReach Haiti stores patient visit history **offline** and syncs it to the cloud **when internet is available**, ensuring no medical history is lost.

## ⚙️ Features
- Offline-first patient record creation
- Sync engine with network detection
- Doctor search by ID or name
- Visit history + medication logs
- Firebase or Node backend

## 🛠 Tech Stack
- Frontend: React.js / React Native
- Offline: IndexedDB (via idb)
- Backend: Firebase Firestore / Node.js + MongoDB
- Sync Logic: Service Workers / Background Sync

## 🚀 How to Run
```bash
npm install
npm start