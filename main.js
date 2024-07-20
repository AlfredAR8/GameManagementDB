
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const maximumShield = 100;

//Set the client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//Set DB and Collection
const collectionAccounts = client.db("game_db").collection("accounts");
const collectionItems= client.db("game_db").collection("items");

async function sampleData() {
  try {
    await client.connect();

    //Insert Sample Data
    const sampleAccount = {
      username: "player1",
      displayname: "Player 1",
      password: "password",
      token: "a1b2c3d4e5f6",
      email: "user@email.com",
      level: 1,
      inventory: [
        {
          item: "sword",
          itemInGameID: "id_14_sword",
          quantity: 1
        },
        {
          item: "shield",
          itemInGameID: "id_28_shield",
          quantity: 1
        }
      ],
      coins: 5500,
      stats: {
        health: 100,
        shield: 10
      }
    };
    
    const sampleItem1 = {
      inGameID: "id_28_shield",
      name: "shield",
      type: "consumable",
      affects: "shield",
      stats: {
        quantity: 10
      },
      maxOnInventory: 8,
      price: 50
    };
    const sampleItem2 = {
      inGameID: "id_14_sword",
      name: "Weapon",
      type: "Weapon",
      stats: {
        damage: 20
      },
      maxOnInventory: 1,
      price: 150
    };

    await collectionAccounts.createIndex({ username: 1 }, { unique: true });
    await collectionItems.createIndex({ inGameID: 1 }, { unique: true });
    let sampleAccountInserted = await collectionAccounts.insertOne(sampleAccount);
    console.log(`Created sample account with the following id: ${sampleAccountInserted.insertedId}`);
    let sampleItem1Inserted = await collectionItems.insertOne(sampleItem1);
    console.log(`Created sample item with the following id: ${sampleItem1Inserted.insertedId}`);
    let sampleItem2Inserted = await collectionItems.insertOne(sampleItem2);
    console.log(`Created sample item with the following id: ${sampleItem2Inserted.insertedId}`);

  } finally {
    await client.close();
  }
}

async function purchaseItem(accountUsername, itemInGameID, accountToken) {
  try {
    await client.connect();

    //Purchase an item
    let item = await collectionItems.findOne({ inGameID: itemInGameID });
    let account = await collectionAccounts.findOne({ username: accountUsername } );

    if (account && item) {

      let accountCoins = account.coins;
      let itemPrice = item.price;
      let token = account.token;

      if (accountToken == token) {
      if (accountCoins >= itemPrice) {
        let newCoins = accountCoins - itemPrice;
        let newInventory = account.inventory;
        let itemIndex = newInventory.findIndex(i => i.itemInGameID === item.inGameID);
        if (itemIndex !== -1) {
          if (newInventory[itemIndex].quantity < item.maxOnInventory) {
            newInventory[itemIndex].quantity += 1;
          } else {
            console.log("Inventory is full.");
            return;
          }
        } else {
          newInventory.push({ item: item.name, itemInGameID: item.inGameID, quantity: 1 });
        }
  
        let updatedAccount = {
          $set: {
            coins: newCoins,
            inventory: newInventory
          }
        };
        let result = await collectionAccounts.updateOne({ username: accountUsername }, updatedAccount);
        console.log(`Account updated with the following id: ${result.modifiedCount}`);
      } else {
        console.log("Not enough coins to purchase the item.");
      }
    } else {
      console.log("Token is invalid.");
    }
    } else {
      console.log("Account or item not found on db.");
  }

  } finally {
    await client.close();
  }
}

async function useItem(accountUsername, itemInGameID, accountToken) {
  try {
    await client.connect();

    //Use an item
    let itemToUse = await collectionItems.findOne({ inGameID: itemInGameID });
    let account = await collectionAccounts.findOne({ username: accountUsername } );

    if (account && itemToUse) {

      let token = account.token;

      if (accountToken == token) {
        let inventory = account.inventory;
        let itemIndex = inventory.findIndex(i => i.itemInGameID === itemInGameID);
        if (itemIndex !== -1) {
          if (inventory[itemIndex].quantity > 0) {
            //Checks if its consumable
            if (itemToUse.type == "consumable") {
              toAffect = itemToUse.affects;
              if (account.stats[toAffect] < maximumShield) {
                //consume it
                let newStats = account.stats;
                let newInventory = inventory;
                newStats[toAffect] += itemToUse.stats.quantity;
                if (newStats[toAffect] > maximumShield) {
                  unusedShield = newStats[toAffect] - maximumShield;
                  newStats[toAffect] = maximumShield;
                  console.log(`Shield is at maximum. ${unusedShield} shield was not used.`);
                }
                newInventory[itemIndex].quantity -= 1;
                let updatedAccount = {
                  $set: {
                    stats: newStats,
                    inventory: newInventory
                  }
                };
                let result = await collectionAccounts.updateOne({ username: accountUsername }, updatedAccount);
                console.log(`Account updated with the following id: ${result.modifiedCount}`);

              } else {
                console.log("Shield is already at maximum.");
              }
            } else {
              console.log("The item is not a Consumable.");
            }

          } else {
            console.log("You dont have any of this item.");
          }
        } else {
          console.log("Item not found in inventory.");
        }
      } else {
        console.log("Token is invalid.");
      }
    } else {
      console.log("Account or item not found on db.");
    }
  } finally {
    await client.close();
  }
  }

  //sampleData();
  //purchaseItem("player1", "id_28_shield", "a1b2c3d4e5f6");
  //useItem("player1", "id_28_shield", "a1b2c3d4e5f6");