// Delivery Partner & Map Geo-spatial dataset

export const RESTAURANT_ORIGIN = {
  id: 'rest-origin',
  name: 'NOCTURNE Flagship Kitchen & Cellar',
  owner: 'Saurabh Kumar',
  email: 'saurabh@123gmail.com',
  phone: '+91 98765 43210',
  address: 'Plot 12, Royal Crescent, Connaught Place, New Delhi',
  hub: 'Central Kitchen Hub #01',
  coords: { x: 38, y: 55, lat: 28.6315, lng: 77.2167 }
};

export const DELIVERY_PARTNERS = [
  {
    id: 'DP-01',
    name: 'Vikram Singh',
    phone: '+91 98112 34567',
    email: 'delivery@nocturne.com',
    vehicle: 'Nocturne Express EV (DL-09-EV-4412)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    rating: 4.9,
    tripsCompleted: 342,
    status: 'ACTIVE', // 'ACTIVE' | 'ON_TRIP' | 'OFFLINE'
    currentLocation: { x: 44, y: 50, lat: 28.6250, lng: 77.2210 }
  },
  {
    id: 'DP-02',
    name: 'Rahul Sharma',
    phone: '+91 98223 45678',
    email: 'rahul.delivery@nocturne.com',
    vehicle: 'Gourmet Courier Bike (DL-04-BK-8921)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 4.8,
    tripsCompleted: 219,
    status: 'ACTIVE',
    currentLocation: { x: 58, y: 42, lat: 28.5850, lng: 77.2340 }
  },
  {
    id: 'DP-03',
    name: 'Amit Verma',
    phone: '+91 98334 56789',
    email: 'amit.fleet@nocturne.com',
    vehicle: 'Luxury Thermal Pod Scooter (DL-07-SC-1102)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 4.9,
    tripsCompleted: 480,
    status: 'ACTIVE',
    currentLocation: { x: 32, y: 62, lat: 28.6410, lng: 77.2050 }
  }
];

export const PRESET_DELIVERY_HUBS = [
  {
    id: 'hub-1',
    area: 'South Extension II',
    city: 'New Delhi',
    address: 'Block E-14, South Extension Part II, New Delhi',
    distanceKm: 4.2,
    estimatedMinutes: 22,
    coords: { x: 55, y: 72, lat: 28.5672, lng: 77.2215 }
  },
  {
    id: 'hub-2',
    area: 'Vasant Vihar',
    city: 'South West Delhi',
    address: 'Villa 28, Basant Lok, Vasant Vihar, New Delhi',
    distanceKm: 6.8,
    estimatedMinutes: 28,
    coords: { x: 25, y: 78, lat: 28.5603, lng: 77.1587 }
  },
  {
    id: 'hub-3',
    area: 'Golf Course Road, DLF CyberCity',
    city: 'Gurugram',
    address: 'Tower 8, The Camellias, Golf Course Rd, Gurugram',
    distanceKm: 14.5,
    estimatedMinutes: 38,
    coords: { x: 18, y: 88, lat: 28.4815, lng: 77.0982 }
  },
  {
    id: 'hub-4',
    area: 'Civil Lines Heritage',
    city: 'North Delhi',
    address: '14 Sham Nath Marg, Civil Lines, Delhi',
    distanceKm: 5.1,
    estimatedMinutes: 24,
    coords: { x: 42, y: 28, lat: 28.6812, lng: 77.2234 }
  },
  {
    id: 'hub-5',
    area: 'Noida Sector 44 (Expressway)',
    city: 'Noida',
    address: 'Penthouse B, Sector 44, Expressway, Noida',
    distanceKm: 11.2,
    estimatedMinutes: 32,
    coords: { x: 82, y: 64, lat: 28.5492, lng: 77.3412 }
  },
  {
    id: 'hub-6',
    area: 'Mayfair Presidential Suites',
    city: 'Central Delhi',
    address: '742 Evergreen Terrace, Penthouse B, Central Delhi',
    distanceKm: 2.8,
    estimatedMinutes: 16,
    coords: { x: 62, y: 45, lat: 28.6180, lng: 77.2400 }
  }
];
