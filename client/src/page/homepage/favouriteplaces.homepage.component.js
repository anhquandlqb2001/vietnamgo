import React, { useState, useEffect } from "react";
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
        src={`${props.item.image[0].url}`}
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

const FavourPlace = () => {
  const [Data, setData] = useState([]);
  const [WindowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    axios.get("/api/location/favourite").then((res) => {
      setData(res.data);
    });

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    setWindowWidth(windowWidth);
  };

  const listSlide = Data.map((item, index) => {
    const Large = {
      // ≥992px
    };
    const Medium = {
      // ≥768px
      height: "250px",
    };

    const Small = {
      // ≥576px
    };

    const ExtraSmall = {
      index: 2,
    };

    const styles =
      WindowWidth >= 992
        ? Large
        : WindowWidth >= 768
        ? Medium
        : WindowWidth >= 576
        ? Small
        : ExtraSmall;
    return <SlideItem item={item} key={index} style={styles} />;
  });

  return (
    <div className="text-center mt-4 my-3">
      <h2>Điểm đến ưa thích</h2>
      <div className="row">{listSlide}</div>
    </div>
  );
};

export default FavourPlace;
