import firebase from 'firebase';
import 'firebase/firestore';

const firebaseconfig = {
    apiKey: "XxXXXxxxxXXXxXXXXXxxXX-XxxxXXxxXXxx",
    authDomain: "xxx-xxxx-xxxxx.firebaseapp.com",
    databaseURL: "https://Xxx-xxxx-xxxxx.firebaseio.com",
    projectId: "xxx-xxxx-xxXxx",
    storageBucket: "xxx-xxxx-xxXxx.appspot.com",
    messagingSenderId: "xxxxXXxXXXxx",
    appId: "x:XxxxxxxXXXxx:xxx:xXxXXXXxXXXX"
}

firebase.initializeApp(firebaseconfig);
firebase.firestore();

export default firebase;