import { useState, useEffect } from 'react';
import useArrowKeys from './useArrowKeys';

export function ArtGrid({ images, availableTypes }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailWidth, setThumbnailWidth] = useState(60);
  const [filteredImages, setFilteredImages] = useState(images);
  const [selectedType, setSelectedType] = useState('all'); // Default to all

  const sortedTypes = availableTypes.sort((a, b) => a.localeCompare(b));
  if (sortedTypes.includes('other')) {
    sortedTypes.splice(sortedTypes.indexOf('other'), 1);
    sortedTypes.push('other');
  }

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(image => image.type === selectedType));
    }
  }, [selectedType, images]);

  useEffect(() => {
    if (typeof window !== 'object') return;
    if (window.innerWidth <= 640) setThumbnailWidth(34);
  }, []);

  const showNextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
  };

  const showPreviousImage = () => {
    const previousIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(previousIndex);
  };

  useArrowKeys(isModalVisible, showNextImage, showPreviousImage);
  const pct = (thumbnailWidth - 10) / 0.9;

  const isValidDate = (d) => {
    return d instanceof Date && !isNaN(d);
  }

  return (
    <div className="relative leading-[5px]">
      <div className="mb-4">
        <button onClick={() => setSelectedType("all")}>All</button>
        {sortedTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={selectedType === type ? 'active' : ''}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="range"
        min="10"
        max="100"
        className="block w-full h-2 mb-4 rounded-full outline-none appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, rgb(132 204 22 / 0.7) ${pct}%, rgb(132 204 22 / 0.2) ${pct}%)`
        }}
        value={thumbnailWidth}
        onChange={(e) => setThumbnailWidth(e.target.value)}
      />

      {filteredImages?.slice().map((image, index) => (
        <img
          className="inline object-cover !my-0 aspect-square hover:scale-110 transition cursor-pointer"
          key={index}
          src={image.thumbnailUrl}
          width={thumbnailWidth}
          onClick={() => {
            setCurrentIndex(index);
            setIsModalVisible(true);
          }}
        />
      ))}

      {isModalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setIsModalVisible(false)}
        >
          <button
            className="absolute text-3xl text-white transform -translate-y-1/2 left-4 top-1/2"
            onClick={(e) => {
              e.stopPropagation();
              showPreviousImage();
            }}
          >
            &lt;
          </button>
          <div className="flex items-center justify-center w-4/5 h-4/5">
            <img
              className="object-contain max-w-full max-h-full"
              src={filteredImages[currentIndex].imageUrl}
            />
            <p className="absolute bottom-0 w-full text-center text-slate-300/30">
              {isValidDate(filteredImages[currentIndex].date) ? filteredImages[currentIndex].date.toISOString().slice(0, 10) : 'Date Uploaded'}
            </p>

          </div>
          <button
            className="absolute text-3xl text-white transform -translate-y-1/2 right-4 top-1/2"
            onClick={(e) => {
              e.stopPropagation();
              showNextImage();
            }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default ArtGrid;
