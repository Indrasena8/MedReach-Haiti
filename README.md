# 🏥 MedReach - Offline-Capable Patient Health Record System

MedReach is a modern web application designed for healthcare professionals in regions with unreliable internet access. It enables doctors to manage patient records and visit histories **even when offline**, syncing seamlessly when back online.

## 🚀 Features

- 🔐 **Doctor Authentication** using Firebase Auth
- 📝 **Add / Edit Patients** with diagnosis and notes
- 📆 **Track Visit Histories** per patient
- 🌐 **Offline Support** using IndexedDB for local storage
- 🔄 **Automatic Sync** of patient and visit data to Firestore when online
- 🎯 **Deduplication** of visits using UUID-based `visitId`
- 📱 Mobile-friendly UI (no external CSS framework used)

## 🧰 Tech Stack

- **Frontend:** React.js, React Router
- **Authentication:** Firebase Authentication
- **Online Database:** Firebase Firestore
- **Offline Storage:** IndexedDB (`idb`)
- **Sync Logic:** Custom localDb.js utilities
- **Unique IDs:** `uuid` package
- **Build Tool:** Vite / Create React App (choose one)
