import {
  auth,
  signOut,
  onAuthStateChanged,
  storage,
  db,
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "./utils/utils.js";

const logout_btn = document.getElementById("logout_btn");
const login_btn = document.getElementById("login_btn");
const avatar = document.getElementById("avatar");
const products_card_container = document.getElementById(
  "products_card_container"
);
const userEmail = document.getElementById("userEmail");
getAllProducts();
console.log(auth);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    login_btn.style.display = "none";
    avatar.style.display = "inline-block";
    userEmail.innerHTML = auth.currentUser.email;
    getUserInfo(uid);
    // ...
  } else {
    login_btn.style.display = "inline-block";
    avatar.style.display = "none";
    // window.location.href = ""
    // ...
  }
});

logout_btn.addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      location.href = "./index.html";
      console.log("logout ho gya");
    })
    .catch((error) => {
      // An error happened.
      console.error("Sign out error", error);
    });
});

function getUserInfo(uid) {
  const userDocRef = doc(db, "users", uid);
  getDoc(userDocRef).then((data) => {
    // console.log("data=>", data.id);
    // console.log("data=>", data.data());
    avatar.src = data.data().img;
  });
}

async function getAllProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    products_card_container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const products = doc.data();
      console.log("products ==>", products);

      const {
        productImg,
        productTitle,
        productPrice,
        createdBy,
        createdByEmail,
      } = products;

      const cards = `<div class="bg-white shadow-md rounded-lg overflow-hidden aos-init" data-aos="fade-up">
      <img
        src="${productImg}"
        alt="Event Image"
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <h2 class="text-xl font-bold mb-2">${productTitle}</h2>
        <p class="text-gray-600 mb-2">Creator: ${createdByEmail}</p>
        <p class="text-gray-600 mb-2">Price: ${productPrice}</p>
        <div class="flex justify-between items-center">
          <button
          id="${doc.id}"
            onclick = "addToCart(this)"
            class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            ${
              auth?.currentUser &&
              products?.addToCart?.includes(auth?.currentUser.uid)
                ? "Carted"
                : "AddToCart"
            } 
          </button>
        </div>
      </div>
    </div>`;

      window.addToCart = addToCart;
      products_card_container.innerHTML += cards;
      console.log(products);
    });
  } catch (err) {
    alert(err);
  }
}

async function addToCart(e) {
  // console.log("addToCart", e);
  if (auth.currentUser) {
    e.disabled = true;
    const docRef = doc(db, "products", e.id);
    console.log("e.id==>",e.id);
    if (e.innerText == "Carted") {
      updateDoc(docRef, {
        addTocart: arrayRemove(auth.currentUser.uid),
      })
        .then(() => {
          e.innerText = "addToCart";
          e.disabled = false; 
        })
        .catch((err) => console.log(err));
    } else {
      updateDoc(docRef, {
        addTocart: arrayUnion(auth.currentUser.uid),
      })
        .then(() => {
          e.innerText = "Carted";
          e.disabled = false;
        })
        .catch((err) => console.log(err));
    }
  } else {
    location.href = "./auth/login/index.html";
  }
}

// Add AOS animation
AOS.init({
  duration: 1200,
});