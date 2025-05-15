import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './GalleryGrid.css';
import { TopSection } from './About';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Grid layout configuration
const layouts = {
  lg: [
    { i: 'item1',  x: 0,    y: 0,  w: 1,    h: 2 },
    { i: 'item2',  x: 1,    y: 0,  w: 1,    h: 4 },
    { i: 'item3',  x: 2,    y: 0,  w: 1,    h: 2 },
    { i: 'item4',  x: 0,    y: 2,  w: 0.5,  h: 2 },
    { i: 'item5',  x: 0.5,  y: 2,  w: 0.5,  h: 2 },
    { i: 'item6',  x: 2,    y: 2,  w: 1,    h: 2 },
    { i: 'item7',  x: 0,    y: 4,  w: 1.5,  h: 3 },
    { i: 'item8',  x: 1.5,  y: 4,  w: 0.75, h: 1.5 },
    { i: 'item9',  x: 2.25, y: 4,  w: 0.75, h: 1.5 },
    { i: 'item10', x: 1.5,  y: 5.5, w: 1.5, h: 4.5 },
    { i: 'item11', x: 0,    y: 7,  w: 0.75, h: 3 },
    { i: 'item12', x: 0.75, y: 7,  w: 0.75, h: 3 },
  ],
  md: [
    { i: 'item1',  x: 0,    y: 0,  w: 1,    h: 2 },
    { i: 'item2',  x: 1,    y: 0,  w: 1,    h: 4 },
    { i: 'item3',  x: 2,    y: 0,  w: 1,    h: 2 },
    { i: 'item4',  x: 0,    y: 2,  w: 0.5,  h: 2 },
    { i: 'item5',  x: 0.5,  y: 2,  w: 0.5,  h: 2 },
    { i: 'item6',  x: 2,    y: 2,  w: 1,    h: 2 },
    { i: 'item7',  x: 0,    y: 4,  w: 1.5,  h: 3 },
    { i: 'item8',  x: 1.5,  y: 4,  w: 0.75, h: 1.5 },
    { i: 'item9',  x: 2.25, y: 4,  w: 0.75, h: 1.5 },
    { i: 'item10', x: 1.5,  y: 5.5, w: 1.5, h: 4.5 },
    { i: 'item11', x: 0,    y: 7,  w: 0.75, h: 3 },
    { i: 'item12', x: 0.75, y: 7,  w: 0.75, h: 3 },
  ],
  sm: [
    { i: 'item1', x: 0, y: 0, w: 2, h: 3 },
    { i: 'item2', x: 0, y: 3, w: 2, h: 2 },
    { i: 'item3', x: 0, y: 5, w: 2, h: 3 },
    { i: 'item4', x: 0, y: 8, w: 1, h: 2 },
    { i: 'item5', x: 1, y: 8, w: 1, h: 2 },
    { i: 'item6', x: 0, y: 10, w: 2, h: 3 },
    { i: 'item7', x: 0, y: 13, w: 2, h: 2 },
    { i: 'item8', x: 0, y: 15, w: 2, h: 2 },
    { i: 'item9', x: 0, y: 17, w: 2, h: 2 },
    { i: 'item10', x: 0, y: 19, w: 2, h: 3 },
    { i: 'item11', x: 0, y: 22, w: 1, h: 2 },
    { i: 'item12', x: 1, y: 22, w: 1, h: 2 },
  ],
};

// ImageModal
const ImageModal = ({ isOpen, image, title, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={image} alt={title} />
        {title && <div className="modal-title">{title}</div>}
      </div>
    </div>
  );
};

// GalleryItem
const GalleryItem = ({ item, onClick }) => {
  const [loading, setLoading] = useState(true);
  
  // Construct full image URL
  const imageUrl = item.image.startsWith('http') 
    ? item.image 
    : `${process.env.REACT_APP_BACKEND_URL}/${item.image.startsWith('/') ? item.image.substring(1) : item.image}`;
  
  return (
    <div className="gallery-item" onClick={() => onClick(item)}>
      {loading && <div className="loading-indicator">Loading...</div>}
      <div className="gallery-item-content">
        <img
          src={imageUrl}
          alt={item.title}
          onLoad={() => setLoading(false)}
          style={{ opacity: loading ? 0 : 1 }}
        />
      </div>
    </div>
  );
};

// GalleryGrid
const GalleryGrid = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (item) => {
    // Construct full image URL for modal
    const imageUrl = item.image.startsWith('http') 
      ? item.image 
      : `${process.env.REACT_APP_BACKEND_URL}/${item.image.startsWith('/') ? item.image.substring(1) : item.image}`;
    
    setSelectedImage({...item, image: imageUrl});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="gallery-grid-container">
      <ResponsiveGridLayout
        className="gallery-grid"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 5, md: 3, sm: 2 }}
        rowHeight={100}
        isDraggable={false}
        isResizable={false}
      >
        {items.map((item) => (
          <div key={item.itemId}>
            <GalleryItem item={item} onClick={openModal} />
          </div>
        ))}
      </ResponsiveGridLayout>

      <ImageModal
        isOpen={modalOpen}
        image={selectedImage?.image}
        title={selectedImage?.title}
        onClose={closeModal}
      />
    </div>
  );
};

// GalleryPage
const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/gallery/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort the items by order property
        const sortedItems = data.sort((a, b) => a.order - b.order);
        setGalleryItems(sortedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  return (
    <>
      <TopSection heading={'Gallery'} />
      <div className="gallery-page">
        <main>
          {loading && <div className="loading-container">Loading gallery...</div>}
          {error && <div className="error-container">Error loading gallery: {error}</div>}
          {!loading && !error && galleryItems.length > 0 && <GalleryGrid items={galleryItems} />}
          {!loading && !error && galleryItems.length === 0 && <div className="no-items">No gallery items found.</div>}
        </main>
      </div>
    </>
  );
};

export default GalleryPage;