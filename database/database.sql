-- =======================================================
-- TOURISM MANAGEMENT SYSTEM - DATABASE SCHEMA & SEED DATA
-- Database Name: tourism_management
-- =======================================================

CREATE DATABASE IF NOT EXISTS `tourism_management` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `tourism_management`;

-- -------------------------------------------------------
-- 1. Table: users
-- -------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `tour_packages`;
DROP TABLE IF EXISTS `destinations`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 2. Table: admins
-- -------------------------------------------------------
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 3. Table: destinations
-- -------------------------------------------------------
CREATE TABLE `destinations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `short_desc` TEXT NOT NULL,
  `detailed_desc` LONGTEXT NOT NULL,
  `approx_cost` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `best_time` VARCHAR(100) NOT NULL,
  `attractions` TEXT NOT NULL,
  `activities` TEXT NOT NULL,
  `travel_info` TEXT NOT NULL,
  `is_popular` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 4. Table: tour_packages
-- -------------------------------------------------------
CREATE TABLE `tour_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `destination_id` INT NULL,
  `package_name` VARCHAR(150) NOT NULL,
  `destination_name` VARCHAR(100) NOT NULL,
  `duration_days` INT NOT NULL,
  `duration_nights` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `included_services` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_packages_destination` FOREIGN KEY (`destination_id`) 
    REFERENCES `destinations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 5. Table: bookings
-- -------------------------------------------------------
CREATE TABLE `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_ref` VARCHAR(20) NOT NULL UNIQUE,
  `user_id` INT NULL,
  `package_id` INT NULL,
  `destination_id` INT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `destination_name` VARCHAR(100) NOT NULL,
  `package_name` VARCHAR(150) NOT NULL,
  `travel_date` DATE NOT NULL,
  `travelers_count` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(10,2) NOT NULL,
  `special_requests` TEXT,
  `status` ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_package` FOREIGN KEY (`package_id`) 
    REFERENCES `tour_packages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 6. Table: contact_messages
-- -------------------------------------------------------
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20),
  `subject` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Unread', 'Read', 'Resolved') DEFAULT 'Unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 7. Table: reviews
