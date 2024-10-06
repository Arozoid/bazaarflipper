async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

function addOrders(data) {
let dataKeys = Object.keys(data['products']);
console.log(dataKeys.length);
document.getElementById("bz").innerHTML = "";

for (let i = 0; i < dataKeys.length; i++) {
  let element = document.createElement("p");
  let product = data['products'][dataKeys[i]];

  if (product && product.hasOwnProperty('quick_status')) {
    element.textContent = JSON.stringify(product['quick_status']);
  } else {
    element.textContent = "Invalid product data";
  }

  document.getElementById("bz").appendChild(element);
}
}

setInterval(() => {
getData("https://api.hypixel.net/v2/skyblock/bazaar")
.then((data) => {
  let bazaarInfo = data;
  addOrders(bazaarInfo);
})
.catch((error) => {
  console.error(error);
});
}, 5000)