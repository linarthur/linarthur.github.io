// /docs/config/firebase.example.js
//
// Template — copy this to firebase.js (same folder) and fill in your real
// values from the Firebase console (Project settings → General → "Your
// apps" → the web app's config object). firebase.js is gitignored, so
// your real config never gets committed; this template is what's tracked
// instead. See SETUP.md for the full walkthrough.
//
// The deployed site doesn't use your local firebase.js at all — GitHub
// Actions writes its own copy at deploy time from the FIREBASE_CONFIG
// repository secret (see .github/workflows/deploy.yml and SETUP.md Part 1).

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export default firebaseConfig;
