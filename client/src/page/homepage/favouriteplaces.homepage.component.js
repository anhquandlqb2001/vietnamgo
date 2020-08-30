import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./favouriteplaces.css";

const SlideItem = (props) => (
  <div className="col-md-3 col-sm-6 favour_place-container">
    <Link
      to={{
        pathname: `/topics/search`,
        search: `address=${props.item.address}`,
        state: { search: props.item.address },
      }}
    >
      <img
        src={`${props.item.image[0].main}`}
        alt="first-img"
        className="w-100"
      />
    </Link>
    <div>
      <p className="favouritePlace_address">{props.item.address}</p>
      <p className="favouritePlace_totalWatch">
        {props.item.totalWatch} lượt xem
      </p>
    </div>
  </div>
);

const FavourPlace = () => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/location/favourite").then((res) => {
      setData(res.data);
    });
  }, []);

  const listSlide = Data.map((item, index) => {
    return <SlideItem item={item} key={index} />;
  });

  return (
    <div className="text-center mt-4 my-3">
      <h2 className="my-2 my-md-3">Điểm đến ưa thích</h2>
      <div className="row">{listSlide}</div>
    </div>
  );
};

export default FavourPlace;
