import React, { Component } from 'react'
import data from '../../js/tinh-tp.json'
import axios from 'axios'
const items = []

for (const key in data) {
  items.push(data[key].name)
}

export default class NewLocation extends Component {
  constructor(props) {
    super(props)

    this.onChangeAddress = this.onChangeAddress.bind(this)
    this.onChangeImage = this.onChangeImage.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      address: '',
      image: ''
    }
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    })
  }
  onChangeImage(e) {
    this.setState({
      image: e.target.files[0]
    })
  }

  onSubmit(e) {
    e.preventDefault()
    console.log(this.state.image)
    const fd = new FormData()
    fd.append('profile', this.state.image)
    fd.append('address', this.state.address)

    axios.post('/api/location/add', fd)
      .then(res => console.log(res.data))
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <select id="inputState" className="form-control" value={this.state.address} onChange={this.onChangeAddress}>
                {
                  items.map((item, index) => {
                    return <option key={item} value={item}>{item}</option>
                  })
                }
                </select>
          </div>
          <div className="form-group">
            <label for="exampleFormControlFile1">Ảnh</label>
            <input type="file" className="form-control-file" id="profile" onChange={this.onChangeImage}/>
          </div>
          <button type="submit" className="btn btn-success">Thêm</button>
        </form>
      </div>
    )
  }
}