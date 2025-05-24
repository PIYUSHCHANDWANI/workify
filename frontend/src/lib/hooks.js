import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import apiList from './apiList';

// Hook for handling form fields with validation
export const useFormFields = (initialState, validationRules = {}) => {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (name, value) => {
    if (!validationRules[name]) return '';

    const rules = validationRules[name];
    if (rules.required && !value) return 'This field is required';
    if (rules.minLength && value.length < rules.minLength) 
      return `Minimum ${rules.minLength} characters required`;
    if (rules.pattern && !rules.pattern.test(value))
      return rules.message || 'Invalid format';
    if (rules.custom) return rules.custom(value);
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error);
    const allFieldsFilled = Object.keys(validationRules).every(key => fields[key]);
    setIsValid(!hasErrors && allFieldsFilled);
  }, [fields, errors, validationRules]);

  return { fields, errors, isValid, handleChange, setFields, setErrors };
};

// Hook for handling pagination
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState([]);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedItems(items.slice(start, end));
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// Hook for handling infinite scroll
export const useInfiniteScroll = (fetchMore, hasMore) => {
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore && !loading) {
        setLoading(true);
        await fetchMore();
        setLoading(false);
      }
    }
  }, [fetchMore, hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return loading;
};

// Hook for handling job applications
export const useJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setApplications(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId, status) => {
    try {
      await axios.put(
        `${apiList.applications}/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      await fetchApplications();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating application');
      return false;
    }
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    updateApplicationStatus,
  };
};

// Hook for handling job search and filters
export const useJobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    jobType: '',
    salary: [0, 1000000],
    duration: '',
    skills: [],
  });

  const searchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiList.jobs, {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setJobs(response.data);
    } catch (err) {
      console.error('Error searching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      searchJobs();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [filters, searchJobs]);

  return {
    jobs,
    loading,
    filters,
    setFilters,
    searchJobs,
  };
};

// Hook for handling user profile
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfile(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    try {
      const response = await axios.put(
        apiList.user,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setProfile(response.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      return false;
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}; 