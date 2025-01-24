import React from 'react';
import { Clock } from 'lucide-react';

const equipment = [
  {
    id: 1,
    name: "Safety Helmet",
    image: "https://images.unsplash.com/photo-1601726653156-ee0aa87c7474?auto=format&fit=crop&q=80&w=400",
    status: "Available",
    pickupTime: "9:00 AM - 5:00 PM"
  },
  {
    id: 2,
    name: "Work Gloves",
    image: "https://images.unsplash.com/photo-1583624729978-1a0aa814a2e8?auto=format&fit=crop&q=80&w=400",
    status: "Available",
    pickupTime: "9:00 AM - 5:00 PM"
  },
  {
    id: 3,
    name: "Safety Vest",
    image: "https://images.unsplash.com/photo-1618517047922-d18a5a36c109?auto=format&fit=crop&q=80&w=400",
    status: "Available",
    pickupTime: "9:00 AM - 5:00 PM"
  }
];

function EquipmentList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{item.pickupTime}</span>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {item.status}
              </span>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out">
              Schedule Pickup
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EquipmentList;