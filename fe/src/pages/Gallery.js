import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Image from '../assets/sample.jpg'
import './GalleryGrid.css'
import { TopSection } from './About';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Sample gallery items with higher resolution images
const defaultGalleryItems = [
  { id: 'item1', image: Image, title: 'Gallery Image 1' },
  { id: 'item2', image: Image, title: 'Gallery Image 2' },
  { id: 'item3', image: Image, title: 'Gallery Image 3' },
  { id: 'item4', image: Image, title: 'Gallery Image 4' },
  { id: 'item5', image: Image, title: 'Gallery Image 5' },
  { id: 'item6', image: Image, title: 'Gallery Image 6' },
  { id: 'item7', image: Image, title: 'Gallery Image 7' },
  { id: 'item8', image: Image, title: 'Gallery Image 8' },
  { id: 'item9', image: Image, title: 'Gallery Image 9' },
  { id: 'item10', image: Image, title: 'Gallery Image 10' },
  { id: 'item11', image: Image, title: 'Gallery Image 10' },
  { id: 'item12', image: Image, title: 'Gallery Image 10' },


];

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
  return (
    <div className="gallery-item" onClick={() => onClick(item)}>
      {loading && <div className="loading-indicator">Loading...</div>}
      <div className="gallery-item-content">
        <img
          src={item.image}
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
    setSelectedImage(item);
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
          <div key={item.id}>
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
const GalleryPage = ({ items = defaultGalleryItems }) => {
  return (
    <>
          <TopSection heading={'Gallery'}/>

    <div className="gallery-page">
      <main>
        <GalleryGrid items={items} />
      </main>
    </div>
    </>
  );
};

export default GalleryPage


