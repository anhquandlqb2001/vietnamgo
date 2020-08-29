import React, { useState, useEffect } from "react";
import data from "../../js/tinh-tp.json";
import axios from "axios";
import "./topic.css";
import Profile from "../../js/UserProfile";
const items = [];

for (const key in data) {
  items.push(data[key].name);
}

const EditTopic = (props) => {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Body, setBody] = useState("");
  const [Address_Pri, setAddress_Pri] = useState("");
  const [Address_Sec, setAddress_Sec] = useState("");
  const [Address, setAddress] = useState([]);
  const [Coor, setCoor] = useState([0, 0]);
  const [File, setFile] = useState([]);
  const [OldImg, setOldImg] = useState([]);
  const [UserID, setUserID] = useState("");

  useEffect(() => {
    axios
      .get("/api/topics/edit/" + props.match.params.id)
      .then((res) => {
        if (!res.data.success) {
          return props.history.push("/");
        } else {
          setTitle(res.data.title);
          setDescription(res.data.description);
          setBody(res.data.body);
          setAddress_Pri(res.data.address_pri);
          setAddress_Sec(res.data.address_sec);
          setCoor(res.data.coor);
          setOldImg(res.data.imageURL);
        }
      })
      .catch((e) => {
        console.log("aa");
        // if (e.response.status === 403) {
        // }
      });

    // axios.get("/api/location").then((res) => {
    //   setAddress(res.data);
    // });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (let index = 0; index < File.length; index++) {
      const element = File[index];
      formData.append("imgUpload", element);
    }
    formData.append("title", Title);
    formData.append("description", Description);
    formData.append("body", Body);
    formData.append("address_pri", Address_Pri);
    formData.append("address_sec", Address_Sec);
    formData.append("date", new Date());
    formData.append("coorx", Coor[0]);
    formData.append("coory", Coor[1]);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .put("/api/topics/update/" + props.match.params.id, formData, config)
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          return (window.location = "/topics/" + props.match.params.id);
        }
        return alert("Cap nhat that bai");
      });
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <div className="form-group col-md-12">
            <label>Tiêu đề</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={Title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            rows="3"
            type="text"
            className="form-control"
            id="description"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Nội dung</label>
          <textarea
            rows="7"
            type="text"
            className="form-control"
            id="body"
            value={Body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label>Địa chỉ</label>
            <div className="d-flex">
              <select
                id="inputState"
                className="form-control"
                value={Address_Pri}
                onChange={(e) => setAddress_Pri(e.target.value)}
              >
                <option></option>
                {Address.map((item) => {
                  return (
                    <option key={item.address} value={item.address}>
                      {item.address}
                    </option>
                  );
                })}
              </select>
              <input
                value={Address_Sec}
                onChange={(e) => setAddress_Sec(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-3">
            <label>Toạ độ: Coor-x</label>
            <input
              type="text"
              className="form-control"
              id="coorx"
              value={Coor[0]}
              onChange={(e) => setCoor([e.target.value, Coor[1]])}
            />
          </div>
          <div className="form-group col-md-3">
            <label>Coor-y</label>
            <input
              type="text"
              className="form-control"
              id="coory"
              value={Coor[1]}
              onChange={(e) => setCoor([Coor[0], e.target.value])}
            />
          </div>
          <div className="form-group col-md-6">
            <label for="">Duong dan ban do</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                if (e.target.value.split("@")[1]) {
                  if (
                    e.target.value.split("@")[1].split(",")[0] &&
                    e.target.value.split("@")[1].split(",")[1]
                  ) {
                    setCoor([
                      e.target.value.split("@")[1].split(",")[0],
                      e.target.value.split("@")[1].split(",")[1],
                    ]);
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Chọn ảnh</label>
            <input
              type="file"
              name="imgUpload"
              className="form-control-file"
              id="imgUpload"
              onChange={(e) => setFile(e.target.files)}
              multiple
            />
            <div className="img-preview" id="img-preview">
              {File.length !== 0
                ? [...File].map((file, index) => {
                    return (
                      <img
                        src={URL.createObjectURL(file)}
                        key={index}
                        style={{ width: "200px", height: "200px" }}
                      />
                    );
                  })
                : OldImg.map((img, index) => {
                    return (
                      <img
                        src={img.url}
                        key={index}
                        style={{ width: "200px", height: "200px" }}
                      />
                    );
                  })}
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary px-4">
          Lưu
        </button>
        <a href="/" type="submit" className="btn btn-danger ml-3">
          Thoát
        </a>
      </form>
    </div>
  );
};

export default EditTopic;
