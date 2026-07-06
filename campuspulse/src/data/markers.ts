import type { Destination, MarkerCategory } from '../types';

// ============================================================
// Sample destination markers for the campus
// Coordinates: centered on 10.178421, 76.430501
// ============================================================

export const SAMPLE_MARKERS: Destination[] = [
  {
    id: 'marker-1',
    name: 'Main Gate',
    description: 'The primary entrance to the campus. Security check-post located here.',
    lat: 10.177600,
    lng: 76.430100,
    category: 'Administration' as MarkerCategory,
  },
  {
    id: 'marker-2',
    name: 'Main Block',
    description: 'The central academic building housing departments and lecture halls.',
    lat: 10.178421,
    lng: 76.430501,
    category: 'Academic' as MarkerCategory,
  },
  {
    id: 'marker-3',
    name: 'Library',
    description: 'Central library with thousands of reference books and digital resources.',
    lat: 10.178700,
    lng: 76.430900,
    category: 'Academic' as MarkerCategory,
  },
  {
    id: 'marker-4',
    name: 'Auditorium',
    description: 'Main auditorium for seminars, cultural events, and college functions.',
    lat: 10.178900,
    lng: 76.430200,
    category: 'Auditorium' as MarkerCategory,
  },
  {
    id: 'marker-5',
    name: 'Mechanical Block',
    description: 'Houses the Mechanical Engineering department and labs.',
    lat: 10.178100,
    lng: 76.431200,
    category: 'Academic' as MarkerCategory,
  },
  {
    id: 'marker-6',
    name: 'Workshop',
    description: 'Engineering workshop with heavy machinery and fabrication facilities.',
    lat: 10.177900,
    lng: 76.431500,
    category: 'Academic' as MarkerCategory,
  },
  {
    id: 'marker-7',
    name: 'Admin Block',
    description: 'Administrative offices, principal office, and examination section.',
    lat: 10.179200,
    lng: 76.430700,
    category: 'Administration' as MarkerCategory,
  },
  {
    id: 'marker-8',
    name: 'Cafeteria',
    description: 'Campus canteen serving breakfast, lunch and snacks. Open 8AM–5PM.',
    lat: 10.178300,
    lng: 76.429900,
    category: 'Cafeteria' as MarkerCategory,
  },
  {
    id: 'marker-9',
    name: 'Parking',
    description: 'Designated parking area for students and staff vehicles.',
    lat: 10.177400,
    lng: 76.430700,
    category: 'Parking' as MarkerCategory,
  },
];
