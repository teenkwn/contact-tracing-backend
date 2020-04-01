var admin = require("firebase-admin");
var serviceAccount = require("../../scb10x-web-firebase-adminsdk.json");

class Firestore {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://scb10x-web.firebaseio.com"
    });
    if (!this.db) {
      this.db = admin.firestore();
    }
  }

  serverTimestamp() {
    return admin.firestore.Timestamp.now()
  }
}

module.exports = new Firestore();
