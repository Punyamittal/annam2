## GitAds Sponsored
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=msafeerhassan/cattlefarmmanagement@github)](https://gitads.dev/v1/ad-track?source=msafeerhassan/cattlefarmmanagement@github)



# Cattle Farm Management System

A comprehensive web application for managing dairy farm operations, built with React, TypeScript, and Firebase.

## Features

- 🐄 Cattle records management
- 📊 Milk production tracking
- 🏥 Health records 
- 🔄 Breeding cycle monitoring
- 📈 Analytics dashboard
- 📱 Responsive design
- 🌗 Dark/light theme
- 📑 PDF/Excel exports

## Tech Stack

- React + TypeScript
- Vite
- Firebase (Firestore/Storage)
- TailwindCSS
- Recharts
- date-fns
- XLSX/jsPDF

## Setup

### Prerequisites

- Node.js (v16+)
- npm/yarn
- Firebase account

### Installation

```bash
git clone https://github.com/msafeerhassan/cattlefarmmanagement.git
cd cattle-farm-management
npm install
npm run dev
```

## Firebase Configuration
1-Create project at Firebase Console
2-Enable Firestore and Storage
3-Edit the .env file.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Security Rules

Go to Firestore Database and then in Rules and edit it:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cows/{cowId} {
      allow create: if request.auth != null && 
        !exists(/databases/$(database)/documents/cows/**[tag_number == request.resource.data.tag_number]);
      
      allow update: if request.auth != null && 
        (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['tag_number']) ||
        !exists(/databases/$(database)/documents/cows/**[tag_number == request.resource.data.tag_number && __name__ != resource.__name__]));
    }
    
    match /milk_records/{recordId} {
      allow read, write: if true;
    }
    
    match /monthly_totals/{totalId} {
      allow read, write: if true;
    }
    
    match /health_records/{recordId} {
      allow read, write: if true;
    }
    
    match /breeding_records/{recordId} {
      allow read, write: if true;
    }
  }
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
}
```

## Indexes

Go to Firestore Database and then in Indexes and then create these composite indexes in Firestore:

1- Collection: milk_records
        Fields: date (ASC), created_at (DESC)
        
2- Collection: health_records
        Fields: cow_id (ASC), date (DESC)

3- Collection: breeding_records
        Fields: cow_id (ASC), date (DESC)
        
4- Collection: cows
        Fields: status (ASC), created_at (DESC)
        

### Build and Deploy
```
npm run build
```
```
firebase login
firebase init
firebase deploy
```

License
MIT

Contributing
Pull requests welcome. Open issues first for major changes. 

## GitAds Sponsored
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=msafeerhassan/cattlefarmmanagement@github)](https://gitads.dev/v1/ad-track?source=msafeerhassan/cattlefarmmanagement@github)



<!-- GitAds-Verify: JOLIJG6QSVYQAP5M5FALPG63KXT7I59A -->
