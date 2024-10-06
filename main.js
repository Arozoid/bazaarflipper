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
      let element = document.createElement("p");
  
      // Get product info
      let product = bzInfo[dataKeys[i]];
          
      // Create variable for the products corresponding data in the item list
      let product_item;
          
      // Check for bazaar specific items
      if (dataKeys[i] == "BAZAAR_COOKIE") {
        // If it is a "bazaar cookie", add the name as "Booster Cookie"
        product_item = {'name': "Booster Cookie"}
      } else if (itemInfo[dataKeys[i]]) {
        // If the item does not exist in the item catalog, format the ID and make it the name
        product_item = itemInfo[dataKeys[i]]
      } else {
        // If the item is in the item catalog
        product_item = {'name': formatTitle(dataKeys[i])}
      }
          
      // Double check if API is working properly before reading item data
      if (product && product.hasOwnProperty('quick_status')) {
        // If all goes normal
        element.textContent = `${product_item['name']}: ${JSON.stringify(product['quick_status'])}`;
      } else {
        // If something is wrong with the API
        element.textContent = "Unable to read item data";
      }
          
      // Append product data to the "bz" divider
      document.getElementById("bz").appendChild(element);
  }
}

function updateWebsite() {
  getData("https://api.slothpixel.me/api/skyblock/bazaar")
    // Code if the request succeeds to get Bazaar data
    .then((data) => {
      // Store Bazaar data
      let bazaarInfo = data;

      // Get list of all items in Skyblock
      getData("https://api.slothpixel.me/api/skyblock/items")
        // Code if the request succeeds to get the item catalog
        .then((data) => {
        	// Put item catalog into one variable
          let itemInfo = data;
          
          // Add orders to the website
          addOrders(bazaarInfo, itemInfo);
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

// Starting website update
updateWebsite()

// Update the website every 5 seconds
setInterval(updateWebsite, 5000)