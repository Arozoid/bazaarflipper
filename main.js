// Replace underscores with spaces, format the words into the title format and returns the final text
function formatTitle(str) {
  str = str.replace(/_/g, ' ');

  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Get JSON from a URL
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

// Add orders to website
function addOrders(bzInfo, itemInfo) {     
    // Obtains all keys in the dictionary
    let dataKeys = Object.keys(bzInfo);
  
    // Removes all content from the "bz" divider
    document.getElementById("bz").innerHTML = "";
        
    // For loop for all bazaar items
    for (let i = 0; i < dataKeys.length; i++) {
      // Create product element
      let divider = document.createElement("div");
  
      // Get product info
      let product = bzInfo[dataKeys[i]];
          
      // Create variable for the products corresponding data in the item list
      let productItem;
      
      try {
      	productItem = itemInfo.find(dict => dict['id'] === dataKeys[i]);
      } catch(err) {}
      
      // Check for bazaar specific items
      if (dataKeys[i] == "BAZAAR_COOKIE") {
        // If it is a "bazaar cookie", add the name as "Booster Cookie"
        productItem = {'name': "Booster Cookie"};
      } else if (productItem) {
        // If the item is in the item catalog
        productItem = productItem;
      } else {
        // If the item does not exist in the item catalog, format the ID and make it the name
        productItem = {'name': formatTitle(dataKeys[i])};
      }
          
      // Double check if API is working properly before reading item data
      if (product && product.hasOwnProperty('quick_status')) {
        // If all goes normal
        
        // Product name
        productName = document.createElement("p");
        productName.textContent = `${productItem['name']}: `;
        
        // Product buy price
        productBuyPrice = document.createElement("p")
        productBuyPrice.textContent = `Buy Price: ${product['quick_status']['buyPrice'].toFixed(1)}`
        
        // Product sell price
        productSellPrice = document.createElement("p")
        productSellPrice.textContent = `Sell Price: ${product['quick_status']['sellPrice'].toFixed(1)}`
        
        // Product supply
        productSupply = document.createElement("p")
        productSupply.textContent = `Supply: ${product['quick_status']['sellMovingWeek'].toFixed(1)}`
        
        // Product demand
        productDemand = document.createElement("p")
        productDemand.textContent = `Demend: ${product['quick_status']['buyMovingWeek'].toFixed(1)}`
        
      } else {
        // If something is wrong with the API
        productName = document.createElement("p");
        productName.textContent = "Unable to read item data";
      }
      divider.appendChild(productName)
      divider.appendChild(productBuyPrice)
      divider.appendChild(productSellPrice)
      divider.appendChild(productSupply)
      divider.appendChild(productDemand)
      
      // Append product data to the "bz" divider
      document.getElementById("bz").appendChild(divider);
  }
}

function updateWebsite() {
  getData("https://api.hypixel.net/v2/skyblock/bazaar")
    // Code if the request succeeds to get Bazaar data
    .then((data) => {
      // Store Bazaar data
      let bazaarInfo = data['products'];

      // Get list of all items in Skyblock
      getData("https://api.hypixel.net/v2/resources/skyblock/items")
        // Code if the request succeeds to get the item catalog
        .then((data) => {
        	// Put item catalog into one variable
          let itemData = data['items'];
          
          // Add orders to the website
          addOrders(bazaarInfo, itemData);
        })

        // Code if the request fails to get the item catalog
        .catch((error) => {
          console.error(error);
        });
    })

    // Code if the request fails to get the Bazaar data
    .catch((error) => {
      console.error(error);
    });
}

// Update the website every 5 seconds
setInterval(updateWebsite, 5000)