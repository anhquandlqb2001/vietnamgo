import React, { useEffect, useState } from "react";
import data from "../../js/tinh-tp.json";
import axios from "axios";
import Profile from "../../js/UserProfile";
import { AUTHENTICATE_ERROR } from "../../js/errorhandler";
const items = [];

for (const key in data) {
  items.push(data[key].name);
}

const NewTopic = () => {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Body, setBody] = useState("");
  const [Address_Pri, setAddress_Pri] = useState("");
  const [Address_Sec, setAddress_Sec] = useState("");
  const [Address, setAddress] = useState([]);
  const [Coor, setCoor] = useState([0, 0]);
  const [File, setFile] = useState([]);
  const [Thumb, setThumb] = useState(null)

  useEffect(() => {
    axios.get("/api/location").then((res) => {
      setAddress(res.data);
    });
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
    formData.append("id", Profile.getUserId());
    formData.append("author", Profile.getUsername())
    formData.append("imgThumb", Thumb)

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios.post("/api/topics/add", formData, config).then((res) => {
      if (res.data.success) {
        alert(res.data.message);
        return (window.location = "/topics");
      } else {
        alert("Them bai viet that bai");
      }
    }).catch(e => AUTHENTICATE_ERROR(e.response.status));
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
            <label>Toạ độ: Coor-x (&gt;90)</label>
            <input
              type="text"
              className="form-control"
              id="coorx"
              value={Coor[0]}
              onChange={(e) => setCoor([e.target.value, Coor[1]])}
            />
          </div>
          <div className="form-group col-md-3">
            <label>Coor-y (&lt;90)</label>
            <input
              type="text"
              className="form-control"
              id="coory"
              value={Coor[1]}
              onChange={(e) => setCoor([Coor[0], e.target.value])}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="">Duong dan ban do</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                if (e.target.value.split('@')[1]) {
                  if (e.target.value.split('@')[1].split(',')[0] && e.target.value.split('@')[1].split(',')[1]) {
                    setCoor([e.target.value.split('@')[1].split(',')[1], e.target.value.split('@')[1].split(',')[0]])
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
              {File &&
                [...File].map((file, index) => {
                  return (
                    <img
                      src={URL.createObjectURL(file)}
                      key={index}
                      style={{ width: "200px", height: "200px" }}
                    />
                  );
                })}
            </div>
          </div>
          <div className="form-group">
            <label>Chọn ảnh background</label>
            <input
              type="file"
              name="imgThumb"
              className="form-control-file"
              id="imgThumb"
              onChange={(e) => setThumb(e.target.files[0])}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary px-4">
          Tạo
        </button>
        <a href="/" type="submit" className="btn btn-danger ml-3">
          Thoát
        </a>
      </form>
    </div>
  );
};

export default NewTopic;
