import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./topic.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./topic.css";
// import auth from "../../js/auth";
import Profile from "../../js/UserProfile";
import ReactPaginate from "react-paginate";
const ReactMarkdown = require("react-markdown");

mapboxgl.accessToken =
  "pk.eyJ1IjoicXVhbnByb2xhemVyIiwiYSI6ImNrYm5hZmttaDAxN3MyeGxtencyYWd2angifQ.VKBXUYphf13jquJZ4yJOGA";

function Topic(props) {
  const [topic, setTopic] = useState([]);
  const [listImg, setListImg] = useState([]);
  const [DataComments, setDataComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [map, setMap] = useState(null);
  const [newComment, setNewComment] = useState();
  const [like, setLike] = useState(false);
  const [countLike, setCountLike] = useState(0);
  const [imgZoom, setImgZoom] = useState(null);

  const [offset, setoffset] = useState(0);
  const [perPage, setperPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    getTopic();
  }, []);

  const getTopic = () => {
    axios
      .get("/api/topics/" + props.match.params.id, {
        params: {
          userID: Profile.getUserId(),
          role: Profile.getUserRole(),
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.success) {
          return props.history.push("/");
        }
        let result = response.data.result;
        result.username = response.data.username;
        setTopic(result);
        setCountLike(result.like.length);
        setLike(result.liked);
        setListImg(result.imageURL);
        setDataComments(result.comments);
        const slice = result.comments.slice(offset, offset + perPage);
        setComments(slice);
        setPageCount(Math.ceil(result.comments.length / perPage));
      });
  };

  useEffect(() => {
    setPageCount(Math.ceil(DataComments.length / perPage));
    getComments();
  }, [currentPage, DataComments]);

  const getComments = () => {
    const slice = DataComments.slice(offset, offset + perPage);
    setComments(slice);
    setPageCount(Math.ceil(DataComments.length / perPage));
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  }, [windowWidth]);

  const updateDimensions = () => {
    let width = typeof window !== "undefined" ? window.innerWidth : 0;
    setWindowWidth(width);
    if (windowWidth < 576) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: topic.coor,
        zoom: 12,
      });
    };
    if (topic.coor) initializeMap({ setMap, mapContainer });
  }, [topic.coor]);

  const renderListImg = listImg.map((img, index) => {
    const heightOfImgCon = document.getElementById("img-container")
      .clientHeight;
    const height = heightOfImgCon - 70 * listImg.length;
    const margin = height / listImg.length;
    return (
      <img
        data-toggle="modal"
        data-target="#exampleModal"
        src={img.url}
        value={img.url}
        onClick={() => zoomImg(img.url)}
        className="card-img mb-md-2"
        id="img-item"
        style={{ marginBottom: margin }}
        key={index}
      />
    );
  });

  const zoomImg = (url) => {
    setImgZoom(url);
  };

  const imgThumb = () => {
    if (topic.imageURL != null)
      return (
        <div
          className="img-thumbnail"
          style={{
            backgroundImage: `url(${topic.imageURL[0].url})`,
          }}
        ></div>
      );
  };

  const commentList = comments.map((comment, index) => {
    return (
      <div className="list-group-item list-group-item-action" key={index}>
        <div className="d-flex w-100 justify-content-between">
          <small>{comment.time}</small>
        </div>
        <p className="mb-1">{comment.text}</p>
        <small className="username">{comment.username}</small>
      </div>
    );
  });

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setoffset(offset);
  };

  const onCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!Profile.isLogin()) {
      alert("Đăng nhập để có thể bình luận");
      window.location = "/login";
    } else {
      document.getElementById("commentTextA").value = "";

      axios.put("/api/topics/" + props.match.params.id + "/comments", {text: newComment}).then((res) => {
        if (res.data.success) {
          setDataComments([res.data.newComment, ...DataComments]);
        }
      });
    }
  };

  const handleLike = (e) => {
    if (!Profile.isLogin()) {
      alert("Bạn phải đăng nhập mới có thể thích bài viết");
      return (window.location = "/login");
    }
    const data = {
      userID: Profile.getUserId(),
      role: Profile.getUserRole()
    };
    axios.put("/api/topics/" + props.match.params.id + "/like", data).then((res) => {
      if (res.data.success) {
        setLike(!like);
        setCountLike(res.data.countLike);
      }
    });
  };

  return (
    <div>
      <div
        className="modal fade pr-0"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-xl"
          style={{ verticalAlign: "center", height: "100%" }}
        >
          <img
            src={imgZoom}
            style={{
              width: "100%",
              height: "80%",
              position: "absolute",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
      {imgThumb()}
      <div className="container">
        <div className="row">
          <div className="jumbotron my-md-3 p-2 p-md-4 my-3 w-100">
            <h1 className="display-4">{topic.title}</h1>
            <p className="lead">{topic.description}</p>
            <p className="lead text-info">{topic.address_pri}</p>
            <p className="lead text-info">{topic.address_sec}</p>
            <hr className="my-4" />
            <div className="d-flex">
              <p className="mr-5">Lượt xem: {topic.watched}</p>
              <p>Lượt thích: {countLike}</p>
            </div>
            <button
              className="btn btn-primary button-small"
              role="button"
              value={like}
              onClick={(e) => handleLike(e, "value")}
            >
              {like ? "Bỏ thích" : "Thích"}
            </button>
            <p className="lead text-muted mt-2">Người đăng: {topic.author}</p>
          </div>

          <div className="d-flex w-100 justify-content-between">
            <div className="col-7 card">
              {!isMobile ? (
                <ReactMarkdown className="text-body" source={topic.body} />
              ) : (
                <ReactMarkdown
                  className="text-body"
                  style={{ fontSize: "1rem", lineHeight: "1.2rem" }}
                  source={topic.body}
                />
              )}
            </div>

            <div className="col-4 card px-md-2 px-1">
              <div className="card-body p-md-2 p-0" id="img-container">
                {renderListImg}
              </div>
            </div>
          </div>

          <div className="card col-12 mt-5">
            <div className="card-body">
              <p className="card-title">Bản đồ</p>
              <div
                ref={(el) => (mapContainer.current = el)}
                className="map-container topic"
              ></div>
            </div>
          </div>

          <div className="card col-12 mt-5">
            <div className="input-group mb-3 card-body">
              <textarea
                type="text"
                className="form-control"
                placeholder="Thêm bình luận"
                onChange={onCommentChange}
                id="commentTextA"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                  onClick={onSubmit}
                >
                  Gửi
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="list-group">{commentList}</div>
            </div>
            <ReactPaginate
              previousLabel={"Trước"}
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextLabel={"Tiếp theo"}
              nextClassName="page-item"
              nextLinkClassName="page-link"
              pageLinkClassName="page-link"
              breakLabel={
                <Link to="" className="page-link">
                  ...
                </Link>
              }
              breakClassName="page-item"
              pageClassName="page-item"
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topic;
