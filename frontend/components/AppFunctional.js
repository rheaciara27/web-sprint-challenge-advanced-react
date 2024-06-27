import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialIndex = 4;
const initialSteps = 0;
const errMessage = ''; // the index the "B" is at

const URL = 'http://localhost:9000/api/result';

const AppFunctional = ({ className }) => {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [errorMessage, setErrorMessage] = useState(errMessage);
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const getXY = () => {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  };

  const getXYMessage = () => {
    const { x, y } = getXY();
    return `(${x}, ${y})`;
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  };

  const reset = () => {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setIndex(initialIndex);
    setSteps(initialSteps);
    setErrorMessage(errMessage);
    // Use this helper to reset all states to their initial values.
  };

  const getNextIndex = (direction) => {
    let newIndex = index;

    switch (direction) {
      case 'left':
        newIndex = index % 3 !== 0 ? index - 1 : index;
        break;
      case 'up':
        newIndex = index >= 3 ? index - 3 : index;
        break;
      case 'right':
        newIndex = index % 3 !== 2 ? index + 1 : index;
        break;
      case 'down':
        newIndex = index < 6 ? index + 3 : index;
        break;
      default:
        break;
    }

    return newIndex;
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  };

  const move = (direction) => {
    const newDirection = getNextIndex(direction);

    if (newDirection !== index) {
      setSteps(steps + 1);
      setIndex(newDirection);
      setErrorMessage('');
    } else {
      let errorMessage = '';

      switch (direction) {
        case 'left':
          errorMessage = "You can't go left";
          break;
        case 'right':
          errorMessage = "You can't go right";
          break;
        case 'up':
          errorMessage = "You can't go up";
          break;
        case 'down':
          errorMessage = "You can't go down";
          break;
        default:
          errorMessage = 'Invalid move';
      }

      setErrorMessage(errorMessage);
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  };

  const onChange = (evt) => {
    const { id, value } = evt.target;
    if (id === 'email') {
      setEmail(value);
    }
    // You will need this to update the value of the input.
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    const { x, y } = getXY();

    axios
      .post(URL, { message, email, index, steps, x, y })
      .then((resp) => {
        setEmail(initialEmail);
        setErrorMessage(resp.data.message);
        console.log(resp.data.message);
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
    // Use a POST request to send a payload to the server.
  };

  return (
    <div id="wrapper" className={className}>
      <div className="info">
        <h3 id="coordinates">Coordinates (2, 2)</h3>
        <h3 id="steps">You moved 0 times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button id="left">LEFT</button>
        <button id="up">UP</button>
        <button id="right">RIGHT</button>
        <button id="down">DOWN</button>
        <button id="reset">reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
