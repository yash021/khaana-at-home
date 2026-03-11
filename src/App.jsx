import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ============================================================
// CONTEXT & STATE MANAGEMENT
// ============================================================
const AppContext = createContext();

const useApp = () => useContext(AppContext);

// ============================================================
// MOCK DATA
// ============================================================
const CUISINES = ["North Indian", "South Indian", "Chinese", "Italian", "Japanese", "Mexican", "Thai", "Continental", "Street Food", "Desserts", "Biryani", "Pizza"];

const RESTAURANTS = [
  { id: 1, name: "Punjab Grill", cuisine: ["North Indian", "Biryani"], rating: 4.5, reviews: 1243, deliveryTime: "30-35 min", deliveryFee: 30, minOrder: 200, distance: "2.1 km", image: "🍛", promoted: true, offers: ["60% OFF up to ₹120", "Free delivery"], veg: false },
  { id: 2, name: "Dosa Factory", cuisine: ["South Indian"], rating: 4.3, reviews: 856, deliveryTime: "25-30 min", deliveryFee: 20, minOrder: 150, distance: "1.5 km", image: "🥘", promoted: false, offers: ["₹125 OFF above ₹249"], veg: true },
  { id: 3, name: "Dragon Wok", cuisine: ["Chinese", "Thai"], rating: 4.1, reviews: 672, deliveryTime: "35-40 min", deliveryFee: 40, minOrder: 250, distance: "3.2 km", image: "🥡", promoted: true, offers: ["Buy 1 Get 1 Free"], veg: false },
  { id: 4, name: "Pizza Paradise", cuisine: ["Italian", "Pizza"], rating: 4.6, reviews: 2103, deliveryTime: "20-25 min", deliveryFee: 0, minOrder: 199, distance: "1.0 km", image: "🍕", promoted: false, offers: ["Free delivery", "50% OFF up to ₹100"], veg: false },
  { id: 5, name: "Tokyo Ramen", cuisine: ["Japanese"], rating: 4.4, reviews: 534, deliveryTime: "40-45 min", deliveryFee: 50, minOrder: 300, distance: "4.0 km", image: "🍜", promoted: false, offers: [], veg: false },
  { id: 6, name: "Taco Bell Express", cuisine: ["Mexican"], rating: 3.9, reviews: 412, deliveryTime: "25-30 min", deliveryFee: 25, minOrder: 199, distance: "2.5 km", image: "🌮", promoted: false, offers: ["20% OFF above ₹500"], veg: false },
  { id: 7, name: "Green Leaf", cuisine: ["Continental", "Italian"], rating: 4.7, reviews: 1567, deliveryTime: "30-35 min", deliveryFee: 35, minOrder: 250, distance: "2.8 km", image: "🥗", promoted: true, offers: ["Flat ₹150 OFF"], veg: true },
  { id: 8, name: "Street Bites", cuisine: ["Street Food"], rating: 4.2, reviews: 934, deliveryTime: "15-20 min", deliveryFee: 10, minOrder: 100, distance: "0.8 km", image: "🧆", promoted: false, offers: ["Free delivery above ₹200"], veg: true },
  { id: 9, name: "Sweet Tooth", cuisine: ["Desserts"], rating: 4.5, reviews: 1821, deliveryTime: "20-25 min", deliveryFee: 15, minOrder: 150, distance: "1.2 km", image: "🍰", promoted: false, offers: ["₹75 OFF above ₹300"], veg: true },
  { id: 10, name: "Biryani Blues", cuisine: ["Biryani", "North Indian"], rating: 4.4, reviews: 2456, deliveryTime: "30-40 min", deliveryFee: 20, minOrder: 200, distance: "2.0 km", image: "🍚", promoted: true, offers: ["Flat 40% OFF", "Free delivery"], veg: false },
];

