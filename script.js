// Traffic data simulation with improved error handling and memory management
const locations = {
    mumbai: { name: "Mumbai", lat: 19.0760, lng: 72.8777, icon: 'images/city.jpeg' },
    delhi: { name: "Delhi", lat: 28.6139, lng: 77.2090, icon: 'images/delhi.jpeg' },
    bengaluru: { name: "Bengaluru", lat: 12.9716, lng: 77.5946, icon: 'images/bengaluru.jpeg' },
    hyderabad: { name: "Hyderabad", lat: 17.3850, lng: 78.4867, icon: 'images/hyd.jpeg' },
    chennai: { name: "Chennai", lat: 13.0827, lng: 80.2707, icon: 'images/city.jpeg' },
    ahmedabad: { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, icon: 'images/city.jpeg' },
    kolkata: { name: "Kolkata", lat: 22.5726, lng: 88.3639, icon: 'images/city.jpeg' },
    surat: { name: "Surat", lat: 21.1702, lng: 72.8311, icon: 'images/city.jpeg' },
    pune: { name: "Pune", lat: 18.5204, lng: 73.8567, icon: 'images/city.jpeg' },
    jaipur: { name: "Jaipur", lat: 26.9124, lng: 75.7873, icon: 'images/city.jpeg' },
    lucknow: { name: "Lucknow", lat: 26.8467, lng: 80.9462, icon: 'images/city.jpeg' }
};

// Historical traffic data for major cities
const historicalTrafficData = {
    "Mumbai": { 2024: { trafficLevel: 85 } },
    "Delhi": { 2024: { trafficLevel: 88 } },
    "Bengaluru": { 2024: { trafficLevel: 82 } },
    "Hyderabad": { 2024: { trafficLevel: 78 } },
    "Chennai": { 2024: { trafficLevel: 75 } },
    "Ahmedabad": { 2024: { trafficLevel: 72 } },
    "Kolkata": { 2024: { trafficLevel: 80 } },
    "Surat": { 2024: { trafficLevel: 70 } },
    "Pune": { 2024: { trafficLevel: 76 } },
    "Jaipur": { 2024: { trafficLevel: 71 } },
    "Lucknow": { 2024: { trafficLevel: 73 } }
};

// Cache for historical traffic data with TTL
const historicalTrafficCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Simulated traffic data (updates every hour)
let trafficData = {};

// Initialize traffic data with error handling
function initializeTrafficData() {
    try {
        const areas = Object.keys(locations);
        areas.forEach(area => {
            const currentTraffic = Math.floor(Math.random() * 100);
            trafficData[area] = {
                trafficLevel: Math.max(0, Math.min(100, currentTraffic)),
                lastUpdate: new Date()
            };
        });
        updateTrafficDisplay();
    } catch (error) {
        console.error('Error initializing traffic data:', error);
    }
}

// Store interval ID for cleanup
let trafficUpdateInterval;

// Update traffic data with improved error handling
function updateTrafficData() {
    try {
        const areas = Object.keys(locations);
        areas.forEach(area => {
            const historicalData = historicalTrafficData[locations[area].name];
            const currentYear = new Date().getFullYear();
            const baseTraffic = historicalData?.[currentYear]?.trafficLevel || 50;
            
            // Add randomization around historical baseline
            const variation = Math.random() * 20 - 10; // ±10 variation
            const newTrafficLevel = Math.max(0, Math.min(100, baseTraffic + variation));
            
            trafficData[area] = {
                trafficLevel: newTrafficLevel,
                lastUpdate: new Date()
            };
        });
        updateTrafficDisplay();
    } catch (error) {
        console.error('Error updating traffic data:', error);
        // Stop interval if there's a critical error
        if (trafficUpdateInterval) {
            clearInterval(trafficUpdateInterval);
            trafficUpdateInterval = null;
        }
    }
}

