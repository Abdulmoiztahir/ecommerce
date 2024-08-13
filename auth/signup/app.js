import {
  auth,
  createUserWithEmailAndPassword,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
  doc,
  setDoc,
} from "../../utils/utils.js";

const signup_btn = document.getElementById("signup_form");
const submit_btn = document.getElementById("submit_btn");

signup_btn.addEventListener("submit", function (e) {
  e.preventDefault();
  // console.log(e);
  // console.log(e.target);

  const img = e.target[0].files[0];
  const email = e.target[1].value;
  const password = e.target[2].value;
  const firstName = e.target[3].value;
  const lastName = e.target[4].value;

  const userInfo = {
    img,
    email,
    password,
    firstName,
    lastName,
  };

  console.log(img);
  // console.log(email);
  // console.log(password);
  // console.log(userInfo);

  submit_btn.disabled = "true";
  submit_btn.innerHTML = "Signing Up...";


  createUserWithEmailAndPassword(auth, email, password)
   .then((user) => {
      // Signed up
      const userRef = ref(storage, `user/${user.user.uid}`);
      uploadBytes(userRef, img).then(() => {
        console.log("user image uploaded");
        getDownloadURL(userRef).then((url) => {
          console.log("url aa gya =>", url);
          userInfo.img = url;

          // Create a document reference to the user's Firestore document
          const userDocRef = doc(db, "users", user.user.uid);

          // Set the user information to the Firestore document
          setDoc(userDocRef, userInfo)
           .then(() => {
              console.log("User information saved to Firestore");
              location.href = "../../index.html";
            })
           .catch((error) => {
              console.error("Error saving user information to Firestore:", error);
            });
        });
      });
      //...
      console.log("succesfull");
    })
   .catch((err) => {
      console.log("url firebase nahn de raha");
      submit_btn.disabled = false;
      submit_btn.innerText = "Submit";
    })
   .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode, errorMessage);
      //..
      console.log("Unsuccesfull");
    });
});