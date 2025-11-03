import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyResources = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('carpenter'); // 'carpenter', 'admin', 'customer'
  const [resources, setResources] = useState([]);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [showAddFurnitureModal, setShowAddFurnitureModal] = useState(false);
  const [showEditFurnitureModal, setShowEditFurnitureModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [loading, setLoading] = useState(false);

  // Material categories
  const materialCategories = [
    'Wood', 'Metal', 'Fabric', 'Leather', 'Paint', 'Hardware', 'Tools', 'Other'
  ];

  // Load user role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'carpenter';
    setUserRole(storedRole);
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    // Mock data - Replace with actual API calls
    const mockResources = [
      { id: 1, name: 'Oak Wood', category: 'Wood', quantity: 50, unit: 'pieces', pricePerUnit: 25, supplier: 'Wood Masters Inc.' },
      { id: 2, name: 'Pine Wood', category: 'Wood', quantity: 75, unit: 'pieces', pricePerUnit: 15, supplier: 'Forest Supply Co.' },
      { id: 3, name: 'Steel Hinges', category: 'Hardware', quantity: 200, unit: 'pieces', pricePerUnit: 3, supplier: 'Hardware Plus' },
      { id: 4, name: 'Mahogany Varnish', category: 'Paint', quantity: 20, unit: 'liters', pricePerUnit: 45, supplier: 'Paint World' },
      { id: 5, name: 'Leather Upholstery', category: 'Leather', quantity: 30, unit: 'meters', pricePerUnit: 60, supplier: 'Leather Works' },
    ];

    const mockFurniture = [
      { id: 1, name: 'Classic Oak Chair', category: 'Chair', timeRequired: '3-4 days', price: 250, materials: ['Oak Wood', 'Steel Hinges', 'Mahogany Varnish'], status: 'Available' },
      { id: 2, name: 'Modern Dining Table', category: 'Table', timeRequired: '5-7 days', price: 850, materials: ['Oak Wood', 'Mahogany Varnish'], status: 'Available' },
      { id: 3, name: 'Pine Study Desk', category: 'Desk', timeRequired: '4-5 days', price: 450, materials: ['Pine Wood', 'Steel Hinges', 'Mahogany Varnish'], status: 'Available' },
      { id: 4, name: 'Leather Sofa', category: 'Sofa', timeRequired: '7-10 days', price: 1200, materials: ['Oak Wood', 'Leather Upholstery', 'Steel Hinges'], status: 'Custom Order' },
    ];

    setTimeout(() => {
      setResources(mockResources);
      setFurnitureItems(mockFurniture);
      setLoading(false);
    }, 500);
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newResource = {
      id: resources.length + 1,
      name: formData.get('name'),
      category: formData.get('category'),
      quantity: parseInt(formData.get('quantity')),
      unit: formData.get('unit'),
      pricePerUnit: parseFloat(formData.get('pricePerUnit')),
      supplier: formData.get('supplier'),
    };
    setResources([...resources, newResource]);
    setShowAddResourceModal(false);
    toast.success('Resource added successfully!');
  };

  const handleEditResource = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedResources = resources.map(r => 
      r.id === selectedResource.id ? {
        ...r,
        name: formData.get('name'),
        category: formData.get('category'),
        quantity: parseInt(formData.get('quantity')),
        unit: formData.get('unit'),
        pricePerUnit: parseFloat(formData.get('pricePerUnit')),
        supplier: formData.get('supplier'),
      } : r
    );
    setResources(updatedResources);
    setShowEditResourceModal(false);
    setSelectedResource(null);
    toast.success('Resource updated successfully!');
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
      toast.success('Resource deleted successfully!');
    }
  };

  const handleAddFurniture = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const materials = formData.get('materials').split(',').map(m => m.trim());
    const newFurniture = {
      id: furnitureItems.length + 1,
      name: formData.get('name'),
      category: formData.get('category'),
      timeRequired: formData.get('timeRequired'),
      price: parseFloat(formData.get('price')),
      materials: materials,
      status: formData.get('status'),
    };
    setFurnitureItems([...furnitureItems, newFurniture]);
    setShowAddFurnitureModal(false);
    toast.success('Furniture item added successfully!');
  };

  const handleEditFurniture = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const materials = formData.get('materials').split(',').map(m => m.trim());
    const updatedFurniture = furnitureItems.map(f => 
      f.id === selectedFurniture.id ? {
        ...f,
        name: formData.get('name'),
        category: formData.get('category'),
        timeRequired: formData.get('timeRequired'),
        price: parseFloat(formData.get('price')),
        materials: materials,
        status: formData.get('status'),
      } : f
    );
    setFurnitureItems(updatedFurniture);
    setShowEditFurnitureModal(false);
    setSelectedFurniture(null);
    toast.success('Furniture item updated successfully!');
  };

  const handleDeleteFurniture = (id) => {
    if (window.confirm('Are you sure you want to delete this furniture item?')) {
      setFurnitureItems(furnitureItems.filter(f => f.id !== id));
      toast.success('Furniture item deleted successfully!');
    }
  };

  const canEdit = userRole === 'carpenter';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                📦 My Resources & Furniture
              </h1>
              <p className="text-primary-100 text-lg">
                {userRole === 'carpenter' ? 'Manage your materials and furniture inventory' : 
                 userRole === 'admin' ? 'View carpenter resources and furniture' : 
                 'Browse available furniture and materials'}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs text-primary-100">Role</p>
              <p className="text-lg font-bold text-white capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Available Resources Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🪵 Available Materials & Resources
                </h2>
                <p className="text-blue-100 mt-1">Total: {resources.length} items in stock</p>
              </div>
              {canEdit && (
                <button
                  onClick={() => setShowAddResourceModal(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  + Add Resource
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(resource => (
                  <div key={resource.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resource.category === 'Wood' ? 'bg-amber-100 text-amber-700' :
                          resource.category === 'Metal' ? 'bg-gray-100 text-gray-700' :
                          resource.category === 'Fabric' ? 'bg-purple-100 text-purple-700' :
                          resource.category === 'Leather' ? 'bg-orange-100 text-orange-700' :
                          resource.category === 'Paint' ? 'bg-red-100 text-red-700' :
                          resource.category === 'Hardware' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {resource.category}
                        </span>
                      </div>
                      {canEdit && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedResource(resource);
                              setShowEditResourceModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Quantity:</span>
                        <span className="font-semibold text-gray-900">{resource.quantity} {resource.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Price per {resource.unit}:</span>
                        <span className="font-semibold text-green-600">${resource.pricePerUnit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Total Value:</span>
                        <span className="font-bold text-primary-600">${(resource.quantity * resource.pricePerUnit).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Supplier: <span className="text-gray-700 font-medium">{resource.supplier}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No resources available</p>
              </div>
            )}
          </div>
        </div>

        {/* Furniture Items Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🪑 Furniture Items I Can Make
                </h2>
                <p className="text-purple-100 mt-1">Total: {furnitureItems.length} furniture types</p>
              </div>
              {canEdit && (
                <button
                  onClick={() => setShowAddFurnitureModal(true)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
                >
                  + Add Furniture
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {furnitureItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {furnitureItems.map(furniture => (
                  <div key={furniture.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:border-purple-300">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{furniture.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            furniture.category === 'Chair' ? 'bg-blue-100 text-blue-700' :
                            furniture.category === 'Table' ? 'bg-green-100 text-green-700' :
                            furniture.category === 'Sofa' ? 'bg-purple-100 text-purple-700' :
                            furniture.category === 'Desk' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {furniture.category}
                          </span>
                        </div>
                        {canEdit && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSelectedFurniture(furniture);
                                setShowEditFurnitureModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFurniture(furniture.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">⏱️ Time Required</p>
                          <p className="text-lg font-bold text-blue-700">{furniture.timeRequired}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">💰 Price</p>
                          <p className="text-lg font-bold text-green-700">${furniture.price}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">📦 Required Materials:</p>
                        <div className="flex flex-wrap gap-2">
                          {furniture.materials.map((material, index) => (
                            <span key={index} className="px-3 py-1 bg-white border border-amber-200 rounded-full text-xs font-medium text-gray-700">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          furniture.status === 'Available' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {furniture.status}
                        </span>
                        <button 
                          onClick={() => navigate(`/furniture/${furniture.id}`)}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No furniture items available</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Add New Resource</h3>
                <button onClick={() => setShowAddResourceModal(false)} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddResource} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Oak Wood" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {materialCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                  <input type="number" name="quantity" required min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                  <input type="text" name="unit" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., pieces, meters, liters" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Unit ($)</label>
                  <input type="number" name="pricePerUnit" required step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                  <input type="text" name="supplier" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Wood Masters Inc." />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                  ✓ Add Resource
                </button>
                <button type="button" onClick={() => setShowAddResourceModal(false)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditResourceModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Edit Resource</h3>
                <button onClick={() => { setShowEditResourceModal(false); setSelectedResource(null); }} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditResource} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Name</label>
                  <input type="text" name="name" required defaultValue={selectedResource.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select name="category" required defaultValue={selectedResource.category} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {materialCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                  <input type="number" name="quantity" required min="0" defaultValue={selectedResource.quantity} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                  <input type="text" name="unit" required defaultValue={selectedResource.unit} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Unit ($)</label>
                  <input type="number" name="pricePerUnit" required step="0.01" min="0" defaultValue={selectedResource.pricePerUnit} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                  <input type="text" name="supplier" required defaultValue={selectedResource.supplier} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                  ✓ Update Resource
                </button>
                <button type="button" onClick={() => { setShowEditResourceModal(false); setSelectedResource(null); }} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Furniture Modal */}
      {showAddFurnitureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Add New Furniture Item</h3>
                <button onClick={() => setShowAddFurnitureModal(false)} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddFurniture} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Furniture Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., Classic Oak Chair" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Chair">Chair</option>
                    <option value="Table">Table</option>
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                    <option value="Desk">Desk</option>
                    <option value="Cabinet">Cabinet</option>
                    <option value="Shelf">Shelf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Required</label>
                  <input type="text" name="timeRequired" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., 3-4 days" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                  <input type="number" name="price" required step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Required Materials (comma-separated)</label>
                  <input type="text" name="materials" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., Oak Wood, Steel Hinges, Mahogany Varnish" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select name="status" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Available">Available</option>
                    <option value="Custom Order">Custom Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
                  ✓ Add Furniture
                </button>
                <button type="button" onClick={() => setShowAddFurnitureModal(false)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Furniture Modal */}
      {showEditFurnitureModal && selectedFurniture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Edit Furniture Item</h3>
                <button onClick={() => { setShowEditFurnitureModal(false); setSelectedFurniture(null); }} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditFurniture} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Furniture Name</label>
                  <input type="text" name="name" required defaultValue={selectedFurniture.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select name="category" required defaultValue={selectedFurniture.category} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Chair">Chair</option>
                    <option value="Table">Table</option>
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                    <option value="Desk">Desk</option>
                    <option value="Cabinet">Cabinet</option>
                    <option value="Shelf">Shelf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Required</label>
                  <input type="text" name="timeRequired" required defaultValue={selectedFurniture.timeRequired} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                  <input type="number" name="price" required step="0.01" min="0" defaultValue={selectedFurniture.price} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Required Materials (comma-separated)</label>
                  <input type="text" name="materials" required defaultValue={selectedFurniture.materials.join(', ')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select name="status" required defaultValue={selectedFurniture.status} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Available">Available</option>
                    <option value="Custom Order">Custom Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
                  ✓ Update Furniture
                </button>
                <button type="button" onClick={() => { setShowEditFurnitureModal(false); setSelectedFurniture(null); }} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResources;
