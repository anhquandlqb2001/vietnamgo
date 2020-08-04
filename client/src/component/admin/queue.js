import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import "./style.css";
// import mapboxgl from "mapbox-gl";
import ReactPaginate from "react-paginate";
import UserProfile from "../../js/UserProfile";
import auth from "../../js/auth";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoicXVhbnByb2xhemVyIiwiYSI6ImNrYm5hZmttaDAxN3MyeGxtencyYWd2angifQ.VKBXUYphf13jquJZ4yJOGA";

function Queue() {
  const [Topics, setTopics] = useState([]);
  const [offset, setoffset] = useState(0);
  const [perPage, setperPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [coor, setCoor] = useState([108.2772, 14.0583]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentStyle, setCurrentStyle] = useState(null);
  // const [map, setMap] = useState(null);
  // const mapContainer = useRef(null);

  // useEffect(() => {
  //   const initializeMap = ({ setMap, mapContainer }) => {
  //     const map = new mapboxgl.Map({
  //       container: mapContainer.current,
  //       style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  //       center: coor,
  //       zoom: 6,
  //     });

  //     map.on("load", () => {
  //       setMap(map);
  //       map.resize();
  //     });
  //   };
  //   if (!map) initializeMap({ setMap, mapContainer });
  // }, [map]);

  useEffect(() => {
    getTopics();
  }, [currentPage]);

  const getTopics = () => {
    axios.get(`/api/topics/queue`, {params: { role: UserProfile.getUserRole(), id: UserProfile.getUserId() }}).then((res) => {
      const data = res.data.tops;
      const slice = data.slice(offset, offset + perPage);
      setTopics(slice);
      setperPage(10);
      setPageCount(Math.ceil(data.length / perPage));
    });
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setoffset(offset);
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  }, [windowWidth]);

  const styleMobile = {
    height: "180px",
  };

  const updateDimensions = () => {
    let width = typeof window !== "undefined" ? window.innerWidth : 0;
    setWindowWidth(width);
    if (windowWidth < 576) {
      setCurrentStyle(styleMobile);
    } else {
      setCurrentStyle(null);
    }
  };

  const postData = Topics.map((topic, index) => {
    return (
      <div
        className="card mb-3 card-child-container overflow-auto"
        style={currentStyle}
        key={index}
      >
        <div className="row no-gutters">
          <div className="col-md-4 col-4">
            <Link to={`/topics/${topic._id}`}>
              <img
                src={`/${topic.imageURL[0].filename}`}
                alt="img"
                className="card-img"
                style={currentStyle}
              />
            </Link>
          </div>
          <div
            className="col-md-8 col-8 card-right h-100"
            id={topic._id}
            // onClick={() => {
            //   changeLocation(topic.coor, topic._id);
            // }}
          >
            <div className="card-body p-1">
              <Link to={`/topics/${topic._id}`}>
                <h5 className="card-title mb-1">{topic.title}</h5>
              </Link>
              <p className="card-text description m-0">{topic.description}</p>
              <div className="mt-md-4">
                <p className="card-text m-0">
                  <small className="text-muted">
                    Ngày đăng: {topic.date.split("T")[0]}
                  </small>
                </p>
                {(auth.isCreator(UserProfile.getUserRole()) &&
                  UserProfile.getUserId() === topic.userID) ||
                auth.isAdmin(UserProfile.getUserRole()) ? (
                  <div className="d-flex ml-4 admin-options">
                    <Link
                      to={{
                        pathname: `/topics/edit/${topic._id}`,
                        state: {
                          userID: topic.userID,
                        },
                      }}
                      className="btn btn-sm btn-warning mr-2"
                    >
                      Chỉnh sửa
                    </Link>
                    <p
                      href="#"
                      onClick={() => {
                        deleteTopic(topic._id, topic.userID);
                      }}
                      className="btn btn-sm btn-danger m-0"
                    >
                      Xoá
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                {topic.status === "queue" &&
                auth.isAdmin(UserProfile.getUserRole()) ? (
                  <div className="d-flex justify-content-between mt-1">
                    <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                      Đang chờ duyệt
                    </p>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => accept(topic._id)}
                    >
                      Duyệt
                    </button>
                  </div>
                ) : topic.status === "queue" &&
                  auth.isCreator(UserProfile.getUserRole()) ? (
                  <div>
                    <p className="text-muted">Đang chờ duyệt</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const deleteTopic = (id, userID) => {
    axios
      .delete("/api/topics/" + id, {
        params: {
          role: UserProfile.getUserRole(),
          userID: userID,
          userIDDelete: UserProfile.getUserId(),
        },
      })
      .then((response) => {
        console.log(response.data);
      });

    setTopics(Topics.filter((el) => el._id != id));
  };

  // const changeLocation = (coor, id) => {
  //   setCoor(coor);
  //   document.getElementById(id).addEventListener("click", function () {
  //     map.flyTo({
  //       center: coor,
  //       essential: true,
  //       zoom: 12,
  //     });
  //   });
  // };

  const accept = (id) => {
    axios.post("/api/topics/accept/" + id).then((res) => console.log(res.data));

    setTopics(Topics.filter((el) => el._id != id));
  };

  return (
    <div style={{  }} className="container">
      <div style={{  }}>
        {Topics=='' ? <h1 className="text-center">Chưa có bài viết nào</h1> : ''}
        {postData}

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
      {/* <div
          ref={(el) => (mapContainer.current = el)}
          id="map-container"
          className="map-container col-md-6 d-none d-md-block"
        ></div> */}
    </div>
  );
}

export default Queue;
