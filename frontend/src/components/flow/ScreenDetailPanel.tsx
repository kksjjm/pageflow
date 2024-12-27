import React from 'react';
import { X, Image as ImageIcon, Code, Api } from 'lucide-react';

const ScreenDetailPanel = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Screen Details</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Name Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Name</h3>
          <p className="text-sm text-gray-900">{node.data.name}</p>
        </div>

        {/* Description Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-sm text-gray-900">{node.data.description || 'No description available'}</p>
        </div>

        {/* Image Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Preview Image</span>
            </div>
          </h3>
          {node.data.image ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={node.data.image}
                alt={node.data.name}
                className="w-full h-48 object-cover"
              />
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 h-48 flex items-center justify-center">
              <p className="text-sm text-gray-500">No preview image available</p>
            </div>
          )}
        </div>

        {/* Component Info Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Component Information</span>
            </div>
          </h3>
          <div className="bg-gray-50 rounded-lg p-3">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap">
              {JSON.stringify(node.data.componentInfo, null, 2) || 'No component information available'}
            </pre>
          </div>
        </div>

        {/* API Info Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Api className="w-4 h-4" />
              <span>API Information</span>
            </div>
          </h3>
          <div className="bg-gray-50 rounded-lg p-3">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap">
              {JSON.stringify(node.data.apiInfo, null, 2) || 'No API information available'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetailPanel;