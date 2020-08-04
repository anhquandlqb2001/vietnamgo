import React, { useState, useEffect } from "react";
import axios from "axios";

function ChangeBackground() {
  const [imgBgr, setImgBgr] = useState([]);

  const SlideItem = (props) => {
    if (props.index == 0) {
      return (
        <div className="carousel-item active">
          <img
            loading="lazy"
            src={props.img}
            className="d-block w-100"
            alt="..."
          />
        </div>
      );
    }
    return (
      <div className="carousel-item">
        <img
          loading="lazy"
          src={props.img}
          className="d-block w-100"
          alt="..."
        />
      </div>
    );
  };

  const bgrSlide = [...imgBgr].map((element, index) => {
    return <SlideItem img={URL.createObjectURL(element)} index={index} key={index} />;
  });


  const onChangeImage = (e) => {
    setImgBgr(e.target.files);
  };

  const onSaveSlideImage = () => {
    const fd = new FormData();
    for (let index = 0; index < imgBgr.length; index++) {
      const element = imgBgr[index];
      fd.append("slide-img", element);
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios.post("/api/slideimg", fd, config).then((res) => {
      if (res.data.status) {
        alert(res.data.message);
      }
      setTimeout(() => {
        window.location = "/";
      }, 2000);
    });
  };
  return (
    <div className="container">
      <div className="form-group">
        <label>Thay background</label>
        <input
          type="file"
          name="slide-img"
          className="form-control-file btn btn-danger"
          id="slide-img"
          onChange={(event) => onChangeImage(event)}
          multiple
        />
        <button className="btn btn-success mt-2" type="submit" onClick={onSaveSlideImage}>
          Lưu
        </button>
      </div>
      <div className="carousel-container">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <div className="carousel-inner">{bgrSlide}</div>
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
    </div>
  );
}

export default ChangeBackground;
