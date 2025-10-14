import React, { useState, useEffect } from 'react';
import { usersAPI, furnitureAPI, resourcesAPI, ordersAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    furniture: 0,
    resources: 0,
    orders: 0,
    pendingApprovals: 0,
  });
  const [pendingFurniture, setPendingFurniture] = useState([]);
  const [pendingResources, setPendingResources] = useState([]);
  const [pendingCarpenters, setPendingCarpenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, furnitureRes, resourcesRes, ordersRes] = await Promise.all([
        usersAPI.getAll(),
        furnitureAPI.getAll(),
        resourcesAPI.getAll(),
        ordersAPI.getAll()
      ]);

      const allFurniture = furnitureRes.data;
      const allResources = resourcesRes.data;
      const pendingCarpentersList = usersRes.data.filter(u => u.role === 'carpenter' && !u.isApproved);

      setStats({
        users: usersRes.data.length,
        furniture: allFurniture.length,
        resources: allResources.length,
        orders: ordersRes.data.length,
        pendingApprovals: pendingFurniture.length + pendingResources.length + pendingCarpentersList.length,
      });

      setPendingFurniture(allFurniture.filter(f => !f.isApproved));
      setPendingResources(allResources.filter(r => !r.isApproved));
      setPendingCarpenters(pendingCarpentersList);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFurniture = async (id) => {
    try {
      await furnitureAPI.approve(id);
      toast.success('Furniture approved successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve furniture');
    }
  };

  const handleApproveResource = async (id) => {
    try {
      await resourcesAPI.approve(id);
      toast.success('Resource approved successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve resource');
    }
  };

  const handleApproveCarpenter = async (id) => {
    try {
      await usersAPI.approve(id);
      toast.success('Carpenter approved successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve carpenter');
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.users}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Furniture Items</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.furniture}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Resources</h3>
          <p className="text-3xl font-bold text-green-600">{stats.resources}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</p>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="space-y-6">
        {/* Pending Carpenters */}
        {pendingCarpenters.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Pending Carpenter Approvals</h2>
            <div className="space-y-3">
              {pendingCarpenters.map(carpenter => (
                <div key={carpenter._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{carpenter.name}</h4>
                    <p className="text-sm text-gray-600">{carpenter.email}</p>
                    <p className="text-sm text-gray-600">
                      Specialization: {carpenter.specialization} • Experience: {carpenter.experience} years
                    </p>
                  </div>
                  <button 
                    onClick={() => handleApproveCarpenter(carpenter._id)}
                    className="btn-primary"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Furniture */}
        {pendingFurniture.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Pending Furniture Approvals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingFurniture.map(item => (
                <div key={item._id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">${item.price}</p>
                  <p className="text-xs text-gray-500 mb-3">{item.description.substring(0, 80)}...</p>
                  <button 
                    onClick={() => handleApproveFurniture(item._id)}
                    className="btn-primary text-sm w-full"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Resources */}
        {pendingResources.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Pending Resource Approvals</h2>
            <div className="space-y-3">
              {pendingResources.map(resource => (
                <div key={resource._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{resource.name}</h4>
                    <p className="text-sm text-gray-600">
                      {resource.quantity} {resource.unit} • ${resource.pricePerUnit}/{resource.unit}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleApproveResource(resource._id)}
                    className="btn-primary"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingCarpenters.length === 0 && pendingFurniture.length === 0 && pendingResources.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">No pending approvals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
