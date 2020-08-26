import React, { Component } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import axios from 'axios'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const Slide = props => (
  <img src={props.slide.thumb} style={{ width: '80%', height: '80%' }} />
)

export default class SlideShow extends Component {
  constructor(props) {
    super(props)

    this.onChangeSearch = this.onChangeSearch.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state = {
      search: '',
      image: []
    }
  }

  onChangeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault()

    axios.post('/search/', null, { params: {
      search: this.state.search
    }})
      .then(async (res) => {
        this.setState({
          image: res.data
        })
      })
  }
  listSlide() {
    try {
      return this.state.image.results.map(item => {
        return <Slide slide={item.urls} />
      })
    } catch (error) {
      
    }
  }

  render() {
    try {
      this.state.image.results.map(item => {
      console.log(item)
    })
    } catch (error) {
      
    }
    return (
      <div>
        <form className="input-group flex-nowrap my-3" onSubmit={this.onSubmit}>
          <div className="input-group-prepend">
            <span className="input-group-text" id="addon-wrapping">@</span>
          </div>
          <input type="text" className="form-control" placeholder="Vd: Vịnh Hạ Long, Phố cổ Hội An,..." value={this.state.address} onChange={this.onChangeSearch} name="search" aria-describedby="addon-wrapping" />
          <button type="submit" className="btn btn-primary">Khám phá</button>
        </form>

          <h2>Ảnh ngẫu nhiên</h2>
        <div>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={false} // means to render carousel on server-side.
            infinite={true}
            autoPlay={this.props.deviceType !== "mobile" ? true : false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {this.listSlide()}
            <div >1</div>
          </Carousel>
        </div>
      </div>
    )
  }
}