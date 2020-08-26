import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import { Link } from "react-router-dom";
import axios from "axios";

const properties = {
  duration: 4000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  pauseOnHover: true,
};

const SlideshowSlide = ({imgURL, _id, topicTitle}) => {
  return (
    <div className="slide-container">
      <Slide {...properties}>
        {imgURL.map((img, index) => {
          return (
            <Link to={`/topics/${_id}`} key={index}>
              <div className="each-slide">
                <div
                  style={{
                    backgroundImage: `url(${img.url})`,
                  }}
                >
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
                </div>
              </div>
            </Link>
          );
        })}
      </Slide>
    </div>
  );
};

const FavouriteTopics = () => {

  const [Data, setData] = useState([])

  useEffect(() => {
    axios.get("/api/topics/favourite").then((res) => {
      setData(res.data && res.data.topics)
    });

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    window.removeEventListener("resize", updateDimensions);
  }, [window.innerWidth]);

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
            <SlideshowSlide imgURL={topic.imageURL} topicTitle={topic.title} _id={topic._id} />
          </div>
        );
      })}
    </div>
  );
};

export default FavouriteTopics;
