import React, { Component } from "react";
import "./style.homepage.css";
import axios from "axios";

const SlideItem = (props) => {
  if (props.index == 0) {
    return (
      <div className="carousel-item active">
        <img src={props.img.filename} className="d-block w-100" alt="..." />
      </div>
    );
  }
  return (
    <div className="carousel-item">
      <img src={props.img.filename} className="d-block w-100" alt="..." />
    </div>
  );
};

export default class SlideShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: [],
    };
  }

  componentDidMount() {
    axios.get("/api/slideimg").then((res) => {
      const result = res.data !== undefined ? res.data[0].img : "";
      this.setState({
        image: res.data,
      });
      try {
        const SlideList = result.map((el, index) => {
          return <SlideItem img={el} index={index} key={index}/>;
        });

        this.setState({
          SlideList,
        });
      } catch (e) {}
    });
  }

  render() {
    return (
      <div className="carousel-container">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            {/* <div className="carousel-item active">
              <img
                src="https://images.unsplash.com/photo-1592961170215-dbb7b3e5ba04?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
                className="d-block w-100"
                alt="..."
              />
            </div> */}
            {this.state.SlideList}
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
}
