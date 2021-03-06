import React, { Component } from 'react';
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { discoverMovies } from './api/movieDB';
import Tile from './Tile';
import Carousel from './Carousel';

const cyclicSubtract = (num, loopValue) => {
  if (num - 1 < 0) return loopValue - 1;
  return num - 1;
};

class TitleList extends Component {
  constructor(props) {
    super(props);
    this.state = { movies: [] };
    this.startCarousel = -1;
  }

  componentWillMount() {
    discoverMovies()
      .then((response) => {
        const data = response.data.results;
        const movies = this.renderMovieTiles(data);
        this.setState({ movies });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  shift(shiftFunction) {
    const movies = this.state.movies;
    const updatedMovies = new Array(movies.length);
    for (let i = 0; i < movies.length; ++i) {
      updatedMovies[i] = React.cloneElement(movies[i], {
        style: { order: shiftFunction(movies[i].props.style.order, movies.length) },
      });
    }
    this.setState({ movies: updatedMovies });
  }

  shiftRight() {
    this.shift(cyclicSubtract);
  }

  shiftLeft() {
    this.shift((x, length) => (x + 1) % length);
  }

  renderMovieTiles(data) {
    let movies = [];
    if (data.length > 0) {
      const order = new Array(data.length);
      for (let i = 0; i < data.length; ++i) {
        order[i] = (i + 1) % data.length;
      }
      let i = -1;
      movies = data.map((movie) => {
        i += 1;
        return (
          <Tile
            key={movie.id}
            imgUrl={movie.backdrop_path}
            title={movie.title}
            style={{ order: order[i] }}
          />
        );
      });
      /*
      React.cloneElement(content[content.length - 1], {
        className: 'is-ref',
      });

      movies[movies.length - 1].props.style = { order: '1' };
      */
      this.startCarousel = movies.length - 1;
    }
    return movies;
  }

  render() {
    if (this.state.movies.length > 0) {
      return (
        <div>
          <button onClick={() => this.shiftRight()}>Shift right</button>
          <Carousel>{this.state.movies}</Carousel>
        </div>
      );
    }
    return <div />;
  }
}
export default TitleList;
