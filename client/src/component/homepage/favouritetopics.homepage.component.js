import React, { useEffect, useState, Component } from "react";
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

const SlideshowSlide = (props) => {
  return (
    <div className="slide-container">
      <Slide {...properties}>
        {props.topicImgURL.map((img) => {
          return (
            <Link to={`/topics/${props.topicURL}`}>
              <div className="each-slide">
                <div
                  style={{
                    backgroundImage: `url(http://localhost:5000/${img.filename})`,
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
                    <span style={{}}>{props.topicTitle}</span>
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

export default class FavouriteTopics extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      topic1ImgURL: [],
      topic2ImgURL: [],
      topic3ImgURL: [],
      topic1Title: "",
      topic2Title: "",
      topic3Title: "",
      topic1URL: "",
      topic2URL: "",
      topic3URL: "",
      windowWidth: 1000,
      windowHeight: 1000,
      visibility: "block",
    };

    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    axios.get("http://localhost:5000/topics/favourite").then((res) => {
      console.log(res.data)
      this.setState({
        topic1ImgURL: res.data.topics[0].imageURL,
        topic2ImgURL: res.data.topics[1].imageURL,
        topic3ImgURL: res.data.topics[2].imageURL,
        topic1Title: res.data.topics[0].title,
        topic2Title: res.data.topics[1].title,
        topic3Title: res.data.topics[2].title,
        topic1URL: res.data.topics[0]._id,
        topic2URL: res.data.topics[1]._id,
        topic3URL: res.data.topics[2]._id,
      });
    });

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    this.setState({ windowWidth, windowHeight });
    if (this.state.windowWidth < 768) {
      this.setState({ visibility: "none" });
    } else {
      this.setState({ visibility: "block" });
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <SlideshowSlide
            topicTitle={this.state.topic1Title}
            topicURL={this.state.topic1URL}
            topicImgURL={this.state.topic1ImgURL}
          />
        </div>
        <div className="col-md-4">
          <SlideshowSlide
            topicTitle={this.state.topic2Title}
            topicURL={this.state.topic2URL}
            topicImgURL={this.state.topic2ImgURL}
          />
        </div>
        <div className="col-md-4" style={{ display: this.state.visibility }}>
          <SlideshowSlide
            topicTitle={this.state.topic3Title}
            topicURL={this.state.topic3URL}
            topicImgURL={this.state.topic3ImgURL}
          />
        </div>
      </div>
    );
  }
}
