import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const ChangeBackground = () => {
  const [Data, setData] = useState([]);
  const [Progress, setProgress] = useState(false);

  const SlidePreview = (props) => {
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

  const Preview = [...Data].map((element, index) => {
    return (
      <SlidePreview
        img={URL.createObjectURL(element)}
        index={index}
        key={index}
      />
    );
  });

  const onSaveSlideImage = () => {
    const fd = new FormData();
    for (let index = 0; index < Data.length; index++) {
      const element = Data[index];
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
        setTimeout(() => {
          window.location = "/";
        }, 700);
      } else {
        alert("Cap nhat background that bai");
      }
    });
  };
  return (
    <div className="container">
      <div className="form-group">
        <label for="slide-img">Thay background</label>
        <input
          type="file"
          name="slide-img"
          className="form-control-file btn btn-danger"
          id="slide-img"
          onChange={(event) => setData(event.target.files)}
          multiple
        />
        <button
          className="btn btn-success mt-2"
          type="submit"
          onClick={() => {
            onSaveSlideImage()
            setProgress(!Progress)
          }}
        >
          Lưu
        </button>
        {Progress ? (
          <>
            <div>
              <CircularProgress />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="carousel-container">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <div className="carousel-inner">{Preview}</div>
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
            <span className="sr-only">Truoc</span>
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
            <span className="sr-only">Sau</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChangeBackground;
