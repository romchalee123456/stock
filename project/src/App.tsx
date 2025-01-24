import React, { useState } from 'react';
import { Package2, Boxes } from 'lucide-react';
import RequisitionPage from './pages/RequisitionPage';
import EquipmentList from './components/EquipmentList';

function App() {
  const [activeTab, setActiveTab] = useState('requisition');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Package2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Inventory System</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('requisition')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'requisition'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Boxes className="h-5 w-5 mr-2" />
                  เบิกสินค้า
                </button>
                <button
                  onClick={() => setActiveTab('equipment')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'equipment'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  อุปกรณ์
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Welcome, User</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'requisition' ? (
          <RequisitionPage />
        ) : (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-6">Equipment List</h2>
            <EquipmentList />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;