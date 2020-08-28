import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import { Link } from "react-router-dom";
import axios from "axios";
import { LazyImage } from "../../components/LazyImage";

const properties = {
  duration: 4000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  pauseOnHover: true,
};

const SlideshowSlide = ({ imgURL, _id, topicTitle }) => {
  return (
    <div className="slide-container">
      <Slide {...properties}>
        {imgURL.map((img, index) => {
          return (
            <Link to={`/topics/${_id}`} key={index}>
              <div className="each-slide">
                <LazyImage src={img.url} styles={{height: "300px", backgroundSize: "cover"}}>
                  <div
                    style={{
                      display: "table",
                      height: "unset",
                      width: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    <span style={{}}>{topicTitle}</span>
                  </div>
                </LazyImage>
              </div>
            </Link>
          );
        })}
      </Slide>
    </div>
  );
};

const FavouriteTopics = () => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/topics/favourite").then((res) => {
      console.log(res.data)
      res.data.success && setData(res.data.result)
    });

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    // let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    // let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // this.setState({ windowWidth, windowHeight });
    // if (this.state.windowWidth < 768) {
    //   this.setState({ visibility: "none" });
    // } else {
    //   this.setState({ visibility: "block" });
    // }
  };

  return (
    <div className="row">
      {Data.map((topic, index) => {
        return (
          <div className="col-md-4" key={index}>
            <SlideshowSlide
              imgURL={topic.imageURL}
              topicTitle={topic.title}
              _id={topic._id}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FavouriteTopics;
