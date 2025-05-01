import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  published: boolean;
  imageUrl?: string;
}

const ListNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const navigate = useNavigate();

  // Mock data fetching
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockArticles: Article[] = [
          {
            id: '1',
            title: 'New Research Breakthrough',
            content: 'Our lab team has achieved a significant breakthrough in...',
            author: 'Dr. Sarah Johnson',
            publishDate: '2023-05-15',
            published: true,
            imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
            id: '2',
            title: 'Lab Annual Conference Announcement',
            content: 'We are excited to announce our annual conference will be held on...',
            author: 'Prof. Michael Chen',
            publishDate: '2023-06-10',
            published: true,
            imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
            id: '3',
            title: 'New Equipment Installation',
            content: 'Our lab has recently installed state-of-the-art equipment for...',
            author: 'Dr. Alex Rivera',
            publishDate: '2023-07-20',
            published: false,
            imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
            id: '4',
            title: 'Student Research Award Recipients',
            content: 'Congratulations to our student researchers who received awards for...',
            author: 'Dr. Emily Wilson',
            publishDate: '2023-08-05',
            published: true,
            imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
            id: '5',
            title: 'Upcoming Workshop Series',
            content: 'Registration is now open for our upcoming workshop series on...',
            author: 'Prof. Daniel Lee',
            publishDate: '2023-09-12',
            published: true,
          },
          {
            id: '6',
            title: 'Research Grant Awarded',
            content: 'Our team has been awarded a prestigious grant to continue research on...',
            author: 'Dr. Lisa Martinez',
            publishDate: '2023-10-18',
            published: false,
            imageUrl: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
            id: '7',
            title: 'International Collaboration Announcement',
            content: 'We are pleased to announce a new international collaboration with...',
            author: 'Prof. Robert Taylor',
            publishDate: '2023-11-22',
            published: true,
            imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          }
        ];
        
        setArticles(mockArticles);
        setFilteredArticles(mockArticles);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = articles;
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) || 
        article.author.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const isPublished = statusFilter === 'published';
      results = results.filter(article => article.published === isPublished);
    }
    
    setFilteredArticles(results);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, statusFilter, articles]);

  const handleCreateNew = () => {
    navigate('/dashboard/news/create');
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/news/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/dashboard/news/view/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove article from state
      setArticles(articles.filter(article => article.id !== id));
      
      setIsDeleting(null);
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Failed to delete article. Please try again.');
      setIsDeleting(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading articles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">News Articles</h2>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Articles list */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-gray-500">No articles found. Try adjusting your filters or create a new article.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <div 
                key={article.id} 
                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-48 bg-gray-100 relative">
                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-white shadow-sm">
                    {article.published ? (
                      <span className="text-green-600">Published</span>
                    ) : (
                      <span className="text-amber-600">Draft</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.content}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(article.publishDate)}</span>
                    <span className="mx-2">•</span>
                    <span>{article.author}</span>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => handleView(article.id)}
                    className="text-gray-700 hover:text-blue-600 p-1"
                    title="View Article"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => handleEdit(article.id)}
                    className="text-gray-700 hover:text-indigo-600 p-1"
                    title="Edit Article"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-gray-700 hover:text-red-600 p-1"
                    disabled={isDeleting === article.id}
                    title="Delete Article"
                  >
                    {isDeleting === article.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8 px-2">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + pageSize, filteredArticles.length)}
                </span>{' '}
                of <span className="font-medium">{filteredArticles.length}</span> articles
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListNews; 