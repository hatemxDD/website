import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';
import { useApp } from '../../../context/AppContext';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: string;
  journal: string;
  doi: string;
  status: 'draft' | 'submitted' | 'accepted' | 'published' | 'rejected';
  keywords: string[];
}

const PublicationsManagement: React.FC = () => {
  const { publications = [] } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [publicationsData, setPublicationsData] = useState<Publication[]>([
    {
      id: '1',
      title: 'Advances in AI-Based Disease Detection from Medical Images',
      authors: ['Jane Smith', 'Maria Garcia', 'David Wilson'],
      abstract: 'This paper presents a novel approach to disease detection using convolutional neural networks and transfer learning techniques applied to medical imaging.',
      publicationDate: '2023-06-15',
      journal: 'Journal of Medical Imaging',
      doi: '10.1234/jmi.2023.123456',
      status: 'published',
      keywords: ['AI', 'Medical Imaging', 'Disease Detection']
    },
    {
      id: '2',
      title: 'Climate Change Patterns Revealed Through Big Data Analytics',
      authors: ['Robert Chen', 'Alex Johnson', 'Emily Zhang'],
      abstract: 'This research leverages big data analytics techniques to identify subtle patterns in climate data that reveal accelerating changes in global temperature trends.',
      publicationDate: '2023-08-22',
      journal: 'Climate Science Reports',
      doi: '10.5678/csr.2023.789012',
      status: 'published',
      keywords: ['Climate Change', 'Big Data', 'Pattern Recognition']
    },
    {
      id: '3',
      title: 'Urban Navigation Capabilities for Autonomous Drones',
      authors: ['Miguel Rodriguez', 'Sarah Park', 'James Brown'],
      abstract: 'This paper explores algorithmic approaches to enable safe and efficient navigation of autonomous drones in complex urban environments with minimal human intervention.',
      publicationDate: '',
      journal: 'Robotics and Autonomous Systems',
      doi: '',
      status: 'submitted',
      keywords: ['Drones', 'Urban Navigation', 'Autonomous Systems']
    },
    {
      id: '4',
      title: 'Practical Applications of Quantum Algorithms in Modern Cryptography',
      authors: ['Elizabeth Taylor', 'Thomas Lee'],
      abstract: 'This study presents optimized quantum algorithms that offer practical applications in modern cryptographic systems while addressing current implementation constraints.',
      publicationDate: '',
      journal: 'Journal of Quantum Computing',
      doi: '',
      status: 'accepted',
      keywords: ['Quantum Computing', 'Cryptography', 'Algorithms']
    }
  ]);
  
  // Initialize data from context if available
  useEffect(() => {
    if (publications && publications.length > 0) {
      setPublicationsData(publications);
    }
  }, [publications]);

  // Filter publications based on search term and status
  const filteredPublications = publicationsData.filter(pub => {
    const matchesSearch = searchTerm === '' || 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pub.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || pub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddPublication = () => {
    setShowAddModal(true);
  };

  const handleEditPublication = (publication: Publication) => {
    setSelectedPublication(publication);
    setShowEditModal(true);
  };

  const handleDeletePublication = (publicationId: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      setPublicationsData(prev => prev.filter(pub => pub.id !== publicationId));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="publications-management">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Publications Management</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          onClick={handleAddPublication}
        >
          <FaPlus className="mr-2" /> Add Publication
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
            <option value="accepted">Accepted</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredPublications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'No publications match your search criteria.' 
              : 'No publications found. Add your first publication using the button above.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Authors</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Journal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPublications.map((publication) => (
                <tr key={publication.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaFileAlt className="text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {publication.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {publication.authors.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {publication.journal}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(publication.status)}`}>
                      {publication.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {publication.publicationDate 
                        ? new Date(publication.publicationDate).toLocaleDateString() 
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditPublication(publication)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeletePublication(publication.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Publication Modal (simplified for brevity) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Publication</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              
              {/* Form fields would go here */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Publication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Publication Modal (simplified for brevity) */}
      {showEditModal && selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Publication</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              
              {/* Form fields would go here */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Publication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsManagement; 