import React, { useState, useEffect } from 'react';
import { Search, Filter, Newspaper, User, Calendar, Clock, Tag, ChevronDown, ChevronUp, Eye, Trash2, Edit } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  category: 'announcement' | 'publication' | 'event' | 'achievement' | 'general';
  tags: string[];
  imageUrl?: string;
  status: 'published' | 'draft';
}

interface SeeNewsProps {
  title?: string;
  showDeleteControls?: boolean;
}

const SeeNews: React.FC<SeeNewsProps> = ({ title = "Lab News", showDeleteControls = false }) => {
  const { news } = useApp();
  const navigate = useNavigate();
  
  // State for news data
  const [newsData, setNewsData] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New Research Grant Awarded',
      content: 'Our lab has been awarded a $2.5 million grant to further research in quantum computing applications for drug discovery. This funding will support our team for the next three years and allow us to expand our computational resources significantly.',
      author: 'Dr. James Wilson',
      publishDate: '2023-05-15',
      category: 'announcement',
      tags: ['funding', 'quantum computing', 'drug discovery']
    },
    {
      id: '2',
      title: 'Publication in Nature',
      content: 'We are proud to announce that our team\'s research on machine learning applications in climate prediction has been published in Nature. This groundbreaking work demonstrates a 40% improvement in accuracy for long-term climate models.',
      author: 'Dr. Maria Rodriguez',
      publishDate: '2023-04-20',
      category: 'publication',
      tags: ['publication', 'machine learning', 'climate research']
    },
    {
      id: '3',
      title: 'Annual Lab Symposium',
      content: 'Mark your calendars for our annual lab symposium on June 15-16, 2023. This year\'s theme is "Bridging Disciplines: Computational Approaches to Modern Challenges." Registration is now open with early bird pricing until May 30.',
      author: 'Dr. Sarah Chen',
      publishDate: '2023-04-05',
      category: 'event',
      tags: ['symposium', 'conference', 'interdisciplinary']
    },
    {
      id: '4',
      title: 'Team Award for Innovation',
      content: 'Our robotics team has received the National Science Foundation Award for Innovation in STEM for their work on adaptive learning algorithms for robotic prosthetics. Congratulations to all team members for this prestigious recognition!',
      author: 'Dr. James Wilson',
      publishDate: '2023-03-22',
      category: 'achievement',
      tags: ['award', 'robotics', 'prosthetics']
    },
    {
      id: '5',
      title: 'New Laboratory Equipment',
      content: 'We are excited to announce the arrival of our new high-performance computing cluster, which will increase our computational capacity by 300%. This equipment was funded through our recent NSF grant and will be available for all lab members starting next month.',
      author: 'Dr. Michael Johnson',
      publishDate: '2023-02-10',
      category: 'general',
      tags: ['equipment', 'computing', 'infrastructure']
    }
  ]);
  
  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterAuthor, setFilterAuthor] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{key: keyof NewsItem, direction: 'ascending' | 'descending'}>({key: 'publishDate', direction: 'descending'});
  const [showFilters, setShowFilters] = useState(false);
  const [expandedNews, setExpandedNews] = useState<string[]>([]);
  
  // Add state for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Extract unique values for filter dropdowns
  const categories = ['announcement', 'publication', 'event', 'achievement', 'general'];
  const authors = Array.from(new Set(newsData.map(item => item.author)));
  const allTags = Array.from(new Set(newsData.flatMap(item => item.tags)));

  // Effect to initialize data from context (if available)
  useEffect(() => {
    if (news && news.length > 0) {
      // Convert the news from context to the NewsItem format
      const convertedNews = news.map(item => ({
        id: item.id,
        title: item.title,
        content: item.description || 'No content available',
        author: 'Lab Team',
        publishDate: new Date().toISOString().split('T')[0], // Use current date as fallback
        category: 'general' as const,
        tags: ['Research', 'Innovation'],
        imageUrl: item.photo
      }));
      setNewsData(convertedNews);
    }
  }, [news]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    switch (filter) {
      case 'category':
        setFilterCategory(value);
        break;
      case 'author':
        setFilterAuthor(value);
        break;
      case 'tag':
        setFilterTag(value);
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory('');
    setFilterAuthor('');
    setFilterTag('');
    setSearchTerm('');
  };

  // Handle sorting
  const requestSort = (key: keyof NewsItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Toggle news expansion
  const toggleNewsExpansion = (newsId: string) => {
    setExpandedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId) 
        : [...prev, newsId]
    );
  };

  // Get category color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'publication':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'event':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'general':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Apply filters and sorting to get filtered news
  const getFilteredNews = () => {
    let filtered = [...newsData];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(term) || 
          item.content.toLowerCase().includes(term) ||
          item.author.toLowerCase().includes(term) ||
          item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    // Apply author filter
    if (filterAuthor) {
      filtered = filtered.filter(item => item.author === filterAuthor);
    }
    
    // Apply tag filter
    if (filterTag) {
      filtered = filtered.filter(item => item.tags.includes(filterTag));
    }
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1; // Put undefined values at the end
        if (bValue === undefined) return -1; // Put undefined values at the end
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  };

  const filteredNews = getFilteredNews();

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate how many days ago the news was published
  const getDaysAgo = (dateString: string) => {
    const publishDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - publishDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Add delete handler
  const handleDelete = async (newsId: string) => {
    if (deleteConfirm !== newsId) {
      setDeleteConfirm(newsId);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewsData(prev => prev.filter(item => item.id !== newsId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  // Add a function to handle navigation to news detail
  const handleNewsClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  // Add handleEdit function
  const handleEdit = (newsId: string) => {
    navigate(`/dashboard/lab-leader/news/edit/${newsId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
        <Link
          to="/dashboard/lab-leader/news/add"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="mr-2" />
          Add News
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Publish Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNews.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {item.content.substring(0, 100)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.category === 'announcement' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                      item.category === 'event' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      item.category === 'achievement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                    }`}>
                      {(item.category || 'general').charAt(0).toUpperCase() + (item.category || 'general').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {new Date(item.publishDate || new Date()).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (item.status || 'draft') === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}>
                      {(item.status || 'draft').charAt(0).toUpperCase() + (item.status || 'draft').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item.id);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    {showDeleteControls && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {getFilteredNews().map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {item.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(item.publishDate)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit news"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {showDeleteControls && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete news"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            {/* ... rest of the news item content ... */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeeNews; 