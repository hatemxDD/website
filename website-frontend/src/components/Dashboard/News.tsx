import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import CreateNews from './Sections/CreateNews';
import EditNews from './Sections/EditNews';

// Mock news articles data
const initialArticles = [
  {
    id: '1',
    title: 'Lab Receives Major Grant for Research',
    content: 'Our laboratory has been awarded a significant grant to continue our groundbreaking research in molecular biology.',
    author: 'Dr. Jane Smith',
    publishDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    published: true
  },
  {
    id: '2',
    title: 'New Team Members Join the Lab',
    content: 'We are pleased to welcome three new researchers to our growing team of scientists.',
    author: 'Dr. John Doe',
    publishDate: '2023-08-22',
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3eecaf5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    published: true
  },
  {
    id: '3',
    title: 'Upcoming Conference Presentation',
    content: 'Our lead researcher will be presenting our latest findings at the International Scientific Conference.',
    author: 'Dr. Jane Smith',
    publishDate: '2023-10-05',
    imageUrl: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    published: false
  }
];

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  published: boolean;
}

type ViewMode = 'list' | 'create' | 'edit' | 'view';

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter articles when search query or published filter changes
  useEffect(() => {
    let filtered = articles;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) || 
        article.author.toLowerCase().includes(query)
      );
    }
    
    // Filter by published status
    if (filterPublished !== null) {
      filtered = filtered.filter(article => article.published === filterPublished);
    }
    
    setFilteredArticles(filtered);
  }, [articles, searchQuery, filterPublished]);

  const handleCreateArticle = () => {
    setViewMode('create');
  };

  const handleEditArticle = (id: string) => {
    setSelectedArticleId(id);
    setViewMode('edit');
  };

  const handleViewArticle = (id: string) => {
    setSelectedArticleId(id);
    setViewMode('view');
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
    setDeleteConfirmId(null);
  };

  const handleCreateSuccess = () => {
    // In a real app, you would add the new article from the API response
    // For this mock, we'll just return to the list view
    setViewMode('list');
  };

  const handleEditSuccess = () => {
    // In a real app, you would update the article from the API response
    setViewMode('list');
    setSelectedArticleId(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedArticleId(null);
  };

  const getSelectedArticle = () => {
    return articles.find(article => article.id === selectedArticleId) || null;
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return <CreateNews onCancel={handleCancel} onSuccess={handleCreateSuccess} />;
      case 'edit':
        return <EditNews articleId={selectedArticleId!} onCancel={handleCancel} onSuccess={handleEditSuccess} />;
      case 'view':
        const article = getSelectedArticle();
        if (!article) return <div>Article not found</div>;
        
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <button onClick={handleCancel} className="text-blue-600 hover:text-blue-800">
                &larr; Back to Articles
              </button>
              <button 
                onClick={() => handleEditArticle(article.id)} 
                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </button>
            </div>
            
            {article.imageUrl && (
              <div className="mb-6">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-64 object-cover rounded-lg" 
                />
              </div>
            )}
            
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
              <span className={`px-2 py-1 text-xs rounded-full ${article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {article.published ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 mb-6">
              By {article.author} on {new Date(article.publishDate).toLocaleDateString()}
            </div>
            
            <div className="prose max-w-none">
              {article.content}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-800">News Articles</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <select
                    value={filterPublished === null ? '' : filterPublished ? 'published' : 'draft'}
                    onChange={(e) => {
                      if (e.target.value === '') setFilterPublished(null);
                      else setFilterPublished(e.target.value === 'published');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  
                  <button
                    onClick={handleCreateArticle}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Article
                  </button>
                </div>
              </div>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                  <AlertTriangle className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No articles found</h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "No articles match your search criteria. Try different keywords."
                    : "There are no articles yet. Click 'New Article' to create one."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => handleViewArticle(article.id)}
                          >
                            {article.title}
                          </h3>
                          <span 
                            className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                              article.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          By {article.author} • {new Date(article.publishDate).toLocaleDateString()}
                        </div>
                        <p className="mt-2 text-gray-600 line-clamp-2">
                          {article.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewArticle(article.id)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          title="View Article"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditArticle(article.id)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          title="Edit Article"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(article.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete Article"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {deleteConfirmId === article.id && (
                      <div className="mt-4 p-4 bg-red-50 rounded-md">
                        <p className="text-red-700 mb-3">
                          Are you sure you want to delete this article? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default News; 