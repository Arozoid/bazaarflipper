function formatTitle(str) {
  str = str.replace(/_/g, ' ');

  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

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
  
function addOrders(bzInfo) {
  
  getData("https://api.slothpixel.me/api/skyblock/items")
    .then((data) => {
      let itemInfo = data;
      
      let dataKeys = Object.keys(bzInfo);
  		document.getElementById("bz").innerHTML = "";
      
      for (let i = 0; i < dataKeys.length; i++) {
        let element = document.createElement("p");
        let product = bzInfo[dataKeys[i]];
        
        let product_item;
        
        if (dataKeys[i] == "BAZAAR_COOKIE") {
          product_item = {'name': "Booster Cookie"}
        } else if (itemInfo[dataKeys[i]]) {
          product_item = itemInfo[dataKeys[i]]
        } else {
        	product_item = {'name': formatTitle(dataKeys[i])}
        }
        
        if (product && product.hasOwnProperty('quick_status')) {
          element.textContent = `${product_item['name']}: ${JSON.stringify(product['quick_status'])}`;
        } else {
          element.textContent = "Invalid product data";
        }

        document.getElementById("bz").appendChild(element);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

setInterval(() => {
getData("https://api.slothpixel.me/api/skyblock/bazaar")
  .then((data) => {
  	let bazaarInfo = data;
    addOrders(bazaarInfo);
  })
  .catch((error) => {
    console.error(error);
  });
  }, 5000)