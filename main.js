// Calculates coins per hour.
function getCoinsPerHour(buyPrice, sellPrice, supply, demand) {
  let hourlyTransactions = Math.min(supply, demand) / 168
  let profitMargin = buyPrice - sellPrice
  let totalProfit = profitMargin * hourlyTransactions
  return totalProfit
}

// Formats numbers. Example: 7764941 => 7,764,941
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Replace underscores with spaces, format the words into the title format and returns the final text
function formatTitle(str) {
  str = str.replace(/_/g, " ")

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

// Get JSON from a URL
async function getData(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    return json
  } catch (error) {
    console.error(error.message)
  }
}

// Add orders to website
function addOrders(bzInfo, itemInfo) {
  // Create product variables
  let product = {}

  for (const id in bzInfo) {
    // Store all important product data
    product[id] = {
      // Buy and sell prices
      buyPrice: bzInfo[id]["quick_status"]["buyPrice"],
      sellPrice: bzInfo[id]["quick_status"]["sellPrice"],

      // Supply and demand
      supply: bzInfo[id]["quick_status"]["sellMovingWeek"],
      demand: bzInfo[id]["quick_status"]["buyMovingWeek"],

      // Coins per hour
      coinsPerHour: getCoinsPerHour(
        bzInfo[id]["quick_status"]["buyPrice"],
        bzInfo[id]["quick_status"]["sellPrice"],
        bzInfo[id]["quick_status"]["sellMovingWeek"],
        bzInfo[id]["quick_status"]["buyMovingWeek"],
      ),

      // Define item info
      item: 0,
    }

    // Set item info
    product[id]["item"] = itemInfo.find((dict) => dict["id"] === id)

    if (product[id]["item"]) {
      product[id]["item"] = product[id]["item"]
    } else {
      product[id]["item"] = formatTitle(id)
    }
  }

  // Order the products dictionary
  let productOrder = Object.entries(product)

  productOrder = productOrder.sort(
    (a, b) => b[1].coinsPerHour - a[1].coinsPerHour,
  )
  product = Object.fromEntries(productOrder)

  // Update website content
  document.getElementById("bz").innerHTML = ""

  for (const id in product) {
    // Create a bazaar info wrapper
    let bzDiv = document.createElement("div")
    bzDiv.id = "bzInfo-wrapper"

    // Name
    let name = document.createElement("p")
    name.textContent = `${product[id]["item"]["name"]}:`

    // Buy and sell price
    let buyPrice = document.createElement("p")
    buyPrice.textContent = `Buy Price: ${product[id]["buyPrice"].toFixed(1)}`

    let sellPrice = document.createElement("p")
    sellPrice.textContent = `Sell Price: ${product[id]["sellPrice"].toFixed(1)}`

    // Supply and demand
    let supply = document.createElement("p")
    supply.textContent = `Supply: ${product[id]["supply"].toFixed(1)}`

    let demand = document.createElement("p")
    demand.textContent = `Demand: ${product[id]["demand"].toFixed(1)}`

    // Coins per hour
    let coinsPerHour = document.createElement("p")
    coinsPerHour.textContent = `Coins per hour (no tax): ${product[id]["coinsPerHour"].toFixed(1)}`

    bzDiv.appendChild(name)
    bzDiv.appendChild(buyPrice)
    bzDiv.appendChild(sellPrice)
    bzDiv.appendChild(supply)
    bzDiv.appendChild(demand)
    bzDiv.appendChild(coinsPerHour)

    document.getElementById("bz").appendChild(bzDiv)
  }
}

function updateWebsite() {
  getData("https://api.hypixel.net/v2/skyblock/bazaar")
    // Code if the request succeeds to get Bazaar data
    .then((data) => {
      // Store Bazaar data
      let bazaarInfo = data["products"]

      // Get list of all items in Skyblock
      getData("https://api.hypixel.net/v2/resources/skyblock/items")
        // Code if the request succeeds to get the item catalog
        .then((data) => {
          // Put item catalog into one variable
          let itemData = data["items"]

          // Add orders to the website
          addOrders(bazaarInfo, itemData)
        })

        // Code if the request fails to get the item catalog
        .catch((error) => {
          console.error(error)
        })
    })

    // Code if the request fails to get the Bazaar data
    .catch((error) => {
      console.error(error)
    })
}

// Update the website every 5 seconds
setInterval(updateWebsite, 5000)