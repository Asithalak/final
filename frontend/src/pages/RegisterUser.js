import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTools, FaUser } from 'react-icons/fa';

const RegisterUser = () => {
  const { role } = useParams(); // 'carpenter' or 'customer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    // Carpenter specific fields
    specialization: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isCarpenter = role === 'carpenter';
  const isCustomer = role === 'customer';

  // Role configuration
  const roleConfig = {
    carpenter: {
      title: 'Carpenter Registration',
      subtitle: 'Join as a skilled carpenter',
      icon: FaTools,
      color: 'amber',
      bgGradient: 'from-amber-50 to-amber-100',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-300 focus:border-amber-500 focus:ring-amber-500'
    },
    customer: {
      title: 'Customer Registration',
      subtitle: 'Create your customer account',
      icon: FaUser,
      color: 'blue',
      bgGradient: 'from-blue-50 to-blue-100',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500'
    }
  };

  const config = roleConfig[role] || roleConfig.customer;
  const Icon = config.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: role,
        phone: formData.phone.trim() || '',
        address: formData.address.trim() || ''
      };

      // Add carpenter specific fields
      if (isCarpenter) {
        userData.specialization = formData.specialization.trim() || '';
        userData.experience = formData.experience ? parseInt(formData.experience) : 0;
      }

      console.log(`Submitting ${role} registration:`, { ...userData, password: '***' });
      await register(userData);
      
      // Redirect based on role
      if (isCarpenter) {
        navigate('/carpenterdashboard');
      } else {
        navigate('/customerdashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Invalid role check
  if (!isCarpenter && !isCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Registration Type</h2>
          <p className="mt-2 text-gray-600">Please select a valid registration type.</p>
          <Link to="/login" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${config.bgGradient} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <div className="flex justify-center">
            <div className={`${config.iconBg} p-4 rounded-full`}>
              <Icon className={`w-12 h-12 ${config.iconColor}`} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {config.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {config.subtitle}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`input-field mt-1 ${config.borderColor}`}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`input-field mt-1 ${config.borderColor}`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field mt-1 ${config.borderColor}`}
                placeholder="e.g., +1234567890"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={`input-field mt-1 ${config.borderColor}`}
                placeholder="Enter your address"
              />
            </div>

            {/* Carpenter specific fields */}
            {isCarpenter && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`input-field mt-1 ${config.borderColor}`}
                    placeholder="e.g., Furniture Making, Cabinet Work"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`input-field mt-1 ${config.borderColor}`}
                    placeholder="e.g., 5"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`input-field mt-1 ${config.borderColor}`}
                placeholder="Minimum 6 characters"
                minLength="6"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field mt-1 ${config.borderColor}`}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${config.buttonBg} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition`}
            >
              {loading ? 'Creating Account...' : `Register as ${isCarpenter ? 'Carpenter' : 'Customer'}`}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t pt-6">
          <p className="text-center text-sm text-gray-600 mb-4">
            Already have an account?
          </p>
          <Link 
            to="/login" 
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
        </div>

        {/* Switch role link */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {isCarpenter ? (
              <>
                Not a carpenter?{' '}
                <Link to="/register/customer" className="font-medium text-blue-600 hover:text-blue-500">
                  Register as Customer
                </Link>
              </>
            ) : (
              <>
                Are you a carpenter?{' '}
                <Link to="/register/carpenter" className="font-medium text-amber-600 hover:text-amber-500">
                  Register as Carpenter
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
