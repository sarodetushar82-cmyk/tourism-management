/**
 * Seed data for Tourism Management System
 * Used for both MySQL auto-population and fallback store
 */

const defaultAdmins = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@tourism.com',
    password: '$2b$10$IQFe.wQ1OSkulssJSF1SdeqThgoFEAt3SPOss9BWnhx1tw6WmWHt2', // admin123
    role: 'admin',
    created_at: new Date().toISOString()
  }
];

const defaultUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    password: '$2b$10$AZ5oRJQx.veHPzEAoY5ssu/0RhrNyroPPt2ANDE8i0uGFauauRkAy', // user123
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9811223344',
    password: '$2b$10$AZ5oRJQx.veHPzEAoY5ssu/0RhrNyroPPt2ANDE8i0uGFauauRkAy', // user123
    created_at: new Date().toISOString()
  }
];

const defaultDestinations = [
  {
    id: 1,
    name: 'Goa',
    location: 'Goa, Western India',
    short_desc: 'Sun-kissed tropical beaches, vibrant Portuguese heritage, and world-famous coastal nightlife.',
    detailed_desc: 'Goa is India’s premier beach destination, celebrated for its sun-drenched golden coastlines, historic 16th-century Portuguese architecture, spicy coastal cuisine, and pulsating beach nightlife. Whether relaxing in North Goa beach shacks or savoring peaceful South Goa resorts, it offers unmatched tropical vacation memories.',
    approx_cost: 15000.00,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    best_time: 'November to February',
    attractions: 'Baga Beach, Fort Aguada, Basilica of Bom Jesus, Dudhsagar Falls, Anjuna Flea Market',
    activities: 'Scuba Diving, Parasailing, Sunset Cruise, Beach Parties, Spice Plantation Tours',
    travel_info: 'Nearest Airport: Dabolim & Mopa (GOX). Well connected by Konkan Railway and national highways.',
    is_popular: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Manali',
    location: 'Himachal Pradesh, North India',
    short_desc: 'Breathtaking snow-capped Himalayan peaks, roaring rivers, and adventure sports galore.',
    detailed_desc: 'Perched high in the picturesque Beas River Valley, Manali is a magnetic mountain retreat for nature lovers and adrenaline enthusiasts. From snow-clad Rohtang Pass to Solang Valley sports and peaceful cedar forests in Old Manali, it captures the magical essence of Himachal Pradesh.',
    approx_cost: 18000.00,
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    best_time: 'October to June',
    attractions: 'Rohtang Pass, Solang Valley, Hadimba Temple, Jogini Waterfall, Old Manali Cafes',
    activities: 'Paragliding, River Rafting, Skiing, Snowboarding, Trekking & Mountain Biking',
    travel_info: 'Nearest Airport: Bhuntar (Kullu - 50 km). Luxury sleeper buses operate daily from Delhi & Chandigarh.',
    is_popular: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Kashmir',
    location: 'Jammu & Kashmir, North India',
    short_desc: 'The legendary Paradise on Earth with pristine Dal Lake, shikaras, and pine valleys.',
    detailed_desc: 'Referred to by poets as Heaven on Earth, Kashmir enchants with serene Dal Lake houseboats, colorful blooming Mughal gardens, rolling alpine meadows of Gulmarg, and gushing streams in Pahalgam. Experience unmatched Himalayan tranquility and authentic Kashmiri hospitality.',
    approx_cost: 24000.00,
    image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
    best_time: 'April to October (Winter for Snow)',
    attractions: 'Dal Lake, Gulmarg Gondola, Betaab Valley, Shalimar Bagh, Sonamarg Glacier',
    activities: 'Shikara Boat Rides, Gondola Cable Car, Skiing, River Trout Fishing, Apple Orchard Visits',
    travel_info: 'Nearest Airport: Srinagar International Airport (SXR). Direct flights from Delhi, Mumbai & Bangalore.',
    is_popular: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Jaipur',
    location: 'Rajasthan, Western India',
    short_desc: 'The imperial Pink City filled with grand forts, royal palaces, and vibrant bazaars.',
    detailed_desc: 'Jaipur, the capital of Rajasthan, forms India’s famed Golden Triangle. Known for its distinct terracotta-pink walls, magnificent hilltop forts like Amer Fort, intricate honeycomb facade of Hawa Mahal, and royal courtyards, Jaipur is a glorious dive into royal Indian history.',
    approx_cost: 12000.00,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    best_time: 'October to March',
    attractions: 'Hawa Mahal, Amer Fort, City Palace, Jantar Mantar, Nahargarh Fort, Johari Bazaar',
    activities: 'Elephant Village Experience, Heritage Walks, Rajasthani Folk Dance, Camel Rides, Handcraft Shopping',
    travel_info: 'Nearest Airport: Jaipur International Airport (JAI). Excellent high-speed train connections from Delhi.',
    is_popular: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Kerala',
    location: 'South India',
    short_desc: 'God’s Own Country with tranquil emerald backwaters, tea plantations, and ayurveda.',
    detailed_desc: 'Famed for its palm-fringed backwaters of Alleppey, misty rolling green tea hills of Munnar, serene Arabian Sea beaches in Kovalam, and age-old Ayurvedic wellness traditions. Kerala is a tranquil, lush sanctuary that rejuvenates the soul.',
    approx_cost: 21000.00,
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    best_time: 'September to March',
    attractions: 'Alleppey Backwaters, Munnar Tea Gardens, Periyar National Park, Athirappilly Falls, Fort Kochi',
    activities: 'Overnight Houseboat Cruise, Tea Tasting, Kathakali Dance Shows, Wildlife Safari, Ayurvedic Massages',
    travel_info: 'Nearest Airports: Cochin (COK), Trivandrum (TRV). Extensive rail network across all districts.',
    is_popular: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Mumbai',
    location: 'Maharashtra, West Coast',
    short_desc: 'The vibrant City of Dreams, historic colonial landmarks, and dazzling Arabian sea coast.',
    detailed_desc: 'Mumbai is India’s financial and entertainment capital. A vibrant metropolis of boundless energy, it blends majestic British Victorian architecture, the glamour of Bollywood, peaceful sunsets at Marine Drive, and famous street food like Vada Pav and Pav Bhaji.',
    approx_cost: 14000.00,
    image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    best_time: 'November to February',
    attractions: 'Gateway of India, Marine Drive Queen’s Necklace, Elephanta Caves, CSMT Station, Colaba Causeway',
    activities: 'Ferry to Elephanta Island, Bollywood Studio Tour, Sunset at Bandra Bandstand, Street Food Crawl',
    travel_info: 'Nearest Airport: Chhatrapati Shivaji Maharaj International (BOM). Prime junction for Indian Railways.',
    is_popular: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Delhi',
    location: 'National Capital Region',
    short_desc: 'The historic Heart of India, where millennia of empires meet modern cosmopolitan life.',
    detailed_desc: 'Delhi seamlessly bridges ancient historical eras with modern metropolis charm. Marvel at monumental Mughal architecture like Red Fort and Humayun’s Tomb, experience spiritual serenity at the Lotus Temple, and explore bustling heritage alleys of Chandni Chowk.',
    approx_cost: 11000.00,
    image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    best_time: 'October to March',
    attractions: 'India Gate, Red Fort, Qutub Minar, Lotus Temple, Akshardham, Chandni Chowk',
    activities: 'Rickshaw Food Safari, Heritage Monument Tours, Sound & Light Shows, Dilli Haat Shopping',
    travel_info: 'Nearest Airport: Indira Gandhi International Airport (DEL). World-class modern Delhi Metro system.',
    is_popular: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Rajasthan',
    location: 'Western India',
    short_desc: 'Land of Royal Maharajas, golden desert dunes of Jaisalmer, and romantic Udaipur lakes.',
    detailed_desc: 'The regal heartland of India unfolds across majestic desert citadels, romantic shimmering lake palaces in Udaipur, and golden sands in Jaisalmer. Experience camel safaris under starlit desert skies and the enduring chivalry of Rajput culture.',
    approx_cost: 26000.00,
    image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    best_time: 'October to March',
    attractions: 'Lake Pichola Udaipur, Jaisalmer Golden Fort, Mehrangarh Fort Jodhpur, Pushkar Lake, Thar Desert',
    activities: 'Thar Desert Safari & Camping, Royal Heritage Palace Stays, Hot Air Ballooning, Cultural Music Nights',
    travel_info: 'Key Airports: Udaipur (UDR), Jodhpur (JDH). Well connected by luxury tourist trains like Palace on Wheels.',
    is_popular: 1,
    created_at: new Date().toISOString()
  }
];

