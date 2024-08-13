import {
  auth,
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  db,
  collection,
  addDoc,
} from "../utils/utils.js";

console.log(auth);

const Product_form = document.getElementById("Product_form");
const create_btn = document.getElementById("create_btn");

Product_form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);

  const productInfo = {
    productImg: e.target[0].files[0],
    productTitle: e.target[1].value,
    productPrice: e.target[2].value,
    createdBy: auth.currentUser.uid,
    createdByEmail: auth.currentUser.email,
    addToCart : [],
  };
  console.log("productInfo=>", productInfo);

  const imgRef = ref(storage, productInfo.productImg.name);
  create_btn.disabled = "true";
  create_btn.innerHTML = "creating...";
  uploadBytes(imgRef, productInfo.productImg).then(() => {
    console.log("file upload done");
    getDownloadURL(imgRef).then((url) => {
      console.log("url=>", url);
      productInfo.productImg = url;
      const productCollection = collection(db, "products");
      addDoc(productCollection, productInfo).then((snapshot) => {
        console.log("document added");
        location.href = "../index.html";
      });
    });
  });
});