-- -------------------------------------------------------
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_name` VARCHAR(100) NOT NULL,
  `user_avatar` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  `destination_name` VARCHAR(100) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- SAMPLE SEED DATA
-- =======================================================

-- Admin user (Password: admin123)
INSERT INTO `admins` (`name`, `email`, `password`, `role`) VALUES
('Administrator', 'admin@tourism.com', '$2b$10$IQFe.wQ1OSkulssJSF1SdeqThgoFEAt3SPOss9BWnhx1tw6WmWHt2', 'admin');

-- Regular user (Password: user123)
INSERT INTO `users` (`name`, `email`, `phone`, `password`) VALUES
('John Doe', 'john@example.com', '+91 9876543210', '$2b$10$AZ5oRJQx.veHPzEAoY5ssu/0RhrNyroPPt2ANDE8i0uGFauauRkAy'),
('Priya Sharma', 'priya@example.com', '+91 9811223344', '$2b$10$AZ5oRJQx.veHPzEAoY5ssu/0RhrNyroPPt2ANDE8i0uGFauauRkAy');

-- Sample Destinations
INSERT INTO `destinations` (`id`, `name`, `location`, `short_desc`, `detailed_desc`, `approx_cost`, `image_url`, `best_time`, `attractions`, `activities`, `travel_info`, `is_popular`) VALUES
(1, 'Goa', 'Goa, Western India', 'Sun-kissed tropical beaches, vibrant Portuguese heritage, and world-famous coastal nightlife.', 'Goa is India’s premier beach destination, celebrated for its sun-drenched golden coastlines, historic 16th-century Portuguese architecture, spicy coastal cuisine, and pulsating beach nightlife. Whether relaxing in North Goa beach shacks or savoring peaceful South Goa resorts, it offers unmatched tropical vacation memories.', 15000.00, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', 'November to February', 'Baga Beach, Fort Aguada, Basilica of Bom Jesus, Dudhsagar Falls, Anjuna Flea Market', 'Scuba Diving, Parasailing, Sunset Cruise, Beach Parties, Spice Plantation Tours', 'Nearest Airport: Dabolim & Mopa (GOX). Well connected by Konkan Railway and national highways.', 1),

(2, 'Manali', 'Himachal Pradesh, North India', 'Breathtaking snow-capped Himalayan peaks, roaring rivers, and adventure sports galore.', 'Perched high in the picturesque Beas River Valley, Manali is a magnetic mountain retreat for nature lovers and adrenaline enthusiasts. From snow-clad Rohtang Pass to Solang Valley sports and peaceful cedar forests in Old Manali, it captures the magical essence of Himachal Pradesh.', 18000.00, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80', 'October to June', 'Rohtang Pass, Solang Valley, Hadimba Temple, Jogini Waterfall, Old Manali Cafes', 'Paragliding, River Rafting, Skiing, Snowboarding, Trekking & Mountain Biking', 'Nearest Airport: Bhuntar (Kullu - 50 km). Luxury sleeper buses operate daily from Delhi & Chandigarh.', 1),

(3, 'Kashmir', 'Jammu & Kashmir, North India', 'The legendary Paradise on Earth with pristine Dal Lake, shikaras, and pine valleys.', 'Referred to by poets as Heaven on Earth, Kashmir enchants with serene Dal Lake houseboats, colorful blooming Mughal gardens, rolling alpine meadows of Gulmarg, and gushing streams in Pahalgam. Experience unmatched Himalayan tranquility and authentic Kashmiri hospitality.', 24000.00, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80', 'April to October (Winter for Snow)', 'Dal Lake, Gulmarg Gondola, Betaab Valley, Shalimar Bagh, Sonamarg Glacier', 'Shikara Boat Rides, Gondola Cable Car, Skiing, River Trout Fishing, Apple Orchard Visits', 'Nearest Airport: Srinagar International Airport (SXR). Direct flights from Delhi, Mumbai & Bangalore.', 1),

(4, 'Jaipur', 'Rajasthan, Western India', 'The imperial Pink City filled with grand forts, royal palaces, and vibrant bazaars.', 'Jaipur, the capital of Rajasthan, forms India’s famed Golden Triangle. Known for its distinct terracotta-pink walls, magnificent hilltop forts like Amer Fort, intricate honeycomb facade of Hawa Mahal, and royal courtyards, Jaipur is a glorious dive into royal Indian history.', 12000.00, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80', 'October to March', 'Hawa Mahal, Amer Fort, City Palace, Jantar Mantar, Nahargarh Fort, Johari Bazaar', 'Elephant Village Experience, Heritage Walks, Rajasthani Folk Dance, Camel Rides, Handcraft Shopping', 'Nearest Airport: Jaipur International Airport (JAI). Excellent high-speed train connections from Delhi.', 1),

(5, 'Kerala', 'South India', 'God’s Own Country with tranquil emerald backwaters, tea plantations, and ayurveda.', 'Famed for its palm-fringed backwaters of Alleppey, misty rolling green tea hills of Munnar, serene Arabian Sea beaches in Kovalam, and age-old Ayurvedic wellness traditions. Kerala is a tranquil, lush sanctuary that rejuvenate the soul.', 21000.00, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80', 'September to March', 'Alleppey Backwaters, Munnar Tea Gardens, Periyar National Park, Athirappilly Falls, Fort Kochi', 'Overnight Houseboat Cruise, Tea Tasting, Kathakali Dance Shows, Wildlife Safari, Ayurvedic Massages', 'Nearest Airports: Cochin (COK), Trivandrum (TRV). Extensive rail network across all districts.', 1),

(6, 'Mumbai', 'Maharashtra, West Coast', 'The vibrant City of Dreams, historic colonial landmarks, and dazzling Arabian sea coast.', 'Mumbai is India’s financial and entertainment capital. A vibrant metropolis of boundless energy, it blends majestic British Victorian architecture, the glamour of Bollywood, peaceful sunsets at Marine Drive, and famous street food like Vada Pav and Pav Bhaji.', 14000.00, 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80', 'November to February', 'Gateway of India, Marine Drive Queen’s Necklace, Elephanta Caves, Chhatrapati Shivaji Maharaj Terminus, Colaba Causeway', 'Ferry to Elephanta Island, Bollywood Studio Tour, Sunset at Bandra Bandstand, Street Food Crawl', 'Nearest Airport: Chhatrapati Shivaji Maharaj International (BOM). Prime junction for Indian Railways.', 0),

(7, 'Delhi', 'National Capital Region', 'The historic Heart of India, where millennia of empires meet modern cosmopolitan life.', 'Delhi seamlessly bridges ancient historical eras with modern metropolis charm. Marvel at monumental Mughal architecture like Red Fort and Humayun’s Tomb, experience spiritual serenity at the Lotus Temple, and explore bustling heritage alleys of Chandni Chowk.', 11000.00, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80', 'October to March', 'India Gate, Red Fort, Qutub Minar, Lotus Temple, Akshardham, Chandni Chowk', 'Rickshaw Food Safari, Heritage Monument Tours, Sound & Light Shows, Dilli Haat Shopping', 'Nearest Airport: Indira Gandhi International Airport (DEL). World-class modern Delhi Metro system.', 0),

(8, 'Rajasthan', 'Western India', 'Land of Royal Maharajas, golden desert dunes of Jaisalmer, and romantic Udaipur lakes.', 'The regal heartland of India unfolds across majestic desert citadels, romantic shimmering lake palaces in Udaipur, and golden sands in Jaisalmer. Experience camel safaris under starlit desert skies and the enduring chivalry of Rajput culture.', 26000.00, 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80', 'October to March', 'Lake Pichola Udaipur, Jaisalmer Golden Fort, Mehrangarh Fort Jodhpur, Pushkar Lake, Thar Desert', 'Thar Desert Safari & Camping, Royal Heritage Palace Stays, Hot Air Ballooning, Cultural Music Nights', 'Key Airports: Udaipur (UDR), Jodhpur (JDH). Well connected by luxury tourist trains like Palace on Wheels.', 1);

-- Sample Tour Packages
INSERT INTO `tour_packages` (`id`, `destination_id`, `package_name`, `destination_name`, `duration_days`, `duration_nights`, `price`, `included_services`, `image_url`, `is_featured`) VALUES
(1, 1, 'Goa Tropical Beach Escapade', 'Goa', 4, 3, 14999.00, '4-Star Beach Resort, Daily Buffet Breakfast, North & South Goa Sightseeing AC Cab, Sunset River Cruise, Airport Transfers', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', 1),

(2, 2, 'Manali Snow & Adventure Explorer', 'Manali', 5, 4, 18499.00, 'Deluxe Mountain View Hotel, Breakfast & Dinner, Rohtang Pass & Solang Valley Permit, River Rafting Session, Delhi-Manali Volvo', 1),

(3, 3, 'Kashmir Heavenly Paradise Tour', 'Kashmir', 6, 5, 25999.00, 'Premium Dal Lake Houseboat Stay, 4-Star Hotels, All Meals (MAP Plan), Gulmarg Gondola Phase 1 Ticket, Shikara Ride, Private SUV', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80', 1),

(4, 4, 'Royal Jaipur Heritage & Culture Tour', 'Jaipur', 3, 2, 11999.00, 'Heritage Haveli Hotel, Breakfast & Rajasthani Dinner, Guided Fort Tours, Elephant Village Entry, Chokhi Dhani Cultural Night', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80', 0),

(5, 5, 'Kerala Backwaters & Tea Hills Special', 'Kerala', 6, 5, 22499.00, 'Munnar Luxury Hill Resort, Alleppey Private Houseboat Cruise, All Meals on Houseboat, Periyar Wildlife Boat Safari, AC Sedan', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80', 1),

(6, 6, 'Mumbai City Lights & Coastal Charm', 'Mumbai', 3, 2, 13499.00, 'South Mumbai 4-Star Hotel, Breakfast, Elephanta Ferry & Guide, Bollywood Tour, Private AC Transport', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80', 0),

(7, 7, 'Delhi Golden Heritage Weekend', 'Delhi', 3, 2, 9999.00, 'Central City Hotel, Breakfast, All Monument Fast-Track Tickets, Chandni Chowk Food Tour, Guided AC Sedan', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80', 0),

(8, 8, 'Royal Rajasthan Imperial Grandeur', 'Rajasthan', 7, 6, 29999.00, 'Heritage Palace Hotels, Thar Desert Luxury Tent Camping, Camel Safari, Folk Dance with Bonfire, Private SUV with English Driver', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80', 1);

-- Sample Bookings
INSERT INTO `bookings` (`id`, `booking_ref`, `user_id`, `package_id`, `destination_id`, `user_name`, `email`, `phone`, `destination_name`, `package_name`, `travel_date`, `travelers_count`, `total_price`, `special_requests`, `status`) VALUES
(1, 'TRV-2026-901', 1, 1, 1, 'John Doe', 'john@example.com', '+91 9876543210', 'Goa', 'Goa Tropical Beach Escapade', '2026-11-15', 2, 29998.00, 'Beach-facing room requested with late check-in.', 'Confirmed'),
(2, 'TRV-2026-902', 1, 3, 3, 'John Doe', 'john@example.com', '+91 9876543210', 'Kashmir', 'Kashmir Heavenly Paradise Tour', '2026-12-20', 2, 51998.00, 'Vegetarian Kashmiri Wazwan meal preference.', 'Pending'),
(3, 'TRV-2026-903', 2, 5, 5, 'Priya Sharma', 'priya@example.com', '+91 9811223344', 'Kerala', 'Kerala Backwaters & Tea Hills Special', '2026-09-10', 4, 89996.00, 'Family trip, need 2 connected bedrooms on houseboat.', 'Completed');

-- Sample Contact Messages
INSERT INTO `contact_messages` (`name`, `email`, `phone`, `subject`, `message`, `status`) VALUES
('Rahul Verma', 'rahul@gmail.com', '+91 9988776655', 'Customized Honeymoon Package to Kashmir', 'Hello, do you offer customized photography services and luxury flower decoration for Dal Lake houseboats?', 'Unread'),
('Ananya Gupta', 'ananya.g@yahoo.com', '+91 9871122334', 'Corporate Group Tour Query for Goa', 'We have a group of 25 colleagues planning an annual retreat in Goa. Could you send group discount quotes?', 'Read');

-- Sample Customer Reviews
INSERT INTO `reviews` (`user_name`, `user_avatar`, `destination_name`, `rating`, `comment`) VALUES
('Aarav Mehta', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', 'Kashmir', 5, 'The Kashmir Heavenly Paradise tour was completely surreal! Dal Lake houseboat was magnificent and the Gondola ride in Gulmarg was breathtaking. 10/10 service!'),
('Sneha Roy', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Goa', 5, 'Booking our Goa holiday was seamless and smooth. The hotel was superb, beachfront, and the river cruise was full of fun. Highly recommended!'),
('Vikramaditya Rao', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', 'Kerala', 5, 'God’s Own Country truly lived up to its name. The Alleppey houseboat and Munnar tea gardens felt out of a dream. Our guide was extremely polite and helpful.'),
('Neha Sen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', 'Jaipur', 4, 'Wonderful heritage experience in Jaipur! The palace guides were knowledgeable and the royal dinner at Chokhi Dhani was unforgettable.');