const defaultPackages = [
  {
    id: 1,
    destination_id: 1,
    package_name: 'Goa Tropical Beach Escapade',
    destination_name: 'Goa',
    duration_days: 4,
    duration_nights: 3,
    price: 14999.00,
    included_services: '4-Star Beach Resort, Daily Buffet Breakfast, North & South Goa Sightseeing AC Cab, Sunset River Cruise, Airport Transfers',
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    is_featured: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    destination_id: 2,
    package_name: 'Manali Snow & Adventure Explorer',
    destination_name: 'Manali',
    duration_days: 5,
    duration_nights: 4,
    price: 18499.00,
    included_services: 'Deluxe Mountain View Hotel, Breakfast & Dinner, Rohtang Pass & Solang Valley Permit, River Rafting Session, Delhi-Manali Volvo',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    is_featured: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    destination_id: 3,
    package_name: 'Kashmir Heavenly Paradise Tour',
    destination_name: 'Kashmir',
    duration_days: 6,
    duration_nights: 5,
    price: 25999.00,
    included_services: 'Premium Dal Lake Houseboat Stay, 4-Star Hotels, All Meals (MAP Plan), Gulmarg Gondola Phase 1 Ticket, Shikara Ride, Private SUV',
    image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
    is_featured: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    destination_id: 4,
    package_name: 'Royal Jaipur Heritage & Culture Tour',
    destination_name: 'Jaipur',
    duration_days: 3,
    duration_nights: 2,
    price: 11999.00,
    included_services: 'Heritage Haveli Hotel, Breakfast & Rajasthani Dinner, Guided Fort Tours, Elephant Village Entry, Chokhi Dhani Cultural Night',
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    is_featured: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    destination_id: 5,
    package_name: 'Kerala Backwaters & Tea Hills Special',
    destination_name: 'Kerala',
    duration_days: 6,
    duration_nights: 5,
    price: 22499.00,
    included_services: 'Munnar Luxury Hill Resort, Alleppey Private Houseboat Cruise, All Meals on Houseboat, Periyar Wildlife Boat Safari, AC Sedan',
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    is_featured: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    destination_id: 6,
    package_name: 'Mumbai City Lights & Coastal Charm',
    destination_name: 'Mumbai',
    duration_days: 3,
    duration_nights: 2,
    price: 13499.00,
    included_services: 'South Mumbai 4-Star Hotel, Breakfast, Elephanta Ferry & Guide, Bollywood Tour, Private AC Transport',
    image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    is_featured: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    destination_id: 7,
    package_name: 'Delhi Golden Heritage Weekend',
    destination_name: 'Delhi',
    duration_days: 3,
    duration_nights: 2,
    price: 9999.00,
    included_services: 'Central City Hotel, Breakfast, All Monument Fast-Track Tickets, Chandni Chowk Food Tour, Guided AC Sedan',
    image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    is_featured: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    destination_id: 8,
    package_name: 'Royal Rajasthan Imperial Grandeur',
    destination_name: 'Rajasthan',
    duration_days: 7,
    duration_nights: 6,
    price: 29999.00,
    included_services: 'Heritage Palace Hotels, Thar Desert Luxury Tent Camping, Camel Safari, Folk Dance with Bonfire, Private SUV with English Driver',
    image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    is_featured: 1,
    created_at: new Date().toISOString()
  }
];

