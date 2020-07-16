import React, { Component } from 'react'
import data from '../../js/tinh-tp.json'
import axios from 'axios'
import './topic.css'
import UserProfile from '../../UserProfile'
const items = []
var img

for (const key in data) {
  items.push(data[key].name)
}

export default class EditTopic extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: '',
      body: '',
      address_pri: '',
      address_sec: '',
      coorx: 0,
      coory: 0,
      date: new Date(),
      file: null,
      address: [],
      userID: ''
    }

    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeBody = this.onChangeBody.bind(this)
    this.onChangeAddress_Pri = this.onChangeAddress_Pri.bind(this)
    this.onChangeAddress_Sec = this.onChangeAddress_Sec.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.onChangeCoorX = this.onChangeCoorX.bind(this)
    this.onChangeCoorY = this.onChangeCoorY.bind(this)
    this.onChangImageURL = this.onChangImageURL.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  async componentDidMount() {
    await axios.get('/api/topics/' + this.props.match.params.id)
      .then(res => {
        this.setState({userID: res.data.topic.userID})
      })

    axios.get('/api/topics/edit/'+ this.props.match.params.id, {params: {role: UserProfile.getUserRole(), userID: this.state.userID, userIDDelete: UserProfile.getUserId()}})
      .then(res => {
        if (!res.data.status) {
          return this.props.history.push('/')
        } else {
          this.setState({
            title: res.data.title,
            description: res.data.description,
            body: res.data.body,
            address_pri: res.data.address_pri,
            address_sec: res.data.address_sec,
            coorx: res.data.coor[0],
            coory: res.data.coor[1],
            date: new Date(),
            file: res.data.imageURL
          })
        }

        var html = ''
        for (let index = 0; index < this.state.file.length; index++) {
          html += `<img src="/${this.state.file[index].filename}" style="width: 200px; height: 200px" />`
        }
        document.getElementById("img-preview").innerHTML = html
      })
      
      axios.get('/api/location')
        .then(res => {
          this.setState({
            address: res.data
          })
        })
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangeBody(e) {
    this.setState({
      body: e.target.value
    })
  }

  onChangeAddress_Pri(e) {
    this.setState({
      address_pri: e.target.value
    })
  }
  onChangeAddress_Sec(e) {
    this.setState({
      address_sec: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onChangeCoorX(e) {
    this.setState({
      coorx: e.target.value
    })
  }

  onChangeCoorY(e) {
    this.setState({
      coory: e.target.value
    })
  }

  onChangImageURL(e) {
    this.setState({
      file: e.target.files
    })
    img = e.target.files
  }

  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    for (let index = 0; index < this.state.file.length; index++) {
      const element = this.state.file[index];
      formData.append('imgUpload', element)
    }
    formData.append('title', this.state.title);
    formData.append('description', this.state.description);
    formData.append('body', this.state.body);
    formData.append('address_pri', this.state.address_pri);
    formData.append('address_sec', this.state.address_sec);
    formData.append('date', this.state.date);
    formData.append('coorx', this.state.coorx);
    formData.append('coory', this.state.coory);

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    };

    axios.post('/api/topics/update/' + this.props.match.params.id, formData, config)
      .then(res => console.log(res.data))

      window.location = '/topics/'+this.props.match.params.id
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label>Tiêu đề</label>
              <input type="text" className="form-control" id="title" value={this.state.title} onChange={this.onChangeTitle}/>
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea rows="3" type="text" className="form-control" id="description" value={this.state.description} onChange={this.onChangeDescription}/>
          </div>
          <div className="form-group">
            <label>Nội dung</label>
            <textarea rows="7" type="text" className="form-control" id="body" value={this.state.body} onChange={this.onChangeBody}/>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>Địa chỉ</label>
              <div className="d-flex">
                <select id="inputState" className="form-control" value={this.state.address_pri} onChange={this.onChangeAddress_Pri}>
                <option></option>
                {
                  this.state.address.map((item, index) => {
                    return <option key={item.address} value={item.address}>{item.address}</option>
                  })
                }
                </select>
                <input value={this.state.address_sec} onChange={this.onChangeAddress_Sec} className="form-control" />
              </div>
            </div>
            <div className="form-group col-md-3">
              <label>Toạ độ: Coor-x</label>
              <input type="text" className="form-control" id="coorx" value={this.state.coorx} onChange={this.onChangeCoorX} />
            </div>
            <div className="form-group col-md-3">
              <label>Coor-y</label>
              <input type="text" className="form-control" id="coory" value={this.state.coory} onChange={this.onChangeCoorY} />
            </div>
            <div className="form-group">
              <label>Chọn ảnh</label>
              <input type="file" name="imgUpload" className="form-control-file" id="imgUpload" onChange={this.onChangImageURL} multiple />
              <div className="img-preview" id="img-preview">

              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary px-4">Lưu</button>
          <a href="/" type="submit" className="btn btn-danger ml-3">Thoát</a>
        </form>
      </div>
    )
  }
}