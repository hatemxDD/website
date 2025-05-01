import React, { useState } from 'react';
import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaFileAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  status: 'draft' | 'submitted' | 'published' | 'rejected';
  impactFactor: number;
  citations: number;
  abstract: string;
  keywords: string[];
  doi?: string;
}

const PublicationsManagement: React.FC = () => {
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: '1',
      title: 'Advanced Machine Learning Techniques in Healthcare',
      authors: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      journal: 'Journal of AI in Medicine',
      publicationDate: '2023-12-15',
      status: 'published',
      impactFactor: 4.5,
      citations: 12,
      abstract: 'This paper explores the application of machine learning techniques in healthcare diagnostics...',
      keywords: ['Machine Learning', 'Healthcare', 'AI', 'Diagnostics'],
      doi: '10.1234/jaim.2023.001'
    },
    {
      id: '2',
      title: 'Data Analytics in Research: A Comprehensive Review',
      authors: ['John Doe', 'Sarah Wilson'],
      journal: 'Data Science Review',
      publicationDate: '2023-11-01',
      status: 'submitted',
      impactFactor: 3.8,
      citations: 0,
      abstract: 'A comprehensive review of data analytics methodologies in research...',
      keywords: ['Data Analytics', 'Research Methods', 'Big Data'],
      doi: '10.1234/dsr.2023.002'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPublications = publications.filter(publication => {
    const matchesSearch = publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      publication.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || publication.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddPublication = () => {
    setShowAddModal(true);
  };

  const handleDeletePublication = (id: string) => {
    setPublications(publications.filter(pub => pub.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Publications Management</h1>
        <button
          onClick={handleAddPublication}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Publication
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search publications..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPublications.map((publication) => (
          <div key={publication.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {publication.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {publication.authors.join(', ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeletePublication(publication.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FaFileAlt className="mr-2" />
                    <span>{publication.journal}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(publication.publicationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FaUsers className="mr-2" />
                    <span>Impact Factor: {publication.impactFactor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Citations: {publication.citations}
                  </div>
                  {publication.doi && (
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      DOI: {publication.doi}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {publication.abstract}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {publication.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(publication.status)}`}>
                  {publication.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPublications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'No publications match your search criteria.' 
              : 'No publications found.'}
          </p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Publication</h2>
            {/* Add publication form will go here */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Publication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsManagement; 