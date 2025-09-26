import React, { useState, useEffect } from 'react';

interface GalleryImage {
  id: string;
  url: string;
  createdAt?: string;
  title?: string;
}

interface GalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (imageUrl: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ isOpen, onClose, onSelectImage }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchImages = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://eslabobvkchgpokxszwv.supabase.co/functions/v1/banana-public-gallery?page=${pageNum}&limit=18&sort=newest`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch gallery images');
      }

      const result = await response.json();

      // Handle the nested data structure from the API
      const imageData = result.data?.images || result.images || [];
      const pagination = result.data?.pagination || result.pagination;

      if (pageNum === 1) {
        setImages(imageData);
      } else {
        setImages(prev => [...prev, ...imageData]);
      }

      // Check if there are more pages based on pagination or image count
      if (pagination) {
        setHasMore(pagination.has_more || false);
      } else {
        setHasMore(imageData.length === 18);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages(1);
      setPage(1);
    }
  }, [isOpen]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleUseImage = () => {
    if (selectedImage && onSelectImage) {
      onSelectImage(selectedImage);
      setSelectedImage(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/90 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Gallery</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close gallery"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id || image.url}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => handleImageClick(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && images.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && images.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">No images available</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-60 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close preview"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />

            {onSelectImage && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={handleUseImage}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-500 transition-all"
                >
                  Use This Image
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;