// Improved cleanup function
function cleanup() {
    try {
        // Clear update interval
        if (trafficUpdateInterval) {
            clearInterval(trafficUpdateInterval);
            trafficUpdateInterval = null;
        }

        // Clear map container
        const mapContainer = document.getElementById('traffic-map');
        if (mapContainer) {
            while (mapContainer.firstChild) {
                mapContainer.removeChild(mapContainer.firstChild);
            }
        }

        // Clear traffic levels display
        const trafficLevelsDiv = document.getElementById('traffic-levels');
        if (trafficLevelsDiv) {
            while (trafficLevelsDiv.firstChild) {
                trafficLevelsDiv.removeChild(trafficLevelsDiv.firstChild);
            }
        }

        // Clear route details
        const routeDetails = document.getElementById('route-details');
        if (routeDetails) {
            while (routeDetails.firstChild) {
                routeDetails.removeChild(routeDetails.firstChild);
            }
        }

        // Clear data structures
        trafficData = {};
        historicalTrafficCache.clear();

        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// Initialize the system with error handling
try {
    initializeTrafficData();
    // Update traffic data every hour
    trafficUpdateInterval = setInterval(updateTrafficData, 3600000);
} catch (error) {
    console.error('Error during initialization:', error);
}

// Add event listeners for cleanup
window.addEventListener('unload', cleanup);
window.addEventListener('beforeunload', cleanup);

// Display traffic levels
function updateTrafficDisplay() {
    const trafficLevelsDiv = document.getElementById('traffic-levels');
    if (!trafficLevelsDiv) return;
    
    try {
        trafficLevelsDiv.innerHTML = '';

        Object.entries(trafficData).forEach(([area, data]) => {
            const trafficCard = document.createElement('div');
            trafficCard.className = `traffic-card ${getTrafficClass(data.trafficLevel)}`;
            trafficCard.innerHTML = `
                <h3>${locations[area].name}</h3>
                <p>Traffic Level: ${data.trafficLevel}%</p>
                <p>Last Updated: ${data.lastUpdate.toLocaleTimeString()}</p>
            `;
            trafficLevelsDiv.appendChild(trafficCard);
        });
    } catch (error) {
        console.error('Error updating traffic display:', error);
    }
}

function getTrafficClass(level) {
    if (level >= 70) return 'high-traffic';
    if (level >= 40) return 'medium-traffic';
    return 'low-traffic';
}

// Find the best route between two points
function findBestRoute() {
    const start = document.getElementById('start-location')?.value;
    const end = document.getElementById('end-location')?.value;

    if (!start || !end) {
        alert('Please select both starting point and destination');
        return;
    }

    if (start === end) {
        alert('Starting point and destination cannot be the same');
        return;
    }

    const route = calculateBestRoute(start, end);
    displayRoute(route);
}

// AI-based route calculation with historical data consideration
function calculateBestRoute(start, end) {
    try {
        const possibleRoutes = generatePossibleRoutes(start, end);
        if (!possibleRoutes || possibleRoutes.length === 0) {
            throw new Error('No valid routes found');
        }

        return possibleRoutes.reduce((best, current) => {
            const currentScore = evaluateRouteWithHistory(current);
            const bestScore = evaluateRouteWithHistory(best);
            return currentScore < bestScore ? current : best;
        });
    } catch (error) {
        console.error('Error calculating route:', error);
        return [start, end]; // Fallback to direct route
    }
}

// Enhanced route evaluation considering historical patterns
function evaluateRouteWithHistory(route) {
    try {
        if (!route || !Array.isArray(route) || route.length < 2) {
            throw new Error('Invalid route provided');
        }

        return route.reduce((score, point, index) => {
            if (index === route.length - 1) return score;
            
            const location = locations[point];
            if (!location) {
                throw new Error(`Invalid location point: ${point}`);
            }

            // Get current traffic level with proper fallback
            const currentTraffic = trafficData[point]?.trafficLevel ?? 50;
            
            // Consider historical traffic patterns with safe access
            const historicalWeight = 0.3; // 30% weight to historical data
            const currentWeight = 0.7; // 70% weight to current data
            
            let historicalScore = 50; // Default historical score
            
            try {
                const historicalData = historicalTrafficData[location.name];
                if (historicalData) {
                    const currentYear = new Date().getFullYear();
                    const yearData = historicalData[currentYear];
                    if (yearData?.trafficLevel != null) {
                        historicalScore = yearData.trafficLevel;
                    }
                }
            } catch (historyError) {
                console.warn(`Error accessing historical data for ${location.name}:`, historyError);
                // Continue with default historical score
            }
            
            // Calculate weighted score with bounds checking
            const weightedScore = Math.max(0, Math.min(100, 
                (currentTraffic * currentWeight) + (historicalScore * historicalWeight)
            ));

            return score + weightedScore;
        }, 0);
    } catch (error) {
        console.error('Error evaluating route:', error);
        return Infinity; // Return high score for invalid routes
    }
}

// Generate possible routes between two points
function generatePossibleRoutes(start, end) {
    const visited = new Set();
    const routes = [];

    function dfs(current, path) {
        if (path.length > 5) return; // Limit path length for performance
        if (current === end) {
            routes.push([...path]);
            return;
        }

        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                path.push(neighbor);
                dfs(neighbor, path);
                path.pop();
                visited.delete(neighbor);
            }
        }
    }

    visited.add(start);
    dfs(start, [start]);
    return routes;
}

