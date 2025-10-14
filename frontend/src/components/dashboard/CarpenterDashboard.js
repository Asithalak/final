import React, { useState, useEffect } from 'react';
import { furnitureAPI, resourcesAPI, ordersAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CarpenterDashboard = () => {
  const [furniture, setFurniture] = useState([]);
  const [resources, setResources] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('furniture');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [furnitureRes, resourcesRes, ordersRes] = await Promise.all([
        furnitureAPI.getAll(),
        resourcesAPI.getAll(),
        ordersAPI.getAll()
      ]);
      
      setFurniture(furnitureRes.data);
      setResources(resourcesRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'furniture', label: 'My Furniture Designs' },
    { id: 'resources', label: 'My Resources' },
    { id: 'orders', label: 'Assigned Orders' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Designs</h3>
          <p className="text-3xl font-bold text-primary-600">{furniture.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Approved Designs</h3>
          <p className="text-3xl font-bold text-green-600">
            {furniture.filter(f => f.isApproved).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Resources Listed</h3>
          <p className="text-3xl font-bold text-blue-600">{resources.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Active Orders</h3>
          <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'furniture' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Furniture Designs</h3>
                <button className="btn-primary">Upload New Design</button>
              </div>
              {furniture.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {furniture.map(item => (
                    <div key={item._id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-600 text-sm">${item.price}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                        item.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No furniture designs uploaded yet</p>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Resources</h3>
                <button className="btn-primary">Add New Resource</button>
              </div>
              {resources.length > 0 ? (
                <div className="space-y-3">
                  {resources.map(resource => (
                    <div key={resource._id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{resource.name}</h4>
                        <p className="text-sm text-gray-600">
                          {resource.quantity} {resource.unit} • ${resource.pricePerUnit}/{resource.unit}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        resource.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {resource.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No resources listed yet</p>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Assigned Orders</h3>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <p className="font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">Status: {order.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No orders assigned yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarpenterDashboard;
