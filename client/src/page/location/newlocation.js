import React, { useState } from 'react'
import data from '../../js/tinh-tp.json'
import axios from 'axios'
const items = []

for (const key in data) {
  items.push(data[key].name)
}

const NewLocation = () => {
const [Address, setAddress] = useState('')
const [Image, setImage] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('profile', Image)
    fd.append('address', Address)

    axios.post('/api/location/add', fd)
      .then(res => {
        if (res.data.success) {
          alert(res.data.message)
          return window.location = '/'
        } else {
          alert(res.data.message)
        }
      })
  }

    return (
      <div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <select id="inputState" className="form-control" value={Address} onChange={e => setAddress(e.target.value)}>
                {
                  items.map((item, index) => {
                    return <option key={item} value={item}>{item}</option>
                  })
                }
                </select>
          </div>
          <div className="form-group">
            <label>Ảnh</label>
            <input type="file" className="form-control-file" id="profile" onChange={e => setImage(e.target.files[0])}/>
          </div>
          <button type="submit" className="btn btn-success">Thêm</button>
        </form>
      </div>
    )
}

export default NewLocation