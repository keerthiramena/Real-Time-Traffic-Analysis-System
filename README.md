# Rajahmundry Traffic Management System

This is a web-based AI-powered traffic management system that helps users find the best route between major Indian cities based on current and historical traffic data.

## 🚀 Features

- Interactive UI to select starting and ending cities.
- Real-time traffic simulation with historical data consideration.
- AI-based best route recommendation using dynamic scoring.
- Visual route map with city icons and traffic levels.
- Animated traffic cards with light/medium/heavy indicators.
- Fully responsive and styled interface using CSS animations.

## 🗂 Project Structure
├── index.html # Main HTML page
├── styles.css # Styling and layout
├── script.js # Traffic logic and route visualization
├── settings.json # Development settings (Live Server port)
└── images/ # Folder for city and traffic icons (expected)

## ⚙️ How It Works

- `script.js` initializes traffic data and updates it hourly.
- Routes are evaluated using a mix of current and historical traffic levels.
- The best route is displayed with visual markers and tooltips.
- All UI updates and animations are handled using vanilla JavaScript and CSS.

## 🖼 Assets Required

Ensure the following assets are present in an `images/` directory:
- `background.jpg`
- `traffic-light.png`
- City icons like `city.jpeg`, `hyd.jpeg`, `bengaluru.jpeg`, etc.

## 🛠 Development

This project uses **Live Server** for local development.

### Recommended Setup

1. Open the folder in VS Code.
2. Install the Live Server extension.
3. The app runs on port **5501** as per `settings.json`.
4. Right-click `index.html` → "Open with Live Server".

## ✅ Dependencies

- No external libraries required.
- Fully built with **HTML**, **CSS**, and **Vanilla JavaScript**.

## 📌 Notes

- The routing algorithm is limited to paths of length ≤ 5 for performance.
- You can expand city connections or import external APIs for real data in future versions.

---

© 2025 Rajahmundry Traffic AI Project
