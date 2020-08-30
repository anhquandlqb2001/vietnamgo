import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import { Link } from "react-router-dom";
import axios from "axios";
import { LazyImage } from "../../components/LazyImage";
import "./favouritetopics.css";
import Ticker from "react-ticker";

const properties = {
  duration: 4000,
  transitionDuration: 500,
  infinite: true,
  pauseOnHover: true,
};

const SlideshowSlide = ({ imgURL, _id, topicTitle }) => {
  return (
    <div className="slide-container">
      <Ticker speed={3} offset="2">
        {({ index }) => (
          <p
            style={{
              textOverflow: "hidden",
              width: "600px",
              marginBottom: "5px",
              cursor: "pointer",
            }}
          >
            {topicTitle}
          </p>
        )}
      </Ticker>
      <Slide {...properties}>
        {imgURL.map((img, index) => {
          return (
            <Link to={`/topics/${_id}`} key={index}>
              <div className="each-slide">
                <LazyImage
                  src={img.dashboard ? img.dashboard : img.url}
                  styles={{
                    height: "300px",
                    backgroundSize: "cover",
                    width: "100%",
                  }}
                ></LazyImage>
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
      console.log(res.data);
      res.data.success && setData(res.data.result);
    });
  }, []);

  return (
    <div className="row mb-md-4 favouriteTopic_container">
      {Data.map((topic, index) => {
        return (
          <div className="col-md-4 " key={index}>
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
