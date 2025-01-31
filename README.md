# Tournament Manager

This project is a **Next.js** web application designed to create and manage FIFA tournaments or leagues using **Firebase Firestore** as the database. Users can create, manage, and update tournament brackets or league tables without requiring authentication.

## 🚀 Features

- Create and manage tournaments (league or elimination).
- Store tournament data in **Firestore**.
- View and update results dynamically.
- Supports Firebase Hosting for easy deployment.
- Uses Firebase Emulators for local development.
- Automatic deployment via GitHub Actions.

---

## 🛠 Setup and Installation

### **1️⃣ Fork & Clone the Repository**

First, fork this repository to your GitHub account and then clone it locally:

```sh
# Clone the repository
git clone https://github.com/YOUR_USERNAME/tournament-manager.git
cd tournament-manager
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

OR using Yarn:

```sh
yarn install
```

### **3️⃣ Setup Firebase**

You need a **Firebase Project**. If you don’t have one, create it at [Firebase Console](https://console.firebase.google.com/).

Once your project is set up, **initialize Firebase in your project**:

```sh
firebase init
```

**Select the following options:**
- Firestore Database
- Hosting
- Emulators (Firestore, Authentication, Functions, UI)

### **4️⃣ Configure Environment Variables**

Create a `.env.local` file in the root directory and paste the following secrets:

```env
NODE_ENV=development
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

**Important:** Never commit your `.env.local` file to GitHub.

### **5️⃣ Run Firebase Emulators (Local Development)**

To test the project locally with Firebase emulators, run:

```sh
firebase emulators:start
```

In another terminal, start the Next.js development server:

```sh
npm run dev
```

The project will be available at: [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deployment

### **Deploying to Firebase Hosting**

To deploy the application to Firebase Hosting, run:

```sh
npm run build
firebase deploy
```

If you want to deploy to a specific site in Firebase Hosting (e.g., `tournaments-43c48`), update `firebase.json`:

```json
{
  "hosting": {
    "site": "tournaments-43c48",
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(js|css|html)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

Then, redeploy:

```sh
firebase deploy
```

### **GitHub Actions (Automatic Deployment)**

To enable automatic deployment on **push to `main`**, create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Clone repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          projectId: "web-cv-a73b8"
```

### **GitHub Secrets**

To authenticate Firebase in GitHub Actions:

1. Go to **GitHub Repository** → **Settings** → **Secrets**.
2. Add a new secret: **`FIREBASE_SERVICE_ACCOUNT`**.
3. Copy the Firebase service account key (`firebase-adminsdk.json`) and paste it as the value.

---

## 🎮 Usage

1. **Go to `http://localhost:3000` (local) or your deployed URL.**
2. **Create a new tournament (league or elimination).**
3. **Add teams and manage results.**
4. **Firestore automatically updates data.**

---

## 🎯 Next Steps

- Improve UI for tournament brackets.
- Add more customization options.
- Implement advanced analytics with Firebase.

---

## 📜 License

This project is open-source under the **MIT License**.

---

## 📢 Contributing

Feel free to submit issues and pull requests! 💡

