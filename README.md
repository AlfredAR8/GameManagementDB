
# Game Account Management System

This project is a game account management system that allows players to purchase and use items using Node.js and MongoDB it can be used to create a server to perform operations inside a game. It also provides user token validation to ensure operations can only be performed by the legitimate account owners.

## Features

- **Account Management**: Create and manage player accounts.
- **Item Purchase**: Players can purchase items using in-game currency.
- **Item Usage**: Players can use consumable items that affect their stats.
- **Token Validation**: Each operation requires a user token to prevent unauthorized actions.
- **Inventory Limits**: Ensures inventory limits are not exceeded.
- **Funds Verification**: Ensures players have enough coins to purchase items.
- **Unique Items**: Each item has a unique ID to prevent duplicates in the database.

## Requirements

- Node.js
- MongoDB
- dotenv

#### Please ensure that you have a database named `game_db` with the following collections:

- `accounts`
- `items`

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/AlfredAR8/GameManagementDB.git
   ```

2. Navigate to the project directory:
   ```sh
   cd GameManagementDB
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory of the project and add your MongoDB URI:
   ```env
   MONGODB_URI = "Your MongoDB URI"
   ```

## Usage

### Execute the script
To run the script use:
```sh
node index.js
```

### Insert Sample Data

To insert sample data into the database, uncomment the corresponding line in `index.js` and run the script:

```js
// sampleData();
```

### Purchase an Item

To purchase an item, uncomment the `purchaseItem` function by providing the username, item ID, and user token:

```js
purchaseItem("player1", "id_28_shield", "a1b2c3d4e5f6");
```

### Use an Item

To use an item, uncomment the `useItem` function by providing the username, item ID, and user token:

```js
useItem("player1", "id_28_shield", "a1b2c3d4e5f6");
```

## Functions Overview

- `sampleData()`: Inserts sample data into the database.
- `purchaseItem(accountUsername, itemInGameID, accountToken)`: Allows a player to purchase an item if they have sufficient funds and valid token.
- `useItem(accountUsername, itemInGameID, accountToken)`: Allows a player to use a consumable item if they have it in their inventory, its a valid token and if the affected stats is not at maximum. If consuming the item would surpass the maximum, it sets the consumable to the maximum without exceeding it.

## Security Considerations

- **Token Validation**: Ensures that only authorized users can perform operations.
- **Inventory and Funds Checks**: Prevents players from exceeding inventory limits or purchasing items without sufficient funds.
- **Unique Item IDs**: Ensures that each item in the database has a unique identifier to prevent duplication.
- **Item Usage Limits**: Ensures that when a consumable item is used, it does not exceed the maximum allowed stats, adjusting to the maximum if necessary.

## License

This project is licensed under the MIT License.