const MENU_ITEMS = {
  1: [
    { id: 101, name: "Butter Chicken", price: 320, description: "Creamy tomato-based curry with tender chicken pieces", veg: false, rating: 4.6, bestseller: true, category: "Main Course" },
    { id: 102, name: "Dal Makhani", price: 240, description: "Slow-cooked black lentils in a rich buttery gravy", veg: true, rating: 4.5, bestseller: true, category: "Main Course" },
    { id: 103, name: "Garlic Naan", price: 60, description: "Soft naan bread with garlic and butter", veg: true, rating: 4.3, bestseller: false, category: "Breads" },
    { id: 104, name: "Paneer Tikka", price: 280, description: "Marinated cottage cheese grilled to perfection", veg: true, rating: 4.4, bestseller: true, category: "Starters" },
    { id: 105, name: "Chicken Biryani", price: 350, description: "Fragrant basmati rice with spiced chicken and saffron", veg: false, rating: 4.7, bestseller: true, category: "Biryani" },
    { id: 106, name: "Raita", price: 60, description: "Yogurt with cucumber, onion and spices", veg: true, rating: 4.0, bestseller: false, category: "Sides" },
    { id: 107, name: "Gulab Jamun (2pc)", price: 100, description: "Deep fried milk balls soaked in sugar syrup", veg: true, rating: 4.5, bestseller: false, category: "Desserts" },
    { id: 108, name: "Tandoori Chicken", price: 380, description: "Whole chicken marinated in yogurt and spices, cooked in tandoor", veg: false, rating: 4.6, bestseller: false, category: "Starters" },
  ],
  2: [
    { id: 201, name: "Masala Dosa", price: 120, description: "Crispy crepe filled with spiced potato", veg: true, rating: 4.5, bestseller: true, category: "Dosa" },
    { id: 202, name: "Idli Sambar (4pc)", price: 90, description: "Steamed rice cakes with lentil soup", veg: true, rating: 4.3, bestseller: true, category: "Breakfast" },
    { id: 203, name: "Medu Vada (2pc)", price: 80, description: "Crispy fried lentil donuts", veg: true, rating: 4.2, bestseller: false, category: "Breakfast" },
    { id: 204, name: "Rava Dosa", price: 140, description: "Crispy semolina crepe with onions and green chili", veg: true, rating: 4.4, bestseller: false, category: "Dosa" },
    { id: 205, name: "Filter Coffee", price: 50, description: "Traditional South Indian filtered coffee", veg: true, rating: 4.7, bestseller: true, category: "Beverages" },
    { id: 206, name: "Uttapam", price: 130, description: "Thick rice pancake with vegetables", veg: true, rating: 4.1, bestseller: false, category: "Breakfast" },
  ],
  3: [
    { id: 301, name: "Kung Pao Chicken", price: 290, description: "Spicy diced chicken with peanuts and vegetables", veg: false, rating: 4.4, bestseller: true, category: "Mains" },
    { id: 302, name: "Veg Hakka Noodles", price: 200, description: "Stir-fried noodles with vegetables and soy sauce", veg: true, rating: 4.2, bestseller: true, category: "Noodles" },
    { id: 303, name: "Chicken Momos (8pc)", price: 180, description: "Steamed dumplings with spicy chicken filling", veg: false, rating: 4.5, bestseller: true, category: "Starters" },
    { id: 304, name: "Pad Thai", price: 260, description: "Thai stir-fried noodles with tamarind sauce", veg: false, rating: 4.3, bestseller: false, category: "Thai" },
    { id: 305, name: "Spring Rolls (4pc)", price: 160, description: "Crispy rolls filled with vegetables", veg: true, rating: 4.1, bestseller: false, category: "Starters" },
    { id: 306, name: "Tom Yum Soup", price: 190, description: "Spicy and sour Thai soup", veg: false, rating: 4.4, bestseller: false, category: "Soups" },
  ],
  4: [
    { id: 401, name: "Margherita Pizza", price: 249, description: "Classic tomato sauce with fresh mozzarella and basil", veg: true, rating: 4.5, bestseller: true, category: "Pizza" },
    { id: 402, name: "Pepperoni Pizza", price: 349, description: "Loaded with spicy pepperoni and mozzarella", veg: false, rating: 4.6, bestseller: true, category: "Pizza" },
    { id: 403, name: "Garlic Bread", price: 149, description: "Toasted bread with garlic butter and herbs", veg: true, rating: 4.3, bestseller: false, category: "Sides" },
    { id: 404, name: "Pasta Alfredo", price: 279, description: "Creamy white sauce pasta with mushrooms", veg: true, rating: 4.4, bestseller: true, category: "Pasta" },
    { id: 405, name: "BBQ Chicken Pizza", price: 399, description: "Smoky BBQ sauce with grilled chicken and onions", veg: false, rating: 4.5, bestseller: false, category: "Pizza" },
    { id: 406, name: "Tiramisu", price: 199, description: "Classic Italian coffee-flavoured dessert", veg: true, rating: 4.7, bestseller: false, category: "Desserts" },
  ],
  5: [
    { id: 501, name: "Tonkotsu Ramen", price: 380, description: "Rich pork bone broth with chashu and soft egg", veg: false, rating: 4.6, bestseller: true, category: "Ramen" },
    { id: 502, name: "California Roll (8pc)", price: 320, description: "Crab, avocado, and cucumber roll", veg: false, rating: 4.4, bestseller: true, category: "Sushi" },
    { id: 503, name: "Edamame", price: 150, description: "Steamed soybeans with sea salt", veg: true, rating: 4.2, bestseller: false, category: "Starters" },
    { id: 504, name: "Chicken Katsu Curry", price: 340, description: "Breaded chicken cutlet with Japanese curry", veg: false, rating: 4.5, bestseller: false, category: "Mains" },
  ],
  6: [
    { id: 601, name: "Crunchy Taco (3pc)", price: 199, description: "Crispy corn shells with seasoned beef and salsa", veg: false, rating: 4.1, bestseller: true, category: "Tacos" },
    { id: 602, name: "Burrito Bowl", price: 279, description: "Rice, beans, chicken, salsa, and sour cream", veg: false, rating: 4.3, bestseller: true, category: "Bowls" },
    { id: 603, name: "Nachos Supreme", price: 229, description: "Tortilla chips with cheese, jalapeños, and guac", veg: true, rating: 4.2, bestseller: false, category: "Starters" },
    { id: 604, name: "Quesadilla", price: 199, description: "Grilled tortilla with melted cheese and chicken", veg: false, rating: 4.0, bestseller: false, category: "Mains" },
  ],
  7: [
    { id: 701, name: "Caesar Salad", price: 220, description: "Romaine lettuce with parmesan and croutons", veg: true, rating: 4.4, bestseller: true, category: "Salads" },
    { id: 702, name: "Grilled Chicken Steak", price: 420, description: "Herb-marinated chicken with mashed potatoes", veg: false, rating: 4.6, bestseller: true, category: "Mains" },
    { id: 703, name: "Mushroom Risotto", price: 340, description: "Creamy arborio rice with wild mushrooms", veg: true, rating: 4.5, bestseller: true, category: "Mains" },
    { id: 704, name: "Bruschetta", price: 180, description: "Toasted bread with tomato, basil, and olive oil", veg: true, rating: 4.3, bestseller: false, category: "Starters" },
  ],
  8: [
    { id: 801, name: "Pav Bhaji", price: 120, description: "Spiced mashed vegetables with buttered buns", veg: true, rating: 4.5, bestseller: true, category: "Street Food" },
    { id: 802, name: "Pani Puri (6pc)", price: 60, description: "Crispy puris with spiced water and filling", veg: true, rating: 4.4, bestseller: true, category: "Chaat" },
    { id: 803, name: "Vada Pav", price: 40, description: "Mumbai's iconic potato fritter burger", veg: true, rating: 4.3, bestseller: true, category: "Street Food" },
    { id: 804, name: "Samosa (2pc)", price: 50, description: "Crispy pastry with spiced potato filling", veg: true, rating: 4.2, bestseller: false, category: "Snacks" },
    { id: 805, name: "Chole Bhature", price: 140, description: "Spiced chickpeas with fluffy fried bread", veg: true, rating: 4.5, bestseller: false, category: "Street Food" },
  ],
  9: [
    { id: 901, name: "Chocolate Lava Cake", price: 180, description: "Warm chocolate cake with molten center", veg: true, rating: 4.7, bestseller: true, category: "Cakes" },
    { id: 902, name: "Rasmalai (2pc)", price: 120, description: "Soft paneer balls in sweetened milk", veg: true, rating: 4.5, bestseller: true, category: "Indian" },
    { id: 903, name: "New York Cheesecake", price: 220, description: "Rich and creamy classic cheesecake", veg: true, rating: 4.6, bestseller: true, category: "Cakes" },
    { id: 904, name: "Mango Kulfi", price: 80, description: "Traditional Indian ice cream with mango", veg: true, rating: 4.4, bestseller: false, category: "Frozen" },
    { id: 905, name: "Brownie Sundae", price: 200, description: "Warm brownie with vanilla ice cream and hot fudge", veg: true, rating: 4.6, bestseller: false, category: "Sundaes" },
  ],
  10: [
    { id: 1001, name: "Hyderabadi Chicken Biryani", price: 320, description: "Dum-cooked aromatic rice with spiced chicken", veg: false, rating: 4.7, bestseller: true, category: "Biryani" },
    { id: 1002, name: "Veg Biryani", price: 240, description: "Fragrant rice with seasonal vegetables", veg: true, rating: 4.3, bestseller: false, category: "Biryani" },
    { id: 1003, name: "Mutton Biryani", price: 380, description: "Slow-cooked mutton with saffron rice", veg: false, rating: 4.6, bestseller: true, category: "Biryani" },
    { id: 1004, name: "Chicken 65", price: 220, description: "Spicy deep-fried chicken bites", veg: false, rating: 4.4, bestseller: true, category: "Starters" },
    { id: 1005, name: "Mirchi Ka Salan", price: 160, description: "Spicy peanut and sesame curry", veg: true, rating: 4.2, bestseller: false, category: "Sides" },
    { id: 1006, name: "Double Ka Meetha", price: 100, description: "Hyderabadi bread pudding dessert", veg: true, rating: 4.3, bestseller: false, category: "Desserts" },
  ],
};

// Fill missing menus
RESTAURANTS.forEach(r => {
  if (!MENU_ITEMS[r.id]) MENU_ITEMS[r.id] = MENU_ITEMS[1];
});

const ADDRESSES = [
  { id: 1, type: "Home", address: "Flat 204, Green Valley Apartments, Sector 48", city: "Gurugram", full: "Flat 204, Green Valley Apartments, Sector 48, Gurugram" },
  { id: 2, type: "Work", address: "WeWork, DLF Cyber City, Phase 3", city: "Gurugram", full: "WeWork, DLF Cyber City, Phase 3, Gurugram" },
];

