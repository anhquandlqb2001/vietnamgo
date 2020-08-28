import SlideShow from "./slideshow.homepage.component";
import FavourPlace from "./favouriteplaces.homepage.component";
import FavouriteTopics from "./favouritetopics.homepage.component";
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {

  const [Search, setSearch] = useState('')
  const [Address, setAddress] = useState([])

  useEffect(() => {
    axios.get("/api/location").then((res) => {
      setAddress(res.data)
    });
  }, [])

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .get("/api/topics/search", {
        method: "GET",
        headers: {
          Accept: "application/json; charset=utf-8",
        },
        params: {
          address: Address,
          page: 1,
        },
      })
      .then((res) => console.log(res.data));
  }

    return (
      <div>
        <div className="container my-2">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Bạn muốn đi đâu?</label>
              <Autocomplete
                id="combo-box-demo"
                options={Address}
                getOptionLabel={(option) => option.address}
                style={{ width: 300 }}
                noOptionsText={'Chua co dia diem nao'}
                onChange={(e, value) => {
                  setSearch(value.address)
                }}
                renderInput={(params) => (
                  <TextField
                    name="address"
                    {...params}
                    label="Địa điểm"
                    placeholder="Vd: Đà Nẵng, Nha Trang..."
                    variant="outlined"
                  />
                )}
              />
            </div>
            <Link
              to={{
                pathname: `/topics/search`,
                search: `address=${Search}`,
                state: { search: Search },
              }}
              type="submit"
              className="btn btn-primary"
            >
              Tìm kiếm
            </Link>
          </form>
        </div>
        <SlideShow />
        <div className="container">
          <FavourPlace />

          <h2 style={{ textAlign: "center" }}>Các địa điểm yêu thích</h2>
          <FavouriteTopics />
          {/* <PlacesAround /> */}
        </div>
      </div>
    );
}

export default Home