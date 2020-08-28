import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Control = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    updateDimensions()
    window.addEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    renderData()
    console.log(isMobile)
  }, [isMobile])

  const updateDimensions = () => {
    let width = typeof window !== "undefined" ? window.innerWidth : 0;
    setWindowWidth(width);
    console.log(width)
    if (width < 576) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const renderData = () => {
    if (!isMobile) {
      return (
        <div className="list-group mr-md-3 w-20" style={{ width: "200px" }}>
          <Link
            className="list-group-item list-group-item-action active"
            to="/admin/location/add"
            onClick={(el) => changeActive(el.target.id)}
            id="them-dia-diem"
          >
            Thêm địa điểm
          </Link>
          <Link
            className="list-group-item list-group-item-action"
            to="/admin/topics/add"
            onClick={(el) => changeActive(el.target.id)}
            id="them-bai-moi"
          >
            Thêm bài mới
          </Link>
          <Link
            className="list-group-item list-group-item-action"
            to="/admin/topics/queue"
            onClick={(el) => changeActive(el.target.id)}
            id="duyet-bai"
          >
            Duyệt bài
          </Link>
          <Link
            className="list-group-item list-group-item-action"
            to="/admin/user"
            onClick={(el) => changeActive(el.target.id)}
            id="quan-ly-tv"
          >
            Quản lý thành viên
          </Link>
          <Link
            className="list-group-item list-group-item-action"
            to="/admin/background"
            id="thay-background"
            onClick={(el) => changeActive(el.target.id)}
          >
            Thay background
          </Link>
        </div>
      );
    } else
      return (
        <div className="dropdown position-absolute">
          <button
            className="btn border border-success dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            id="control-option"
          >
            Thêm địa điểm
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <Link
              className="dropdown-item active"
              to="/admin/location/add"
              onClick={(el) => changeActiveMobile(el.target.id)}
              id="them-dia-diem"
            >
              Thêm địa điểm
            </Link>
            <Link
              className="dropdown-item"
              to="/admin/topics/add"
              onClick={(el) => changeActiveMobile(el.target.id)}
              id="them-bai-moi"
            >
              Thêm bài mới
            </Link>
            <Link
              className="dropdown-item"
              to="/admin/topics/queue"
              onClick={(el) => changeActiveMobile(el.target.id)}
              id="duyet-bai"
            >
              Duyệt bài
            </Link>
            <Link
              className="dropdown-item"
              to="/admin/user"
              onClick={(el) => changeActiveMobile(el.target.id)}
              id="quan-ly-tv"
            >
              Quản lý thành viên
            </Link>
            <Link
              className="dropdown-item"
              to="/admin/background"
              id="thay-background"
              onClick={(el) => changeActiveMobile(el.target.id)}
            >
              Thay background
            </Link>
          </div>
        </div>
      );
  };

  const changeActive = (el) => {
    const list = document.getElementsByClassName("list-group-item");
    for (let index = 0; index < list.length; index++) {
      if (list[index].classList.contains("active")) {
        list[index].classList.remove("active");
      }
      if (list[index].id === el) {
        document.getElementById(el).classList.add("active");
      }
    }
  };
  const changeActiveMobile = (el) => {
    const list = document.getElementsByClassName("dropdown-item");
    for (let index = 0; index < list.length; index++) {
      if (list[index].classList.contains("active")) {
        list[index].classList.remove("active");
      }
      if (list[index].id === el) {
        document.getElementById(el).classList.add("active");
        document.getElementById(
          "control-option"
        ).innerText = document.getElementById(el).innerText;
      }
    }
  };

  return renderData();
}

export default Control;