// ============================================================
// ICONS (inline SVG components)
// ============================================================
const Icon = ({ d, size = 20, color = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{typeof d === 'string' ? <path d={d}/> : d}</svg>
);

const Icons = {
  home: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  homeFill: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" />,
  search: <Icon d={<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>} />,
  searchFill: <Icon d={<><circle cx="11" cy="11" r="8" strokeWidth="2.5"/><path d="m21 21-4.35-4.35" strokeWidth="2.5"/></>} />,
  cart: <Icon d={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>} />,
  cartFill: <Icon d={<><circle cx="9" cy="21" r="1" fill="currentColor"/><circle cx="20" cy="21" r="1" fill="currentColor"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>} />,
  user: <Icon d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  userFill: <Icon d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="currentColor"/><circle cx="12" cy="7" r="4" fill="currentColor"/></>} />,
  back: <Icon d="M19 12H5M12 19l-7-7 7-7" />,
  location: <Icon d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>} />,
  star: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFB800" color="#FFB800" />,
  starHalf: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" color="#FFB800" />,
  clock: <Icon d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>} />,
  plus: <Icon d="M12 5v14M5 12h14" />,
  minus: <Icon d="M5 12h14" />,
  close: <Icon d="M18 6L6 18M6 6l12 12" />,
  check: <Icon d="M20 6L9 17l-5-5" />,
  chevronRight: <Icon d="M9 18l6-6-6-6" />,
  chevronDown: <Icon d="M6 9l6 6 6-6" />,
  filter: <Icon d={<><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></>} />,
  offer: <Icon d={<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>} />,
  bike: <Icon d="M12 18V6M12 6l-4 4M12 6l4 4" />,
  phone: <Icon d={<><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>} />,
  heart: <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  heartFill: <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#E23744" color="#E23744" />,
  wallet: <Icon d={<><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/></>} />,
  help: <Icon d={<><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
  logout: <Icon d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />,
  veg: <Icon d={<><rect x="3" y="3" width="18" height="18" rx="2" fill="none" color="#0f8a0f" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="#0f8a0f" color="#0f8a0f"/></>} size={16} />,
  nonveg: <Icon d={<><rect x="3" y="3" width="18" height="18" rx="2" fill="none" color="#e23744" strokeWidth="2"/><polygon points="12,7 17,17 7,17" fill="#e23744" color="#e23744"/></>} size={16} />,
  order: <Icon d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>} />,
  edit: <Icon d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>} />,
  coupon: <Icon d={<><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/></>} />,
};

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@600;700;800&display=swap');

  :root {
    --zred: #E23744;
    --zred-light: #FFF0F1;
    --zred-dark: #C62828;
    --gold: #FFB800;
    --green: #1BA672;
    --green-light: #E8F8F0;
    --dark: #1C1C2B;
    --dark2: #2D2D3A;
    --gray1: #696969;
    --gray2: #9C9C9C;
    --gray3: #CFCFCF;
    --gray4: #F0F0F5;
    --gray5: #F8F8FC;
    --white: #FFFFFF;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
    --radius: 14px;
    --radius-sm: 10px;
    --radius-xs: 6px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--gray5);
    color: var(--dark);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .app-container {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--white);
    position: relative;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 0; height: 0; }

  /* Animations */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  @keyframes slideRight {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes bounceIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes progressBar {
    from { width: 0; }
  }
  @keyframes ripple {
    to { transform: scale(2); opacity: 0; }
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  .fade-in { animation: fadeIn 0.3s ease; }
  .fade-in-up { animation: fadeInUp 0.4s ease; }
  .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .bounce-in { animation: bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

  /* Bottom Nav */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: var(--white);
    border-top: 1px solid var(--gray4);
    display: flex;
    justify-content: space-around;
    padding: 6px 0 max(6px, env(safe-area-inset-bottom));
    z-index: 100;
  }
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 16px;
    cursor: pointer;
    color: var(--gray2);
    transition: color 0.2s;
    position: relative;
    background: none;
    border: none;
    font-family: inherit;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
  .nav-item.active { color: var(--zred); }
  .nav-badge {
    position: absolute;
    top: 2px;
    right: 8px;
    background: var(--zred);
    color: white;
    font-size: 9px;
    font-weight: 700;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: bounceIn 0.3s ease;
  }

  /* Header */
  .header {
    padding: 14px 16px;
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .header-location {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  .header-location-label {
    font-size: 11px;
    color: var(--gray2);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: 500;
  }
  .header-location-address {
    font-size: 15px;
    font-weight: 600;
    color: var(--dark);
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Search Bar */
  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--gray5);
    border-radius: var(--radius);
    margin: 8px 16px 4px;
    cursor: pointer;
    border: 1.5px solid var(--gray4);
    transition: all 0.2s;
  }
  .search-bar:hover, .search-bar:focus-within {
    border-color: var(--gray3);
    background: var(--white);
  }
  .search-bar input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--dark);
    width: 100%;
    font-family: inherit;
  }
  .search-bar input::placeholder { color: var(--gray2); }

  /* Cuisine Carousel */
  .cuisine-scroll {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding: 16px 16px 8px;
    scroll-snap-type: x mandatory;
  }
  .cuisine-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-width: 68px;
    cursor: pointer;
    scroll-snap-align: start;
    transition: transform 0.2s;
  }
  .cuisine-item:active { transform: scale(0.95); }
  .cuisine-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--gray5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    border: 2px solid var(--gray4);
    transition: all 0.2s;
  }
  .cuisine-item.active .cuisine-icon {
    border-color: var(--zred);
    background: var(--zred-light);
  }
  .cuisine-name {
    font-size: 11px;
    color: var(--gray1);
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
  }
  .cuisine-item.active .cuisine-name { color: var(--zred); font-weight: 600; }

  /* Banner */
  .promo-banner {
    margin: 12px 16px;
    border-radius: var(--radius);
    background: linear-gradient(135deg, #E23744 0%, #FF6B6B 50%, #FFB800 100%);
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .promo-banner::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
  }
  .promo-banner h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: white;
    font-weight: 800;
    line-height: 1.2;
  }
  .promo-banner p {
    color: rgba(255,255,255,0.9);
    font-size: 13px;
    margin-top: 6px;
  }
  .promo-code {
    display: inline-block;
    margin-top: 12px;
    background: rgba(255,255,255,0.25);
    backdrop-filter: blur(10px);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  /* Section Title */
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    padding: 20px 16px 8px;
    color: var(--dark);
  }
  .section-subtitle {
    padding: 0 16px 12px;
    font-size: 13px;
    color: var(--gray2);
  }

  /* Filter Pills */
  .filter-row {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    overflow-x: auto;
    flex-wrap: nowrap;
  }
  .filter-pill {
    flex-shrink: 0;
    padding: 7px 14px;
    border-radius: 20px;
    border: 1.5px solid var(--gray3);
    background: var(--white);
    font-size: 12px;
    font-weight: 500;
    color: var(--gray1);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: inherit;
  }
  .filter-pill.active {
    border-color: var(--zred);
    background: var(--zred-light);
    color: var(--zred);
    font-weight: 600;
  }

  /* Restaurant Card */
  .restaurant-card {
    margin: 8px 16px;
    border-radius: var(--radius);
    background: var(--white);
    border: 1px solid var(--gray4);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    animation: fadeInUp 0.4s ease backwards;
  }
  .restaurant-card:active { transform: scale(0.98); }
  .restaurant-card-img {
    height: 160px;
    background: linear-gradient(135deg, var(--gray4) 0%, var(--gray5) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
    position: relative;
  }
  .promoted-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }
  .offer-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    padding: 20px 12px 10px;
    color: white;
  }
  .offer-badge span {
    background: linear-gradient(90deg, #1BA672, #3BD89C);
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    margin-right: 6px;
    display: inline-block;
    margin-bottom: 2px;
  }
  .restaurant-info {
    padding: 12px 14px;
  }
  .restaurant-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .restaurant-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--dark);
    line-height: 1.3;
  }
  .restaurant-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--green);
    color: white;
    padding: 3px 6px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .restaurant-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 12px;
    color: var(--gray2);
  }
  .restaurant-meta .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--gray3);
  }
  .restaurant-cuisines {
    font-size: 13px;
    color: var(--gray1);
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Restaurant Detail Page */
  .rest-detail-header {
    position: relative;
    height: 200px;
    background: linear-gradient(135deg, var(--gray4), var(--gray5));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
  }
  .rest-detail-header-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    padding: 40px 16px 16px;
  }
  .back-btn {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    z-index: 10;
    transition: transform 0.2s;
  }
  .back-btn:active { transform: scale(0.9); }
  .fav-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    z-index: 10;
    transition: transform 0.2s;
  }
  .fav-btn:active { transform: scale(0.9); }
  .rest-detail-info {
    padding: 16px;
    border-bottom: 6px solid var(--gray4);
  }
  .rest-detail-name {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--dark);
  }
  .rest-detail-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    font-size: 13px;
    color: var(--gray1);
  }
  .rest-detail-meta .rating-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--green);
    color: white;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 13px;
  }
  .rest-offer-row {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    overflow-x: auto;
    border-bottom: 6px solid var(--gray4);
  }
  .rest-offer-chip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1.5px dashed var(--green);
    border-radius: var(--radius-sm);
    background: var(--green-light);
    font-size: 12px;
    font-weight: 600;
    color: var(--green);
  }

  /* Menu */
  .menu-category {
    padding: 14px 16px 6px;
    font-size: 16px;
    font-weight: 700;
    color: var(--dark);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: var(--white);
    z-index: 5;
  }
  .menu-category-count {
    font-size: 12px;
    font-weight: 500;
    color: var(--gray2);
  }
  .menu-item {
    display: flex;
    justify-content: space-between;
    padding: 14px 16px;
    gap: 14px;
    border-bottom: 1px solid var(--gray4);
    animation: fadeIn 0.3s ease;
  }
  .menu-item-left { flex: 1; }
  .menu-item-veg { margin-bottom: 6px; }
  .menu-item-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--dark);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .bestseller-tag {
    font-size: 10px;
    color: var(--gold);
    background: #FFF8E1;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }
  .menu-item-price {
    font-size: 14px;
    font-weight: 600;
    color: var(--dark);
    margin-top: 4px;
  }
  .menu-item-desc {
    font-size: 12px;
    color: var(--gray2);
    margin-top: 4px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .menu-item-rating {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    color: var(--gray1);
    margin-top: 6px;
  }
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-width: 80px;
    height: 34px;
    border: 1.5px solid var(--zred);
    border-radius: 8px;
    background: var(--white);
    color: var(--zred);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
    align-self: flex-end;
    flex-shrink: 0;
  }
  .add-btn:active { background: var(--zred-light); }
  .add-btn.in-cart {
    background: var(--zred);
    color: var(--white);
  }
  .qty-controls {
    display: flex;
    align-items: center;
    gap: 0;
    min-width: 80px;
    height: 34px;
    border: 1.5px solid var(--zred);
    border-radius: 8px;
    background: var(--zred);
    overflow: hidden;
  }
  .qty-btn {
    width: 28px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    transition: background 0.15s;
  }
  .qty-btn:active { background: rgba(255,255,255,0.2); }
  .qty-count {
    flex: 1;
    text-align: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }

  /* Cart Bar */
  .cart-bar {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 448px;
    background: var(--green);
    color: white;
    padding: 14px 16px;
    border-radius: var(--radius);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    z-index: 90;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 20px rgba(27, 166, 114, 0.4);
  }
  .cart-bar:active { transform: translateX(-50%) scale(0.98); }
  .cart-bar-left {
    font-size: 13px;
    font-weight: 600;
  }
  .cart-bar-left span {
    font-size: 11px;
    opacity: 0.85;
  }
  .cart-bar-right {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
  }

  /* Cart Page */
  .cart-page { padding-bottom: 160px; }
  .cart-rest-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    border-bottom: 1px solid var(--gray4);
  }
  .cart-rest-emoji {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--gray5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--gray4);
  }
  .cart-item-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }
  .cart-item-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--dark);
  }
  .cart-item-price {
    font-size: 13px;
    color: var(--gray1);
    margin-top: 2px;
  }
  .coupon-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    margin: 12px 16px;
    border: 1.5px dashed var(--gray3);
    border-radius: var(--radius-sm);
    cursor: pointer;
  }
  .coupon-bar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--dark);
  }
  .bill-section {
    padding: 16px;
    margin: 8px 16px;
    background: var(--gray5);
    border-radius: var(--radius);
  }
  .bill-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 12px;
  }
  .bill-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--gray1);
    padding: 4px 0;
  }
  .bill-row.total {
    font-size: 15px;
    font-weight: 700;
    color: var(--dark);
    border-top: 1px dashed var(--gray3);
    margin-top: 8px;
    padding-top: 10px;
  }
  .bill-row .free { color: var(--green); font-weight: 600; }

  .delivery-address {
    padding: 16px;
    margin: 8px 16px;
    background: var(--gray5);
    border-radius: var(--radius);
  }
  .delivery-address-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 10px;
  }
  .address-option {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 0.2s;
    border: 1.5px solid transparent;
    margin-bottom: 6px;
  }
  .address-option.selected {
    border-color: var(--zred);
    background: var(--zred-light);
  }
  .address-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--gray3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .address-option.selected .address-radio {
    border-color: var(--zred);
  }
  .address-radio-inner {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--zred);
    display: none;
  }
  .address-option.selected .address-radio-inner { display: block; }
  .address-type {
    font-size: 13px;
    font-weight: 700;
    color: var(--dark);
  }
  .address-text {
    font-size: 12px;
    color: var(--gray2);
    margin-top: 2px;
  }

  /* Checkout / Pay Button */
  .checkout-bar {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: var(--white);
    padding: 12px 16px max(12px, env(safe-area-inset-bottom));
    border-top: 1px solid var(--gray4);
    z-index: 100;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  }
  .checkout-btn {
    width: 100%;
    padding: 16px;
    border-radius: var(--radius);
    border: none;
    background: var(--zred);
    color: white;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.15s;
  }
  .checkout-btn:active { transform: scale(0.98); background: var(--zred-dark); }
  .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Order Tracking */
  .order-status-page {
    padding: 16px;
    padding-bottom: 100px;
  }
  .order-confirmed-header {
    text-align: center;
    padding: 30px 0;
    animation: fadeInUp 0.5s ease;
  }
  .order-confirmed-emoji {
    font-size: 60px;
    margin-bottom: 12px;
  }
  .order-confirmed-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--dark);
  }
  .order-confirmed-sub {
    font-size: 14px;
    color: var(--gray2);
    margin-top: 6px;
  }
  .tracking-steps {
    padding: 20px 0;
  }
  .tracking-step {
    display: flex;
    gap: 14px;
    padding: 0 0 24px;
    position: relative;
  }
  .tracking-step::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 32px;
    bottom: 0;
    width: 2px;
    background: var(--gray4);
  }
  .tracking-step:last-child::before { display: none; }
  .tracking-step.active::before { background: var(--green); }
  .tracking-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--gray4);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
    font-size: 14px;
  }
  .tracking-step.completed .tracking-dot {
    background: var(--green);
    color: white;
  }
  .tracking-step.active .tracking-dot {
    background: var(--green);
    color: white;
    animation: pulse 1.5s infinite;
  }
  .tracking-step-text h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--dark);
  }
  .tracking-step.pending .tracking-step-text h4 { color: var(--gray2); }
  .tracking-step-text p {
    font-size: 12px;
    color: var(--gray2);
    margin-top: 2px;
  }
  .order-eta-card {
    background: linear-gradient(135deg, var(--green), #3BD89C);
    border-radius: var(--radius);
    padding: 20px;
    color: white;
    text-align: center;
    margin: 16px 0;
    animation: fadeInUp 0.5s ease 0.2s backwards;
  }
  .order-eta-time {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 800;
  }
  .order-eta-label {
    font-size: 13px;
    opacity: 0.9;
    margin-top: 4px;
  }

  /* Profile */
  .profile-header {
    padding: 30px 16px;
    background: linear-gradient(135deg, var(--dark), var(--dark2));
    color: white;
    text-align: center;
  }
  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--zred);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    font-size: 28px;
    font-weight: 700;
    color: white;
    border: 3px solid rgba(255,255,255,0.2);
  }
  .profile-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
  }
  .profile-email {
    font-size: 13px;
    opacity: 0.7;
    margin-top: 4px;
  }
  .profile-menu-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border-bottom: 1px solid var(--gray4);
    cursor: pointer;
    transition: background 0.15s;
  }
  .profile-menu-item:active { background: var(--gray5); }
  .profile-menu-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--gray5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray1);
  }
  .profile-menu-text {
    flex: 1;
  }
  .profile-menu-text h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--dark);
  }
  .profile-menu-text p {
    font-size: 12px;
    color: var(--gray2);
    margin-top: 2px;
  }

  /* Search Page */
  .search-page-input {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--gray5);
    margin: 0 16px;
    border-radius: var(--radius);
    border: 1.5px solid var(--gray3);
  }
  .search-page-input input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: var(--dark);
    width: 100%;
    font-family: inherit;
  }
  .recent-searches {
    padding: 16px;
  }
  .recent-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }
  .recent-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    font-size: 14px;
    color: var(--gray1);
    cursor: pointer;
    border-bottom: 1px solid var(--gray4);
  }
  .search-results { padding: 8px 0; }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 30px;
    text-align: center;
  }
  .empty-state-emoji { font-size: 64px; margin-bottom: 16px; }
  .empty-state-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--dark);
  }
  .empty-state-desc {
    font-size: 13px;
    color: var(--gray2);
    margin-top: 8px;
    line-height: 1.5;
  }
  .empty-state-btn {
    margin-top: 20px;
    padding: 12px 28px;
    background: var(--zred);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }

  /* VEG TOGGLE */
  .veg-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
  }
  .toggle-track {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: var(--gray3);
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
  }
  .toggle-track.on { background: var(--green); }
  .toggle-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
  .toggle-track.on .toggle-thumb { transform: translateX(20px); }
  .toggle-label { font-size: 13px; font-weight: 600; color: var(--dark); }

  /* Misc */
  .divider { height: 6px; background: var(--gray4); }
  .page-content { padding-bottom: 80px; }
  .loading-dots {
    display: flex;
    gap: 6px;
    justify-content: center;
    padding: 40px;
  }
  .loading-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--zred);
    animation: dotPulse 1s infinite;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  /* Overlay */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .bottom-sheet {
    width: 100%;
    max-width: 480px;
    background: var(--white);
    border-radius: 20px 20px 0 0;
    padding: 20px 16px max(20px, env(safe-area-inset-bottom));
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 80vh;
    overflow-y: auto;
  }
  .sheet-handle {
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: var(--gray3);
    margin: 0 auto 16px;
  }

  /* Confetti-like effect */
  .confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    z-index: 999;
    overflow: hidden;
    height: 100vh;
  }
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    animation: confettiFall 3s linear forwards;
  }
  @keyframes confettiFall {
    0% { transform: translateY(-10px) rotate(0); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
`;

// ============================================================
// CONFETTI COMPONENT
// ============================================================
const Confetti = () => {
  const colors = ['#E23744', '#FFB800', '#1BA672', '#4A90D9', '#FF6B6B', '#9B59B6'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti" style={{
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          background: p.color,
          width: p.size,
          height: p.size,
        }} />
      ))}
    </div>
  );
};

// ============================================================
// BOTTOM NAVIGATION
// ============================================================
const BottomNav = ({ currentTab, setTab, cartCount }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Icons.home, activeIcon: Icons.homeFill },
    { id: 'search', label: 'Search', icon: Icons.search, activeIcon: Icons.searchFill },
    { id: 'cart', label: 'Cart', icon: Icons.cart, activeIcon: Icons.cartFill },
    { id: 'profile', label: 'Account', icon: Icons.user, activeIcon: Icons.userFill },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-item ${currentTab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
          {currentTab === t.id ? t.activeIcon : t.icon}
          {t.id === 'cart' && cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          {t.label}
        </button>
      ))}
    </nav>
  );
};

// ============================================================
// HOME PAGE
// ============================================================
const CUISINE_EMOJIS = { "North Indian": "🍛", "South Indian": "🥘", "Chinese": "🥡", "Italian": "🍝", "Japanese": "🍜", "Mexican": "🌮", "Thai": "🍲", "Continental": "🥗", "Street Food": "🧆", "Desserts": "🍰", "Biryani": "🍚", "Pizza": "🍕" };

const HomePage = ({ onRestaurantClick, cart }) => {
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [filter, setFilter] = useState(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0]);

  const filteredRestaurants = RESTAURANTS.filter(r => {
    if (selectedCuisine && !r.cuisine.includes(selectedCuisine)) return false;
    if (vegOnly && !r.veg) return false;
    if (filter === 'rating') return r.rating >= 4.0;
    if (filter === 'freeDelivery') return r.deliveryFee === 0;
    if (filter === 'offers') return r.offers.length > 0;
    return true;
  }).sort((a, b) => {
    if (filter === 'rating') return b.rating - a.rating;
    if (filter === 'nearby') return parseFloat(a.distance) - parseFloat(b.distance);
    if (filter === 'fast') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    return (b.promoted ? 1 : 0) - (a.promoted ? 1 : 0);
  });

  const cartRestaurant = cart.length > 0 ? RESTAURANTS.find(r => MENU_ITEMS[r.id]?.some(m => m.id === cart[0].id)) : null;
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="header">
        <div className="header-location">
          <span style={{ color: 'var(--zred)' }}>{Icons.location}</span>
          <div>
            <div className="header-location-label">Deliver to</div>
            <div className="header-location-address">
              {selectedAddress.type} — {selectedAddress.address}
              <span style={{ color: 'var(--gray2)' }}>{Icons.chevronDown}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar" onClick={() => {}}>
        <span style={{ color: 'var(--gray2)' }}>{Icons.search}</span>
        <input placeholder="Search for restaurants, cuisines..." readOnly />
      </div>

      {/* Cuisine Carousel */}
      <div className="cuisine-scroll">
        {CUISINES.map(c => (
          <div key={c} className={`cuisine-item ${selectedCuisine === c ? 'active' : ''}`}
            onClick={() => setSelectedCuisine(selectedCuisine === c ? null : c)}>
            <div className="cuisine-icon">{CUISINE_EMOJIS[c]}</div>
            <span className="cuisine-name">{c}</span>
          </div>
        ))}
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <h3>Flat 60% OFF</h3>
        <p>On your first order — max discount ₹150</p>
        <div className="promo-code">USE CODE: WELCOME60</div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <button className={`filter-pill ${filter === 'fast' ? 'active' : ''}`} onClick={() => setFilter(filter === 'fast' ? null : 'fast')}>⚡ Fast Delivery</button>
        <button className={`filter-pill ${filter === 'rating' ? 'active' : ''}`} onClick={() => setFilter(filter === 'rating' ? null : 'rating')}>⭐ Rating 4.0+</button>
        <button className={`filter-pill ${filter === 'offers' ? 'active' : ''}`} onClick={() => setFilter(filter === 'offers' ? null : 'offers')}>🏷️ Offers</button>
        <button className={`filter-pill ${filter === 'freeDelivery' ? 'active' : ''}`} onClick={() => setFilter(filter === 'freeDelivery' ? null : 'freeDelivery')}>🚗 Free Delivery</button>
        <button className={`filter-pill ${filter === 'nearby' ? 'active' : ''}`} onClick={() => setFilter(filter === 'nearby' ? null : 'nearby')}>📍 Nearby</button>
      </div>

      {/* Veg Toggle */}
      <div className="veg-toggle">
        <div className={`toggle-track ${vegOnly ? 'on' : ''}`} onClick={() => setVegOnly(!vegOnly)}>
          <div className="toggle-thumb" />
        </div>
        <span className="toggle-label">Pure Veg</span>
      </div>

      {/* Restaurants */}
      <div className="section-title">
        {selectedCuisine ? selectedCuisine : 'All Restaurants'}
      </div>
      <div className="section-subtitle">
        {filteredRestaurants.length} restaurants delivering to you
      </div>

      {filteredRestaurants.map((r, i) => (
        <div key={r.id} className="restaurant-card" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => onRestaurantClick(r)}>
          <div className="restaurant-card-img">
            {r.image}
            {r.promoted && <div className="promoted-badge">AD</div>}
            {r.offers.length > 0 && (
              <div className="offer-badge">
                {r.offers.map((o, j) => <span key={j}>{o}</span>)}
              </div>
            )}
          </div>
          <div className="restaurant-info">
            <div className="restaurant-header">
              <div className="restaurant-name">{r.name}</div>
              <div className="restaurant-rating">⭐ {r.rating}</div>
            </div>
            <div className="restaurant-cuisines">{r.cuisine.join(', ')}</div>
            <div className="restaurant-meta">
              <span>{r.deliveryTime}</span>
              <span className="dot" />
              <span>{r.distance}</span>
              <span className="dot" />
              <span>{r.deliveryFee === 0 ? 'Free delivery' : `₹${r.deliveryFee} delivery`}</span>
            </div>
          </div>
        </div>
      ))}

      {filteredRestaurants.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-emoji">🔍</div>
          <div className="empty-state-title">No restaurants found</div>
          <div className="empty-state-desc">Try adjusting your filters or cuisine selection</div>
        </div>
      )}

      {/* Cart floating bar */}
      {cart.length > 0 && cartRestaurant && (
        <div className="cart-bar">
          <div className="cart-bar-left">
            {cart.reduce((s, c) => s + c.qty, 0)} items • ₹{cartTotal}
            <br /><span>From {cartRestaurant.name}</span>
          </div>
          <div className="cart-bar-right">
            View Cart {Icons.chevronRight}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// RESTAURANT DETAIL PAGE
// ============================================================
const RestaurantPage = ({ restaurant, onBack, cart, addToCart, removeFromCart, onViewCart }) => {
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fav, setFav] = useState(false);

  const menu = MENU_ITEMS[restaurant.id] || [];
  const filteredMenu = menu.filter(item => {
    if (vegOnly && !item.veg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = [...new Set(filteredMenu.map(i => i.category))];
  const getQty = (itemId) => {
    const c = cart.find(i => i.id === itemId);
    return c ? c.qty : 0;
  };
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="page-content fade-in">
      {/* Header Image */}
      <div className="rest-detail-header">
        {restaurant.image}
        <button className="back-btn" onClick={onBack}>{Icons.back}</button>
        <button className="fav-btn" onClick={() => setFav(!fav)}>{fav ? Icons.heartFill : Icons.heart}</button>
      </div>

      {/* Info */}
      <div className="rest-detail-info">
        <div className="rest-detail-name">{restaurant.name}</div>
        <div style={{ fontSize: 13, color: 'var(--gray1)', marginTop: 4 }}>{restaurant.cuisine.join(', ')}</div>
        <div className="rest-detail-meta">
          <span className="rating-pill">⭐ {restaurant.rating}</span>
          <span>{restaurant.reviews}+ ratings</span>
          <span>•</span>
          <span>{restaurant.deliveryTime}</span>
          <span>•</span>
          <span>{restaurant.distance}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray2)', marginTop: 6 }}>
          {restaurant.deliveryFee === 0 ? '🎉 Free delivery' : `₹${restaurant.deliveryFee} delivery fee`} • Min order ₹{restaurant.minOrder}
        </div>
      </div>

      {/* Offers */}
      {restaurant.offers.length > 0 && (
        <div className="rest-offer-row">
          {restaurant.offers.map((o, i) => (
            <div key={i} className="rest-offer-chip">
              <span style={{ color: 'var(--green)' }}>{Icons.offer}</span>
              {o}
            </div>
          ))}
        </div>
      )}

      {/* Search & Veg toggle */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div className="search-bar" style={{ margin: 0, flex: 1 }}>
          <span style={{ color: 'var(--gray2)' }}>{Icons.search}</span>
          <input placeholder="Search menu..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSearchQuery('')}>{Icons.close}</button>}
        </div>
        <div className={`toggle-track ${vegOnly ? 'on' : ''}`} onClick={() => setVegOnly(!vegOnly)} style={{ flexShrink: 0 }}>
          <div className="toggle-thumb" />
        </div>
      </div>

      {/* Menu Items */}
      {categories.map(cat => {
        const items = filteredMenu.filter(i => i.category === cat);
        return (
          <div key={cat}>
            <div className="menu-category">
              {cat}
              <span className="menu-category-count">{items.length} items</span>
            </div>
            {items.map(item => {
              const qty = getQty(item.id);
              return (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-left">
                    <div className="menu-item-veg">{item.veg ? Icons.veg : Icons.nonveg}</div>
                    <div className="menu-item-name">
                      {item.name}
                      {item.bestseller && <span className="bestseller-tag">★ BESTSELLER</span>}
                    </div>
                    <div className="menu-item-price">₹{item.price}</div>
                    <div className="menu-item-desc">{item.description}</div>
                    <div className="menu-item-rating">
                      {Icons.star} {item.rating}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {qty === 0 ? (
                      <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(item, restaurant.id); }}>ADD</button>
                    ) : (
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>−</button>
                        <span className="qty-count">{qty}</span>
                        <button className="qty-btn" onClick={(e) => { e.stopPropagation(); addToCart(item, restaurant.id); }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {filteredMenu.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-emoji">🍽️</div>
          <div className="empty-state-title">No items found</div>
          <div className="empty-state-desc">Try changing your search or filter</div>
        </div>
      )}

      {/* Cart Bar */}
      {cartCount > 0 && (
        <div className="cart-bar" onClick={onViewCart}>
          <div className="cart-bar-left">
            {cartCount} item{cartCount > 1 ? 's' : ''} • ₹{cartTotal}
            <br /><span>Extra charges may apply</span>
          </div>
          <div className="cart-bar-right">
            View Cart {Icons.chevronRight}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// CART PAGE
// ============================================================
const CartPage = ({ cart, addToCart, removeFromCart, clearCart, onBack, onCheckout, restaurantId }) => {
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0]);
  const [tip, setTip] = useState(0);

  const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
  if (!restaurant || cart.length === 0) {
    return (
      <div className="page-content fade-in">
        <div className="header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" style={{ position: 'relative', top: 0, left: 0 }} onClick={onBack}>{Icons.back}</button>
          <span style={{ fontSize: 17, fontWeight: 700 }}>Cart</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-emoji">🛒</div>
          <div className="empty-state-title">Your cart is empty</div>
          <div className="empty-state-desc">Looks like you haven't added anything yet. Explore restaurants near you!</div>
          <button className="empty-state-btn" onClick={onBack}>Browse Restaurants</button>
        </div>
      </div>
    );
  }

  const itemTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const deliveryFee = restaurant.deliveryFee;
  const taxes = Math.round(itemTotal * 0.05);
  const packingCharge = 15;
  const grandTotal = itemTotal + deliveryFee + taxes + packingCharge + tip;

  return (
    <div className="cart-page fade-in">
      <div className="header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="back-btn" style={{ position: 'relative', top: 0, left: 0 }} onClick={onBack}>{Icons.back}</button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>Cart</span>
      </div>

      {/* Restaurant Info */}
      <div className="cart-rest-info">
        <div className="cart-rest-emoji">{restaurant.image}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{restaurant.name}</div>
          <div style={{ fontSize: 12, color: 'var(--gray2)' }}>{restaurant.cuisine.join(', ')}</div>
        </div>
      </div>

      {/* Cart Items */}
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-left">
            {item.veg ? Icons.veg : Icons.nonveg}
            <div>
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">₹{item.price}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
              <span className="qty-count">{item.qty}</span>
              <button className="qty-btn" onClick={() => addToCart(item, restaurantId)}>+</button>
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, minWidth: 50, textAlign: 'right' }}>₹{item.price * item.qty}</span>
          </div>
        </div>
      ))}

      {/* Coupon */}
      <div className="coupon-bar">
        <div className="coupon-bar-left">
          <span style={{ color: 'var(--gray1)' }}>{Icons.coupon}</span>
          Apply coupon
        </div>
        {Icons.chevronRight}
      </div>

      {/* Tip */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Tip your delivery partner</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 20, 30, 50].map(t => (
            <button key={t} onClick={() => setTip(t)} style={{
              padding: '8px 16px', borderRadius: 20, border: `1.5px solid ${tip === t ? 'var(--zred)' : 'var(--gray3)'}`,
              background: tip === t ? 'var(--zred-light)' : 'transparent', color: tip === t ? 'var(--zred)' : 'var(--gray1)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
            }}>
              {t === 0 ? 'None' : `₹${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Bill */}
      <div className="bill-section">
        <div className="bill-title">Bill Details</div>
        <div className="bill-row"><span>Item Total</span><span>₹{itemTotal}</span></div>
        <div className="bill-row"><span>Delivery Fee</span><span className={deliveryFee === 0 ? 'free' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
        <div className="bill-row"><span>Packing Charges</span><span>₹{packingCharge}</span></div>
        <div className="bill-row"><span>Taxes</span><span>₹{taxes}</span></div>
        {tip > 0 && <div className="bill-row"><span>Tip</span><span>₹{tip}</span></div>}
        <div className="bill-row total"><span>Grand Total</span><span>₹{grandTotal}</span></div>
      </div>

      {/* Delivery Address */}
      <div className="delivery-address">
        <div className="delivery-address-title">Deliver to</div>
        {ADDRESSES.map(addr => (
          <div key={addr.id} className={`address-option ${selectedAddress.id === addr.id ? 'selected' : ''}`} onClick={() => setSelectedAddress(addr)}>
            <div className="address-radio"><div className="address-radio-inner" /></div>
            <div>
              <div className="address-type">{addr.type}</div>
              <div className="address-text">{addr.full}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout */}
      <div className="checkout-bar">
        <button className="checkout-btn" onClick={() => onCheckout(grandTotal)}>
          Place Order • ₹{grandTotal}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// ORDER TRACKING PAGE
// ============================================================
const OrderTrackingPage = ({ orderTotal, onBackHome }) => {
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowConfetti(false), 3000);
    const timer2 = setTimeout(() => setStep(1), 3000);
    const timer3 = setTimeout(() => setStep(2), 8000);
    const timer4 = setTimeout(() => setStep(3), 15000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); };
  }, []);

  const steps = [
    { title: 'Order Confirmed', desc: 'Your order has been placed', emoji: '✅', time: 'Just now' },
    { title: 'Preparing', desc: 'Restaurant is cooking your food', emoji: '👨‍🍳', time: '~5 min' },
    { title: 'Out for Delivery', desc: 'Your food is on the way!', emoji: '🛵', time: '~20 min' },
    { title: 'Delivered', desc: 'Enjoy your meal!', emoji: '📦', time: 'Arriving soon' },
  ];

  return (
    <div className="order-status-page fade-in">
      {showConfetti && <Confetti />}

      <div className="header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="back-btn" style={{ position: 'relative', top: 0, left: 0 }} onClick={onBackHome}>{Icons.back}</button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>Order Status</span>
      </div>

      <div className="order-confirmed-header">
        <div className="order-confirmed-emoji">🎉</div>
        <div className="order-confirmed-title">Order Placed!</div>
        <div className="order-confirmed-sub">Order #{Math.floor(100000 + Math.random() * 900000)} • ₹{orderTotal}</div>
      </div>

      <div className="order-eta-card">
        <div className="order-eta-time">{step < 3 ? '25-30' : '✓'}</div>
        <div className="order-eta-label">{step < 3 ? 'Estimated delivery (minutes)' : 'Delivered!'}</div>
      </div>

      <div className="tracking-steps">
        {steps.map((s, i) => {
          const status = i < step ? 'completed' : i === step ? 'active' : 'pending';
          return (
            <div key={i} className={`tracking-step ${status}`}>
              <div className="tracking-dot">
                {status === 'completed' ? '✓' : s.emoji}
              </div>
              <div className="tracking-step-text">
                <h4>{s.title}</h4>
                <p>{status === 'active' ? s.desc : status === 'completed' ? 'Done' : s.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 16px' }}>
        <button className="checkout-btn" onClick={onBackHome} style={{ background: step >= 3 ? 'var(--green)' : 'var(--dark)' }}>
          {step >= 3 ? 'Rate & Review' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// SEARCH PAGE
// ============================================================
const SearchPage = ({ onRestaurantClick }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = query.length >= 2 ? RESTAURANTS.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const popularSearches = ['Biryani', 'Pizza', 'Chinese', 'Burger', 'Dosa', 'Cake', 'Momos', 'Pasta'];

  return (
    <div className="page-content fade-in">
      <div className="header">
        <div className="search-page-input">
          <span style={{ color: 'var(--gray2)' }}>{Icons.search}</span>
          <input ref={inputRef} placeholder="Search for restaurants or cuisines..." value={query} onChange={e => setQuery(e.target.value)} />
          {query && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray2)' }} onClick={() => setQuery('')}>{Icons.close}</button>}
        </div>
      </div>

      {query.length < 2 ? (
        <div className="recent-searches">
          <div className="recent-title">Popular Searches</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {popularSearches.map(s => (
              <button key={s} className="filter-pill" onClick={() => setQuery(s)}>{s}</button>
            ))}
          </div>

          <div className="recent-title" style={{ marginTop: 24 }}>Popular Restaurants</div>
          {RESTAURANTS.filter(r => r.rating >= 4.4).slice(0, 4).map(r => (
            <div key={r.id} className="recent-item" onClick={() => onRestaurantClick(r)}>
              <span style={{ fontSize: 20 }}>{r.image}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray2)' }}>{r.cuisine.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="search-results">
          {results.length > 0 ? results.map(r => (
            <div key={r.id} className="restaurant-card" onClick={() => onRestaurantClick(r)}>
              <div className="restaurant-card-img" style={{ height: 120 }}>
                {r.image}
                {r.offers.length > 0 && (
                  <div className="offer-badge">
                    {r.offers.slice(0, 1).map((o, j) => <span key={j}>{o}</span>)}
                  </div>
                )}
              </div>
              <div className="restaurant-info">
                <div className="restaurant-header">
                  <div className="restaurant-name">{r.name}</div>
                  <div className="restaurant-rating">⭐ {r.rating}</div>
                </div>
                <div className="restaurant-cuisines">{r.cuisine.join(', ')}</div>
                <div className="restaurant-meta">
                  <span>{r.deliveryTime}</span>
                  <span className="dot" />
                  <span>{r.distance}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <div className="empty-state-emoji">🔍</div>
              <div className="empty-state-title">No results for "{query}"</div>
              <div className="empty-state-desc">Try searching for a different restaurant or cuisine</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// PROFILE PAGE
// ============================================================
const ProfilePage = ({ pastOrders }) => {
  const menuItems = [
    { icon: Icons.order, title: 'Your Orders', desc: `${pastOrders} past orders`, action: null },
    { icon: Icons.heart, title: 'Favorites', desc: 'Your saved restaurants', action: null },
    { icon: Icons.location, title: 'Addresses', desc: 'Manage delivery addresses', action: null },
    { icon: Icons.wallet, title: 'Payments', desc: 'Saved cards & wallets', action: null },
    { icon: Icons.coupon, title: 'Coupons', desc: 'Your promo codes', action: null },
    { icon: Icons.help, title: 'Help & Support', desc: 'Get help with your orders', action: null },
    { icon: Icons.edit, title: 'Edit Profile', desc: 'Change your details', action: null },
    { icon: Icons.logout, title: 'Logout', desc: 'Sign out of your account', action: null },
  ];

  return (
    <div className="page-content fade-in">
      <div className="profile-header">
        <div className="profile-avatar">M</div>
        <div className="profile-name">Master</div>
        <div className="profile-email">master@deltaV.io</div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{pastOrders}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Orders</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>3</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Favorites</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>2</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Addresses</div>
          </div>
        </div>
      </div>

      {menuItems.map((item, i) => (
        <div key={i} className="profile-menu-item">
          <div className="profile-menu-icon">{item.icon}</div>
          <div className="profile-menu-text">
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
          {Icons.chevronRight}
        </div>
      ))}

      <div style={{ textAlign: 'center', padding: 20, color: 'var(--gray2)', fontSize: 12 }}>
        App Version 1.0.0 • Made with ❤️
      </div>
    </div>
  );
};

// ============================================================
// REPLACE RESTAURANT DIALOG
// ============================================================
const ReplaceCartDialog = ({ onReplace, onCancel, newRestName, oldRestName }) => (
  <div className="overlay" onClick={onCancel}>
    <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
      <div className="sheet-handle" />
      <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔄</div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Replace cart items?</h3>
        <p style={{ fontSize: 13, color: 'var(--gray2)', lineHeight: 1.5 }}>
          Your cart has items from <strong>{oldRestName}</strong>. Do you want to clear it and add items from <strong>{newRestName}</strong>?
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 14, borderRadius: 12, border: '1.5px solid var(--gray3)',
            background: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--dark)'
          }}>Keep Current</button>
          <button onClick={onReplace} style={{
            flex: 1, padding: 14, borderRadius: 12, border: 'none',
            background: 'var(--zred)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit'
          }}>Replace</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [cartRestId, setCartRestId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [page, setPage] = useState('home'); // home | restaurant | cart | tracking
  const [orderTotal, setOrderTotal] = useState(0);
  const [pastOrders, setPastOrders] = useState(7);
  const [replaceDialog, setReplaceDialog] = useState(null);

  const addToCart = useCallback((item, restId) => {
    if (cartRestId && cartRestId !== restId && cart.length > 0) {
      const newRest = RESTAURANTS.find(r => r.id === restId);
      const oldRest = RESTAURANTS.find(r => r.id === cartRestId);
      setReplaceDialog({
        newRestId: restId,
        item,
        newRestName: newRest?.name,
        oldRestName: oldRest?.name,
      });
      return;
    }
    setCartRestId(restId);
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }, [cart, cartRestId]);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === itemId);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const newCart = prev.filter(c => c.id !== itemId);
        if (newCart.length === 0) setCartRestId(null);
        return newCart;
      }
      return prev.map(c => c.id === itemId ? { ...c, qty: c.qty - 1 } : c);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartRestId(null);
  }, []);

  const handleReplace = () => {
    if (replaceDialog) {
      clearCart();
      setCartRestId(replaceDialog.newRestId);
      setCart([{ ...replaceDialog.item, qty: 1 }]);
      setReplaceDialog(null);
    }
  };

  const handleCheckout = (total) => {
    setOrderTotal(total);
    setPage('tracking');
    setPastOrders(p => p + 1);
    clearCart();
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  // Tab changes
  useEffect(() => {
    if (tab === 'home') setPage('home');
    if (tab === 'search') setPage('search');
    if (tab === 'cart') setPage('cart');
    if (tab === 'profile') setPage('profile');
    setSelectedRestaurant(null);
  }, [tab]);

  const handleRestaurantClick = (r) => {
    setSelectedRestaurant(r);
    setPage('restaurant');
  };

  const renderPage = () => {
    if (page === 'tracking') {
      return <OrderTrackingPage orderTotal={orderTotal} onBackHome={() => { setPage('home'); setTab('home'); }} />;
    }
    if (page === 'restaurant' && selectedRestaurant) {
      return (
        <RestaurantPage
          restaurant={selectedRestaurant}
          onBack={() => { setPage(tab === 'search' ? 'search' : 'home'); setSelectedRestaurant(null); }}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          onViewCart={() => { setPage('cart'); setTab('cart'); }}
        />
      );
    }
    if (page === 'cart') {
      return (
        <CartPage
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          onBack={() => { setPage('home'); setTab('home'); }}
          onCheckout={handleCheckout}
          restaurantId={cartRestId}
        />
      );
    }
    if (page === 'search') {
      return <SearchPage onRestaurantClick={handleRestaurantClick} />;
    }
    if (page === 'profile') {
      return <ProfilePage pastOrders={pastOrders} />;
    }
    return (
      <HomePage
        onRestaurantClick={handleRestaurantClick}
        cart={cart}
      />
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {renderPage()}
        {page !== 'tracking' && (
          <BottomNav currentTab={tab} setTab={setTab} cartCount={cartCount} />
        )}
        {replaceDialog && (
          <ReplaceCartDialog
            onReplace={handleReplace}
            onCancel={() => setReplaceDialog(null)}
            newRestName={replaceDialog.newRestName}
            oldRestName={replaceDialog.oldRestName}
          />
        )}
      </div>
    </>
  );
}