const defaultBookings = [
  {
    id: 1,
    booking_ref: 'TRV-2026-901',
    user_id: 1,
    package_id: 1,
    destination_id: 1,
    user_name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    destination_name: 'Goa',
    package_name: 'Goa Tropical Beach Escapade',
    travel_date: '2026-11-15',
    travelers_count: 2,
    total_price: 29998.00,
    special_requests: 'Beach-facing room requested with late check-in.',
    status: 'Confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    booking_ref: 'TRV-2026-902',
    user_id: 1,
    package_id: 3,
    destination_id: 3,
    user_name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    destination_name: 'Kashmir',
    package_name: 'Kashmir Heavenly Paradise Tour',
    travel_date: '2026-12-20',
    travelers_count: 2,
    total_price: 51998.00,
    special_requests: 'Vegetarian Kashmiri Wazwan meal preference.',
    status: 'Pending',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    booking_ref: 'TRV-2026-903',
    user_id: 2,
    package_id: 5,
    destination_id: 5,
    user_name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9811223344',
    destination_name: 'Kerala',
    package_name: 'Kerala Backwaters & Tea Hills Special',
    travel_date: '2026-09-10',
    travelers_count: 4,
    total_price: 89996.00,
    special_requests: 'Family trip, need 2 connected bedrooms on houseboat.',
    status: 'Completed',
    created_at: new Date().toISOString()
  }
];

