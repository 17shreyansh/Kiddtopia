import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Typography } from "antd";

const { Title } = Typography;

const Gallery = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/home/Gallery`);
        const imagesFromApi = response?.data?.content?.images;

        if (Array.isArray(imagesFromApi)) {
          setImages(imagesFromApi);
        } else {
          setImages([]); // fallback to prevent `.map()` errors
        }
      } catch (err) {
        console.error("Failed to load gallery images:", err);
        setImages([]); // fallback in case of error
      }
    };

    fetchImages();
  }, []);


  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: windowWidth <= 480 ? 2 : windowWidth <= 768 ? 2 : 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    draggable: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 }
      }
    ]
  };

  return (
    <div style={{ padding: "40px" }}>
      <Title
        level={3}
        style={{
          color: "#1B71C4",
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "Rowdies",
          fontSize: "40px"
        }}
      >
        Gallery
      </Title>

      <Slider {...settings}>
        {images?.map((img, idx) => (
          <div key={idx} style={{ padding: 10 }}>
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                height: windowWidth <= 768 ? 200 : 500,
                margin: "0 5px"
              }}
            >
              <img
                src={`${img}`}
                alt={`gallery-${idx}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        ))}

      </Slider>
    </div>
  );
};

export default Gallery;
