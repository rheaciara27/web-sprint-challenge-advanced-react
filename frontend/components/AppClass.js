import React from 'react'
import axios from 'axios'

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props);

    this.state = {
      XY: { X: 2, Y: 2 },
      index: 4,
      steps: 0,
      message: '',
      email: '',
    };
  }

  getXY = (value) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const X = parseInt(value / 3) + 1;
    const Y = value % 3 + 1;
    this.setState({ XY: { X, Y } });
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      XY: { X: 2, Y: 2 },
      index: 4,
      steps: 0,
      message: '',
      email: '',
    });
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { index } = this.state;
    switch (direction) {
      case 'left':
        if (index % 3 === 0) return index;
        else {
          const nextIndex = index - 1;
          this.setState({ index: nextIndex });
          return nextIndex;
        }
      case 'right':
        if (index % 3 === 2) return index;
        else {
          const nextIndex = index + 1;
          this.setState({ index: nextIndex });
          return nextIndex;
        }
      case 'up':
        if (parseInt(index / 3) === 0) return index;
        else {
          const nextIndex = index - 3;
          this.setState({ index: nextIndex });
          return nextIndex;
        }
      case 'down':
        if (parseInt(index / 3) === 2) return index;
        else {
          const nextIndex = index + 3;
          this.setState({ index: nextIndex });
          return nextIndex;
        }
      default:
        break;
    }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const { index, steps } = this.state;
    this.setState({ message: '' })
    let nextValue;
    switch (evt) {
      case 'left':
        nextValue = this.getNextIndex('left');
        if (index === nextValue) this.setState({ message: "You can't go left" });
        else {
          this.setState((prevState) => ({
            index: nextValue,
            steps: prevState.steps + 1,
          }));
          this.getXY(nextValue);
        }
        break;
      case 'right':
        nextValue = this.getNextIndex('right');
        if (index === nextValue) this.setState({ message: "You can't go right" });
        else {
          this.setState((prevState) => ({
            index: nextValue,
            steps: prevState.steps + 1,
          }));
          this.getXY(nextValue);
        }
        break;
      case 'up':
        nextValue = this.getNextIndex('up');
        if (index === nextValue) this.setState({ message: "You can't go up" });
        else {
          this.setState((prevState) => ({
            index: nextValue,
            steps: prevState.steps + 1,
          }));
          this.getXY(nextValue);
        }
        break;
      case 'down':
        nextValue = this.getNextIndex('down');
        if (index === nextValue) this.setState({ message: "You can't go down" });
        else {
          this.setState((prevState) => ({
            index: nextValue,
            steps: prevState.steps + 1,
          }));
          this.getXY(nextValue);
        }
        break;
      default:
        break;
    }
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { XY, steps, email } = this.state;
    axios
      .post('http://localhost:9000/api/result', {
        email,
        x: XY.X,
        y: XY.Y,
        steps,
      })
      .then((res) => {
        this.setState({ message: res.data.message });
      });
    this.setState({ email: '' });
  }

  render() {
    const { className } = this.props
    const { XY, index, steps, message, email } = this.state;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({XY.X}, {XY.Y})</h3>
          <h3 id="steps">You moved {steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>LEFT</button>
          <button id="up" onClick={() => this.move('up')}>UP</button>
          <button id="right" onClick={() => this.move('right')}>RIGHT</button>
          <button id="down" onClick={() => this.move('down')}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <input id="email" type="email" value={this.state.email} placeholder="type email" onChange={(e) => this.setState({ email: e.target.value })}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}