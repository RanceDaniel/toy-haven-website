// Product data used on the website.
const PRODUCTS = [
  {
    id: 1,
    name: "Space Hero Figure",
    category: "figurines",
    categoryLabel: "Figurines",
    price: 3500,
    image: "assets/figurine-hero.jpg",
    description: "A detailed action figure for collectors and children."
  },
  {
    id: 2,
    name: "Character Figure Set",
    category: "figurines",
    categoryLabel: "Figurines",
    price: 5200,
    image: "assets/figurine-collection.jpg",
    description: "A set of colourful character figures for a display shelf."
  },
  {
    id: 3,
    name: "Fantasy Figure",
    category: "figurines",
    categoryLabel: "Figurines",
    price: 4100,
    image: "assets/figurine-display.jpg",
    description: "A collectible fantasy figure with fine details."
  },
  {
    id: 4,
    name: "Wooden Building Blocks",
    category: "toys",
    categoryLabel: "Toys",
    price: 2800,
    image: "assets/toy-blocks-orange.jpg",
    description: "Simple wooden blocks for creative building and learning."
  },
  {
    id: 5,
    name: "Colour Block Set",
    category: "toys",
    categoryLabel: "Toys",
    price: 3200,
    image: "assets/toy-blocks-colour.jpg",
    description: "Bright blocks that help children practise shapes and colours."
  },
  {
    id: 6,
    name: "Learning Blocks",
    category: "toys",
    categoryLabel: "Toys",
    price: 2500,
    image: "assets/toy-blocks-child.jpg",
    description: "A safe building toy made for young children."
  },
  {
    id: 7,
    name: "Family Board Game",
    category: "board-games",
    categoryLabel: "Board Games",
    price: 4500,
    image: "assets/board-dice.jpg",
    description: "A family game with dice and wooden playing pieces."
  },
  {
    id: 8,
    name: "Strategy Board Game",
    category: "board-games",
    categoryLabel: "Board Games",
    price: 5800,
    image: "assets/board-strategy.jpg",
    description: "A strategy game for two to four players."
  },
  {
    id: 9,
    name: "Colour Pawn Game",
    category: "board-games",
    categoryLabel: "Board Games",
    price: 3900,
    image: "assets/board-pawns.jpg",
    description: "An easy board game with colourful pieces."
  },
  {
    id: 10,
    name: "Beach Buggy Model",
    category: "diecast",
    categoryLabel: "Diecast Cars",
    price: 3000,
    image: "assets/car-beach.jpg",
    description: "A small off-road model car for diecast collectors."
  },
  {
    id: 11,
    name: "Classic Model Car",
    category: "diecast",
    categoryLabel: "Diecast Cars",
    price: 4200,
    image: "assets/car-classic.jpg",
    description: "A classic model car with a detailed body and wheels."
  },
  {
    id: 12,
    name: "Off-Road Model Car",
    category: "diecast",
    categoryLabel: "Diecast Cars",
    price: 3700,
    image: "assets/car-offroad.jpg",
    description: "A strong-looking off-road model for a toy car collection."
  }
];

// Returns one product that matches an ID.
function getProduct(productId) {
  for (let i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === Number(productId)) {
      return PRODUCTS[i];
    }
  }
}

// Displays a number as a price.
function formatMoney(amount) {
  return "Rs. " + Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
