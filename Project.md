# CampusPulse Navigator - MVP

## Project Overview

Build a responsive web application to test campus navigation using OpenStreetMap.

This is a prototype to validate navigation before replacing the map with a custom Figma campus map.

The application has only two user roles:

- Student
- Admin

The focus is on map interaction, navigation, GPS tracking, and destination management.

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Leaflet
- React Leaflet
- Leaflet Routing Machine
- Framer Motion

Backend

- Node.js
- Express.js

Database

- MongoDB

Authentication

- JWT (Demo Login)

Maps

- OpenStreetMap
- Browser Geolocation API
- Leaflet Routing Machine

---

# Authentication

Use demo accounts.

Student

Email:
student@campuspulse.com

Password:
123456

Admin

Email:
admin@campuspulse.com

Password:
123456

No signup required.

---

# Student Module

## Dashboard

Simple dashboard containing

- Campus Map
- Current Location
- Destination Search

---

# Campus Map

Display OpenStreetMap using Leaflet.

Enable

- Zoom
- Pan
- Fullscreen
- Locate Me button

---

# Current Location

Request browser GPS permission.

Display live location using a blue animated marker.

Update location continuously.

If GPS is unavailable

Display a message

"Unable to access your location."

---

# Destination Markers

Create sample markers for

- Main Gate
- Main Block
- Library
- Auditorium
- Mechanical Block
- Workshop
- Admin Block
- Cafeteria
- Parking

Clicking a marker opens

- Building Name
- Description
- Navigate Button

---

# Navigation

When Navigate is clicked

Use Leaflet Routing Machine.

Draw the walking route from the student's current location to the selected destination.

Display

- Distance
- Estimated Walking Time
- Destination Name

Automatically fit the route inside the map.

---

# Arrival

When the student reaches within approximately 20 meters of the destination

Display a popup.

Title

Destination Reached

Message

You have reached the destination building.

Indoor directions will be available in the next version.

Button

Done

---

# Admin Module

## Admin Dashboard

Contains only

Campus Map Editor

---

# Map Editor

Display the same OpenStreetMap.

Admin can

- Add Marker
- Edit Marker
- Delete Marker

Each marker contains

- Building Name
- Description
- Latitude
- Longitude
- Category

Categories

- Academic
- Administration
- Sports
- Parking
- Cafeteria
- Auditorium
- Hostel

---

# Marker Form

Fields

Building Name

Description

Latitude

Longitude

Category

Save

Cancel

---

# Student Map Updates

Any marker created by the admin should immediately appear on the student map after refresh.

---

# UI Design

Use a modern Apple Maps inspired design.

Requirements

- Rounded cards
- Soft shadows
- Glassmorphism navigation card
- Floating action buttons
- Mobile-first layout
- Responsive design
- Dark mode support
- Smooth animations

---

# Suggested Folder Structure

src/

components/

Map/

Marker/

Navigation/

Student/

Admin/

Layout/

pages/

services/

hooks/

context/

types/

assets/

backend/

controllers/

routes/

middleware/

models/

---

# Future Upgrade

The application architecture should make it easy to replace OpenStreetMap with a custom SVG campus map in the future.

All map-related logic should be isolated in reusable components.

Avoid hardcoding map implementations.

---

# Deliverables

- Clean React + TypeScript project
- Modular architecture
- Responsive UI
- Live GPS tracking
- Walking navigation
- Admin marker management
- Production-ready code