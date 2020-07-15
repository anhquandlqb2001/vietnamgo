import SlideShow from './homepage/slideshow.homepage.component'
import FavourPlace from './homepage/favouriteplaces.homepage.component'
// import RandomPic from './homepage/randompic.homepage.component'
import FavouriteTopics from './homepage/favouritetopics.homepage.component'
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import { Link } from "react-router-dom";
import UserProfile from '../UserProfile'
import auth from '../auth'

export default class Home extends Component {

  constructor(props) {
    super(props)

    this.onChangeAddress = this.onChangeAddress.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeImage = this.onChangeImage.bind(this)
    this.onSaveSlideImage = this.onSaveSlideImage.bind(this)
    this.state = {
      search: '',
      address: [],
      files: []
    }
  }

  onChangeAddress = (event, values) => {
    this.setState({
      search: values
    })
  }

  componentDidMount() {
    axios.get('/location')
      .then(res => {
        this.setState({
          address: res.data
        })
      })
  }

  onSubmit(e) {
    e.preventDefault()
    axios.get('/topics/search', {
      method: 'GET',
      headers: {
       'Accept': "application/json; charset=utf-8",
      },
      params: {
        address: this.state.search.address,
        page: 1
      }
    }).then(res => console.log(res.data))
  }

  onChangeImage(e) {
    this.setState({
      files: e.target.files
    })
  }
  
  onSaveSlideImage(e) {
    e.preventDefault()
    const fd = new FormData()
    for (let index = 0; index < this.state.files.length; index++) {
      const element = this.state.files[index];
      fd.append("slide-img", element);
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios.post('/api/slideimg', fd, config)
      .then(res => console.log(res.data))

  }

  render() {
    return  (
      <div>
          <div className="container my-2">
            <form onSubmit={this.onSubmit} >
              <div className="form-group">
                <label>Bạn muốn đi đâu?</label>
                <Autocomplete
                  id="combo-box-demo"
                  options={this.state.address}
                  getOptionLabel={(option) => option.address}
                  style={{ width: 300 }}
                  onChange={this.onChangeAddress}
                  renderInput={(params) => <TextField name="address" {...params} label="Địa điểm" placeholder="Vd: Đà Nẵng, Nha Trang..." variant="outlined" />}
                />
              </div>
              <Link to={{
                pathname: `/topics/search`,
                search: `address=${this.state.search.address}`,
                state: { search: this.state.search.address }
              }} type="submit" className="btn btn-primary">Tìm kiếm</Link>
            </form>
            {auth.isAdmin(UserProfile.getUserRole()) ? <div className="form-group">
              <label>Thay background</label>
              <input
                type="file"
                name="slide-img"
                className="form-control-file"
                id="slide-img"
                onChange={this.onChangeImage}
                multiple
              />
              <button type="submit" onClick={this.onSaveSlideImage}>Lưu</button>
            </div> : ''}
          </div>
        <SlideShow />
        <div className="container">
          <FavourPlace />

          <h2 style={{ textAlign: 'center' }}>Các địa điểm yêu thích</h2>
          <FavouriteTopics />
          {/* <PlacesAround /> */}
        </div>
      </div>
    )
  }
}