// Get neighboring cities based on proximity
function getNeighbors(city) {
    const MAX_DISTANCE = 500; // Maximum distance in km for neighboring cities
    const neighbors = [];

    Object.keys(locations).forEach(otherCity => {
        if (otherCity !== city) {
            const distance = calculateDistance(
                locations[city].lat,
                locations[city].lng,
                locations[otherCity].lat,
                locations[otherCity].lng
            );
            if (distance <= MAX_DISTANCE) {
                neighbors.push(otherCity);
            }
        }
    });

    return neighbors;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

// Display the calculated route
function displayRoute(route) {
    if (!route || !Array.isArray(route)) {
        console.error('Invalid route data');
        return;
    }

    try {
        const mapContainer = document.getElementById('traffic-map');
        if (!mapContainer) return;

        mapContainer.innerHTML = '';

        // Add city markers
        route.forEach((point, index) => {
            const marker = document.createElement('div');
            marker.className = 'location-marker';
            marker.style.backgroundImage = `url(${locations[point]?.icon || 'images/city.jpeg'})`;
            marker.style.left = `${(index / (route.length - 1)) * 80 + 10}%`;
            marker.style.top = '50%';
            marker.style.transform = 'translate(-50%, -50%)';
            
            const tooltip = document.createElement('div');
            tooltip.className = 'city-tooltip';
            tooltip.innerHTML = `
                <strong>${locations[point]?.name || 'Unknown'}</strong>
                <div>Traffic: ${trafficData[point]?.trafficLevel || 'N/A'}%</div>
            `;
            marker.appendChild(tooltip);
            mapContainer.appendChild(marker);
        });

        // Add route lines between each pair of consecutive cities
        for (let i = 0; i < route.length - 1; i++) {
            const routeLine = document.createElement('div');
            routeLine.className = 'route-line';
            routeLine.style.left = `${(i / (route.length - 1)) * 80 + 10}%`;
            routeLine.style.width = `${80 / (route.length - 1)}%`;
            routeLine.style.top = '50%';
            mapContainer.appendChild(routeLine);
            
            // Trigger animation
            setTimeout(() => {
                routeLine.style.opacity = '1';
            }, 100 * (i + 1));
        }

        updateRouteDetails(route);
    } catch (error) {
        console.error('Error displaying route:', error);
    }
}

function updateTrafficDisplay() {
    const trafficLevelsDiv = document.getElementById('traffic-levels');
    if (!trafficLevelsDiv) return;
    
    try {
        trafficLevelsDiv.innerHTML = '';

        Object.entries(trafficData).forEach(([area, data], index) => {
            const trafficCard = document.createElement('div');
            trafficCard.className = `traffic-card ${getTrafficClass(data.trafficLevel)} fade-slide-in`;
            trafficCard.style.animationDelay = `${index * 0.1}s`;
            trafficCard.innerHTML = `
                <h3 class="glow-text">${locations[area].name}</h3>
                <p class="traffic-value">${data.trafficLevel}%</p>
                <p class="update-time">${data.lastUpdate.toLocaleTimeString()}</p>
            `;
            trafficLevelsDiv.appendChild(trafficCard);
        });
    } catch (error) {
        console.error('Error updating traffic display:', error);
    }
}

function updateRouteDetails(route) {
    const routeDetails = document.getElementById('route-details');
    if (!routeDetails) return;

    const routePath = routeDetails.querySelector('.route-path');
    const estimatedTime = routeDetails.querySelector('.estimated-time');
    const trafficCondition = routeDetails.querySelector('.traffic-condition');

    if (routePath) routePath.textContent = `Route: ${route.map(point => locations[point]?.name || 'Unknown').join(' → ')}`;
    if (estimatedTime) estimatedTime.textContent = `Estimated Time: ${calculateEstimatedTime(route)} minutes`;
    if (trafficCondition) trafficCondition.textContent = `Traffic Condition: ${getRouteTrafficDescription(route)}`;
}

// Calculate estimated time for the route
function calculateEstimatedTime(route) {
    const baseTime = 30; // Base time per segment in minutes
    let totalTime = 0;

    for (let i = 0; i < route.length - 1; i++) {
        const currentPoint = route[i];
        const nextPoint = route[i + 1];
        
        // Calculate distance between points
        const distance = calculateDistance(
            locations[currentPoint].lat,
            locations[currentPoint].lng,
            locations[nextPoint].lat,
            locations[nextPoint].lng
        );

        // Adjust time based on traffic and distance
        const trafficFactor = 1 + (trafficData[currentPoint]?.trafficLevel || 50) / 100;
        const segmentTime = (baseTime * (distance / 100)) * trafficFactor;
        
        totalTime += segmentTime;
    }

    return Math.round(totalTime);
}

// Get traffic description for the route
function getRouteTrafficDescription(route) {
    const avgTraffic = route.reduce((sum, point) => 
        sum + (trafficData[point]?.trafficLevel || 50), 0) / route.length;

    if (avgTraffic >= 70) return 'Heavy Traffic';
    if (avgTraffic >= 40) return 'Moderate Traffic';
    return 'Light Traffic';
}

// Update map visualization
function updateMapVisualization(route) {
    const mapContainer = document.getElementById('traffic-map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    try {
        mapContainer.innerHTML = '';

        // Create and add start point marker with tooltip
        const startPoint = document.createElement('div');
        startPoint.className = 'start-point-image location-marker';
        startPoint.style.backgroundImage = `url(${locations[route[0]]?.icon || 'images/city.jpeg'})`;
        const startTooltip = document.createElement('div');
        startTooltip.className = 'city-tooltip';
        startTooltip.innerHTML = `<strong>${locations[route[0]]?.name || 'Unknown'}</strong><br>Traffic: ${trafficData[route[0]]?.trafficLevel || 'N/A'}%`;
        startPoint.appendChild(startTooltip);
        mapContainer.appendChild(startPoint);

        // Create and add route line with animation
        const routeLine = document.createElement('div');
        routeLine.className = 'route-line gradient-line';
        
        // Calculate positions for route line
        const startRect = startPoint.getBoundingClientRect();
        const endRect = endPoint.getBoundingClientRect();
        const mapRect = mapContainer.getBoundingClientRect();
        
        // Position the route line
        const startX = startRect.left - mapRect.left + startRect.width / 2;
        const startY = startRect.top - mapRect.top + startRect.height / 2;
        const endX = endRect.left - mapRect.left + endRect.width / 2;
        const endY = endRect.top - mapRect.top + endRect.height / 2;
        
        // Calculate line length and angle
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        // Apply positioning styles
        routeLine.style.width = `${length}px`;
        routeLine.style.left = `${startX}px`;
        routeLine.style.top = `${startY}px`;
        routeLine.style.transform = `rotate(${angle}deg)`;
        
        mapContainer.appendChild(routeLine);
        
        // Animate the line
        setTimeout(() => {
            routeLine.style.opacity = '1';
        }, 300);

        // Create and add end point marker with tooltip
        const endPoint = document.createElement('div');
        endPoint.className = 'end-point-image location-marker';
        endPoint.style.backgroundImage = `url(${locations[route[route.length - 1]]?.icon || 'images/city.jpeg'})`;
        const endTooltip = document.createElement('div');
        endTooltip.className = 'city-tooltip';
        endTooltip.innerHTML = `<strong>${locations[route[route.length - 1]]?.name || 'Unknown'}</strong><br>Traffic: ${trafficData[route[route.length - 1]]?.trafficLevel || 'N/A'}%`;
        endPoint.appendChild(endTooltip);
        mapContainer.appendChild(endPoint);

        // Add intermediate points with tooltips and animations
        for (let i = 1; i < route.length - 1; i++) {
            const intermediatePoint = document.createElement('div');
            intermediatePoint.className = 'intermediate-point location-marker';
            intermediatePoint.style.backgroundImage = `url(${locations[route[i]]?.icon || 'images/city.jpeg'})`;
            intermediatePoint.style.left = `${(i / (route.length - 1)) * 100}%`;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'city-tooltip';
            tooltip.innerHTML = `<strong>${locations[route[i]]?.name || 'Unknown'}</strong><br>Traffic: ${trafficData[route[i]]?.trafficLevel || 'N/A'}%`;
            intermediatePoint.appendChild(tooltip);
            
            mapContainer.appendChild(intermediatePoint);
        }
    } catch (error) {
        console.error('Error updating map visualization:', error);
        mapContainer.innerHTML = '<div class="error-message">Error displaying route map</div>';
    }
}