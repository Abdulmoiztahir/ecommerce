import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  arrayRemove,
} from "../utils/utils.js";

const logout_btn = document.getElementById("logout_btn");
const login_btn = document.getElementById("login_btn");
const avatar = document.getElementById("avatar");
const products_card_container = document.getElementById(
  "products_card_container"
);
const cartcontainer = document.getElementById("cart-container");
const userEmail = document.getElementById("userEmail");
console.log(auth);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user");
    const uid = user.uid;
    login_btn.style.display = "none";
    avatar.style.display = "inline-block";
    userEmail.innerHTML = auth.currentUser.email;
    getUserInfo(uid);
    getCartProducts(user.uid);

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
      window.location.href = "/";
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

async function getCartProducts(uid) {
  // console.log(uid)
  try {
    const q = query(
      collection(db, "products"),
      where("addTocart", "array-contains", uid)
    );
    console.log("query", q);
    const querySnapshot = await getDocs(q);
    console.log("data", querySnapshot);
    products_card_container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const products = doc.data();
      // console.log(products);

      const {
        productImg,
        productTitle,
        productPrice,
        createdBy,
        createdByEmail,
      } = products;

      const cards = `<div class="bg-white shadow-md rounded-lg overflow-hidden aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
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
        class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        onclick="remove('${doc.id}', '${uid}')"
      >
        remove
      </button>
          </div>
        </div>
      </div>`;
      window.remove = remove;
      cartcontainer.innerHTML += cards;
      // console.log(products);
    });
  } catch (err) {
    console.log(err);
  }
}

function remove(productId, uid) {
  const productDocRef = doc(db, "products", productId);
  updateDoc(productDocRef, {
    addTocart: arrayRemove(uid)
  })
  .then(() => {
    console.log("Product removed from cart");
    const cardElement = document.querySelector(`[id="${productId}"]`).closest('.bg-white.shadow-md.rounded-lg.overflow-hidden');
    cardElement.remove();
  })
  .catch((error) => {
    console.error("Error removing product from cart", error);
  });
}

AOS.init({
  duration: 1200,
});