const defaultReviews = [
  {
    id: 1,
    user_name: 'Aarav Mehta',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    destination_name: 'Kashmir',
    rating: 5,
    comment: 'The Kashmir Heavenly Paradise tour was completely surreal! Dal Lake houseboat was magnificent and the Gondola ride in Gulmarg was breathtaking. 10/10 service!',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    user_name: 'Sneha Roy',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    destination_name: 'Goa',
    rating: 5,
    comment: 'Booking our Goa holiday was seamless and smooth. The hotel was superb, beachfront, and the river cruise was full of fun. Highly recommended!',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    user_name: 'Vikramaditya Rao',
    user_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    destination_name: 'Kerala',
    rating: 5,
    comment: 'God’s Own Country truly lived up to its name. The Alleppey houseboat and Munnar tea gardens felt out of a dream. Our guide was extremely polite and helpful.',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    user_name: 'Neha Sen',
    user_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    destination_name: 'Jaipur',
    rating: 4,
    comment: 'Wonderful heritage experience in Jaipur! The palace guides were knowledgeable and the royal dinner at Chokhi Dhani was unforgettable.',
    created_at: new Date().toISOString()
  }
];

const defaultContactMessages = [
  {
    id: 1,
    name: 'Rahul Verma',
    email: 'rahul@gmail.com',
    phone: '+91 9988776655',
    subject: 'Customized Honeymoon Package to Kashmir',
    message: 'Hello, do you offer customized photography services and luxury flower decoration for Dal Lake houseboats?',
    status: 'Unread',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Ananya Gupta',
    email: 'ananya.g@yahoo.com',
    phone: '+91 9871122334',
    subject: 'Corporate Group Tour Query for Goa',
    message: 'We have a group of 25 colleagues planning an annual retreat in Goa. Could you send group discount quotes?',
    status: 'Read',
    created_at: new Date().toISOString()
  }
];

module.exports = {
  defaultAdmins,
  defaultUsers,
  defaultDestinations,
  defaultPackages,
  defaultBookings,
  defaultReviews,
  defaultContactMessages
};
