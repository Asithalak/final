import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI, furnitureAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyResources = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [showAddFurnitureModal, setShowAddFurnitureModal] = useState(false);
  const [showEditFurnitureModal, setShowEditFurnitureModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [editImagePreview, setEditImagePreview] = useState([]);

  // Handle image preview for add furniture
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning('Maximum 5 images allowed');
      e.target.value = '';
      setImagePreview([]);
      return;
    }
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Handle image preview for edit furniture
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning('Maximum 5 images allowed');
      e.target.value = '';
      setEditImagePreview([]);
      return;
    }
    const previews = files.map(file => URL.createObjectURL(file));
    setEditImagePreview(previews);
  };

  // Clear previews when modal closes
  const closeAddFurnitureModal = () => {
    setShowAddFurnitureModal(false);
    setImagePreview([]);
  };

  const closeEditFurnitureModal = () => {
    setShowEditFurnitureModal(false);
    setSelectedFurniture(null);
    setEditImagePreview([]);
  };

  // Material categories matching backend enum
  const materialCategories = [
    { value: 'wood', label: 'Wood' },
    { value: 'lumber', label: 'Lumber' },
    { value: 'metal', label: 'Metal' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'glass', label: 'Glass' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'paint', label: 'Paint' },
    { value: 'other', label: 'Other' }
  ];

  // Unit options matching backend enum
  const unitOptions = ['piece', 'kg', 'meter', 'sqft', 'liter', 'box'];

  // Furniture categories matching backend enum
  const furnitureCategories = ['chair', 'table', 'sofa', 'bed', 'cabinet', 'desk', 'shelf', 'other'];

  const userRole = user?.role || 'carpenter';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load carpenter's resources
      const resourcesResponse = await resourcesAPI.getMyResources();
      setResources(resourcesResponse.data || []);

      // Load carpenter's furniture
      const furnitureResponse = await furnitureAPI.getMyFurniture();
      setFurnitureItems(furnitureResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Create resource data
      const resourceData = new FormData();
      resourceData.append('name', formData.get('name'));
      resourceData.append('type', formData.get('category'));
      resourceData.append('description', formData.get('name')); // Using name as description
      resourceData.append('quantity', formData.get('quantity'));
      resourceData.append('unit', formData.get('unit'));
      resourceData.append('pricePerUnit', formData.get('pricePerUnit'));
      resourceData.append('supplierName', formData.get('supplier') || '');

      const response = await resourcesAPI.create(resourceData);
      
      setResources([response.data.resource, ...resources]);
      setShowAddResourceModal(false);
      toast.success('Resource added successfully!');
      e.target.reset();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error(error.response?.data?.message || 'Failed to add resource');
    } finally {
      setSaving(false);
    }
  };

  const handleEditResource = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      
      const resourceData = new FormData();
      resourceData.append('name', formData.get('name'));
      resourceData.append('type', formData.get('category'));
      resourceData.append('description', formData.get('name'));
      resourceData.append('quantity', formData.get('quantity'));
      resourceData.append('unit', formData.get('unit'));
      resourceData.append('pricePerUnit', formData.get('pricePerUnit'));
      resourceData.append('supplierName', formData.get('supplier') || '');

      const response = await resourcesAPI.update(selectedResource._id, resourceData);
      
      setResources(resources.map(r => 
        r._id === selectedResource._id ? response.data.resource : r
      ));
      setShowEditResourceModal(false);
      setSelectedResource(null);
      toast.success('Resource updated successfully!');
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error(error.response?.data?.message || 'Failed to update resource');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourcesAPI.delete(id);
        setResources(resources.filter(r => r._id !== id));
        toast.success('Resource deleted successfully!');
      } catch (error) {
        console.error('Error deleting resource:', error);
        toast.error(error.response?.data?.message || 'Failed to delete resource');
      }
    }
  };

  const handleAddFurniture = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      const materials = formData.get('materials').split(',').map(m => m.trim());
      
      const furnitureData = new FormData();
      furnitureData.append('name', formData.get('name'));
      furnitureData.append('category', formData.get('category'));
      furnitureData.append('description', formData.get('description') || formData.get('name'));
      furnitureData.append('price', formData.get('price'));
      furnitureData.append('materials', JSON.stringify(materials));
      furnitureData.append('timeRequired', formData.get('timeRequired'));
      furnitureData.append('stockQuantity', formData.get('status') === 'Available' ? 1 : 0);

      // Add images
      const imageFiles = formData.getAll('images');
      imageFiles.forEach((file) => {
        if (file && file.size > 0) {
          furnitureData.append('images', file);
        }
      });

      const response = await furnitureAPI.create(furnitureData);
      
      setFurnitureItems([response.data.furniture, ...furnitureItems]);
      closeAddFurnitureModal();
      toast.success('Furniture item added successfully!');
      e.target.reset();
    } catch (error) {
      console.error('Error adding furniture:', error);
      toast.error(error.response?.data?.message || 'Failed to add furniture');
    } finally {
      setSaving(false);
    }
  };

  const handleEditFurniture = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target);
      const materials = formData.get('materials').split(',').map(m => m.trim());
      
      const furnitureData = new FormData();
      furnitureData.append('name', formData.get('name'));
      furnitureData.append('category', formData.get('category'));
      furnitureData.append('description', formData.get('description') || formData.get('name'));
      furnitureData.append('price', formData.get('price'));
      furnitureData.append('materials', JSON.stringify(materials));
      furnitureData.append('timeRequired', formData.get('timeRequired'));
      furnitureData.append('stockQuantity', formData.get('status') === 'Available' ? 1 : 0);

      // Add images if new ones are selected
      const imageFiles = formData.getAll('images');
      imageFiles.forEach((file) => {
        if (file && file.size > 0) {
          furnitureData.append('images', file);
        }
      });

      const response = await furnitureAPI.update(selectedFurniture._id, furnitureData);
      
      setFurnitureItems(furnitureItems.map(f => 
        f._id === selectedFurniture._id ? response.data.furniture : f
      ));
      closeEditFurnitureModal();
      toast.success('Furniture item updated successfully!');
    } catch (error) {
      console.error('Error updating furniture:', error);
      toast.error(error.response?.data?.message || 'Failed to update furniture');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFurniture = async (id) => {
    if (window.confirm('Are you sure you want to delete this furniture item?')) {
      try {
        await furnitureAPI.delete(id);
        setFurnitureItems(furnitureItems.filter(f => f._id !== id));
        toast.success('Furniture item deleted successfully!');
      } catch (error) {
        console.error('Error deleting furniture:', error);
        toast.error(error.response?.data?.message || 'Failed to delete furniture');
      }
    }
  };

  const canEdit = userRole === 'carpenter';

  // Helper to get category label
  const getCategoryLabel = (value) => {
    const cat = materialCategories.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  // Helper to get furniture status
  const getFurnitureStatus = (furniture) => {
    if (furniture.stockQuantity > 0) return 'Available';
    return 'Custom Order';
  };

  // Helper to format image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Ensure the path starts with /
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:8000${normalizedPath}`;
  };

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
                  <div key={resource._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resource.type === 'wood' || resource.type === 'lumber' ? 'bg-amber-100 text-amber-700' :
                          resource.type === 'metal' ? 'bg-gray-100 text-gray-700' :
                          resource.type === 'fabric' ? 'bg-purple-100 text-purple-700' :
                          resource.type === 'paint' ? 'bg-red-100 text-red-700' :
                          resource.type === 'hardware' ? 'bg-blue-100 text-blue-700' :
                          resource.type === 'glass' ? 'bg-cyan-100 text-cyan-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {getCategoryLabel(resource.type)}
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
                            onClick={() => handleDeleteResource(resource._id)}
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
                      <p className="text-xs text-gray-500">Supplier: <span className="text-gray-700 font-medium">{resource.supplierName || 'N/A'}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No resources available</p>
                {canEdit && (
                  <button
                    onClick={() => setShowAddResourceModal(true)}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add your first resource
                  </button>
                )}
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
                  <div key={furniture._id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:border-purple-300">
                    {/* Furniture Image */}
                    {furniture.images && furniture.images.length > 0 ? (
                      <div className="h-48 bg-gray-100 relative overflow-hidden">
                        <img 
                          src={getImageUrl(furniture.images[0])}
                          alt={furniture.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center"><span class="text-6xl">🪑</span></div>';
                          }}
                        />
                        {furniture.images.length > 1 && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs">
                            +{furniture.images.length - 1} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <span className="text-6xl">🪑</span>
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{furniture.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            furniture.category === 'chair' ? 'bg-blue-100 text-blue-700' :
                            furniture.category === 'table' ? 'bg-green-100 text-green-700' :
                            furniture.category === 'sofa' ? 'bg-purple-100 text-purple-700' :
                            furniture.category === 'desk' ? 'bg-yellow-100 text-yellow-700' :
                            furniture.category === 'bed' ? 'bg-pink-100 text-pink-700' :
                            furniture.category === 'cabinet' ? 'bg-orange-100 text-orange-700' :
                            furniture.category === 'shelf' ? 'bg-teal-100 text-teal-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {furniture.category ? furniture.category.charAt(0).toUpperCase() + furniture.category.slice(1) : 'Other'}
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
                              onClick={() => handleDeleteFurniture(furniture._id)}
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
                          <p className="text-lg font-bold text-blue-700">{furniture.timeRequired || 'N/A'}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">💰 Price</p>
                          <p className="text-lg font-bold text-green-700">${furniture.price}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">📦 Required Materials:</p>
                        <div className="flex flex-wrap gap-2">
                          {furniture.materials && furniture.materials.map((material, index) => (
                            <span key={index} className="px-3 py-1 bg-white border border-amber-200 rounded-full text-xs font-medium text-gray-700">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          getFurnitureStatus(furniture) === 'Available' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {getFurnitureStatus(furniture)}
                        </span>
                        <button 
                          onClick={() => navigate(`/furniture/${furniture._id}`)}
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
                {canEdit && (
                  <button
                    onClick={() => setShowAddFurnitureModal(true)}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    + Add your first furniture item
                  </button>
                )}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Name *</label>
                  <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Oak Wood" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {materialCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                  <input type="number" name="quantity" required min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
                  <select name="unit" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Unit ($) *</label>
                  <input type="number" name="pricePerUnit" required step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                  <input type="text" name="supplier" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Wood Masters Inc." />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50">
                  {saving ? 'Saving...' : '✓ Add Resource'}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Name *</label>
                  <input type="text" name="name" required defaultValue={selectedResource.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select name="category" required defaultValue={selectedResource.type} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {materialCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                  <input type="number" name="quantity" required min="0" defaultValue={selectedResource.quantity} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
                  <select name="unit" required defaultValue={selectedResource.unit} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Unit ($) *</label>
                  <input type="number" name="pricePerUnit" required step="0.01" min="0" defaultValue={selectedResource.pricePerUnit} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                  <input type="text" name="supplier" defaultValue={selectedResource.supplierName} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50">
                  {saving ? 'Saving...' : '✓ Update Resource'}
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
                <button onClick={closeAddFurnitureModal} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddFurniture} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Furniture Name *</label>
                  <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., Classic Oak Chair" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    {furnitureCategories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Required *</label>
                  <input type="text" name="timeRequired" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., 3-4 days" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
                  <input type="number" name="price" required step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Required Materials (comma-separated) *</label>
                  <input type="text" name="materials" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., Oak Wood, Steel Hinges, Mahogany Varnish" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select name="status" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Available">Available</option>
                    <option value="Custom Order">Custom Order</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea name="description" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Describe your furniture design..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📷 Upload Images (up to 5)</label>
                  <input 
                    type="file" 
                    name="images" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF. Max 5 images.</p>
                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="flex flex-wrap gap-2">
                        {imagePreview.map((src, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={src} 
                              alt={`Preview ${idx + 1}`} 
                              className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200 shadow-sm" 
                            />
                            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50">
                  {saving ? 'Saving...' : '✓ Add Furniture'}
                </button>
                <button type="button" onClick={closeAddFurnitureModal} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
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
                <button onClick={closeEditFurnitureModal} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditFurniture} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Furniture Name *</label>
                  <input type="text" name="name" required defaultValue={selectedFurniture.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select name="category" required defaultValue={selectedFurniture.category} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    {furnitureCategories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Required *</label>
                  <input type="text" name="timeRequired" required defaultValue={selectedFurniture.timeRequired} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
                  <input type="number" name="price" required step="0.01" min="0" defaultValue={selectedFurniture.price} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Required Materials (comma-separated) *</label>
                  <input type="text" name="materials" required defaultValue={selectedFurniture.materials?.join(', ')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select name="status" required defaultValue={getFurnitureStatus(selectedFurniture)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Available">Available</option>
                    <option value="Custom Order">Custom Order</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea name="description" rows="3" defaultValue={selectedFurniture.description} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Describe your furniture design..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📷 Update Images (up to 5)</label>
                  {/* Current Images */}
                  {selectedFurniture.images && selectedFurniture.images.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-600 mb-2">Current Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedFurniture.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={getImageUrl(img)} 
                              alt={`Current ${idx + 1}`} 
                              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm" 
                            />
                            <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Upload new images to replace current ones.</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    name="images" 
                    multiple 
                    accept="image/*" 
                    onChange={handleEditImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current images. Supported formats: JPG, PNG, GIF.</p>
                  {/* New Image Preview */}
                  {editImagePreview.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-green-700 mb-2">New Images Preview:</p>
                      <div className="flex flex-wrap gap-2">
                        {editImagePreview.map((src, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={src} 
                              alt={`New Preview ${idx + 1}`} 
                              className="w-20 h-20 object-cover rounded-lg border-2 border-green-300 shadow-sm" 
                            />
                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50">
                  {saving ? 'Saving...' : '✓ Update Furniture'}
                </button>
                <button type="button" onClick={closeEditFurnitureModal} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
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
