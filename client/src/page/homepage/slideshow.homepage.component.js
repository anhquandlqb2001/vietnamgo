import React, { useState, useEffect } from "react";
import "./style.homepage.css";
import axios from "axios";

const SlideItem = ({img, index}) => {
  if (index === 0) {
    return (
      <div className="carousel-item active">
        <img src={img.url} className="d-block w-100" alt="anh" />
      </div>
    );
  }
  return (
    <div className="carousel-item">
      <img loading="lazy" src={img.url} className="d-block w-100" alt="anh" />
    </div>
  );
};

const SlideShow = () => {
  const [Image, setImage] = useState([])

  useEffect(() => {
    axios.get("/api/slideimg").then((res) => {
      console.log(res.data)
      if (res.data.success && res.data.length !== 0) {
        setImage(res.data.result[0].img)
      }
    });
  }, [])

    return (
      <div className="carousel-container">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            {Image.map((img, index) => {
              return <SlideItem img={img} index={index} key={index}/>;
            })}
          </div>
          <a
            className="carousel-control-prev"
            href="#carouselExampleFade"
            role="button"
            data-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#carouselExampleFade"
            role="button"
            data-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
}

export default SlideShow