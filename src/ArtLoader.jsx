import { useEffect, useState } from 'react';
import { ArtGrid } from '../src/ArtGrid';

const gitHubPages = 'https://cydvilla.github.io/art-images';

export function ArtLoader() {
  const [images, setImages] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    fetch(gitHubPages + '/all-images.json')
      .then((response) => response.json())
      .then((data) => {
        // Convert data to include date objects for sorting
        const processedData = data.map((item) => {
          const dateString = item.file.split('/').pop().split('.')[0];

          const date = new Date(dateString.split('-').slice(0, 3).join('-'));
          const sameDayIndex = dateString.split('-')[3];

          // Extract type from filename. This assumes filenames like: "someuuid TYPE Some Name.jpeg"
          const parts = item.file.split(' ');
          const type = (parts.length > 2) ? parts[1].toLowerCase() : '';

          return {
            ...item,
            type,
            date,
            sameDayIndex,
            imageUrl: gitHubPages + item.file,
            thumbnailUrl: gitHubPages + item.file.replace('images', 'thumbnails')
          };
        });

        // Sort the processed data by date, then by filename
        processedData.sort(
          (b, a) => a.date - b.date || a.sameDayIndex - b.sameDayIndex
        );

        // Extract available types for filtering
        const types = [...new Set(processedData.map(item => item.type))];

        setImages(processedData);
        setAvailableTypes(types);
      })
      .catch((error) => {
        console.error('Error fetching image data:', error);
      });
  }, []);

  return <ArtGrid images={images} availableTypes={availableTypes} />;
}

export default ArtLoader;
