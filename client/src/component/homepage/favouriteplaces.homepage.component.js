import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SlideItem = (props) => (
  <div
    className="col-md-3 col-sm-6 mt-sm-4 mt-4 favour_place-container"
    style={{ height: props.style.height }}
  >
    <Link
      to={{
        pathname: `/topics/search`,
        search: `address=${props.item.address}`,
        state: { search: props.item.address },
      }}
    >
      <img
        src={`/${props.item.image[0].filename}`}
        alt="first-img"
        style={{
          visibility: props.style.visibility,
        }}
      />
    </Link>
    <div>
      <p>{props.item.address}</p>
      <p>{props.item.totalWatch} lượt xem</p>
    </div>
  </div>
);

export default class FavourPlace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      windowWidth: 0,
      windowHeight: 0,
    };

    this.updateDimensions = this.updateDimensions.bind(this);
  }
  componentDidMount() {
    axios.get("/").then((res) => {
      console.log('a', res.data)
      this.setState({
        data: res.data,
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
  }

  listSlide() {
    try {
      return this.state.data.map((item, index) => {
        const Large = {
          // ≥992px
        };
        const Medium = {
          // ≥768px
          height: '250px'
        };

        const Small = {
          // ≥576px
        };

        const	ExtraSmall = {
          index: 2
        }

        const styles =
          this.state.windowWidth >= 992
            ? Large
            : this.state.windowWidth >= 768
            ? Medium
            : this.state.windowWidth >= 576
            ? Small
            : ExtraSmall

        return <SlideItem item={item} key={index} style={styles} /> 
        
      });
    } catch (error) {}
  }

  render() {
    return (
      <div className="text-center mt-4 my-3">
        <h2>Điểm đến ưa thích</h2>
        <div className="row">{this.listSlide()}</div>
      </div>
    );
  }
}
