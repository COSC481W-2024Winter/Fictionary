import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';

const Timer = ({viewCurr, seconds, setSeconds, handleNextBtn}) => {
  useEffect(() => {
    // Update the timer every second
    const interval = setInterval(() => {
      if (viewCurr) {
        setSeconds(prevSeconds => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [viewCurr, setSeconds]); // Empty dependency array ensures the effect runs only once on mount

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (seconds <= 0) {
      handleNextBtn();
    }
  }, [seconds, viewCurr, handleNextBtn]);

  return (
    <div>
      <h1 className="large-text">Timer</h1>
      <p className="timer">{formatTime(seconds)}</p>
    </div>
  );
};

const Grid = ({ data }) => {
  // Split the data array into rows
  const rows = [];
  for (let i = 0; i < data.length; i += 3) {
    rows.push(data.slice(i, i + 3));
  }

  return (
    <div>
      {rows.map((row, rowIndex) => (
        <div>
          {row.map((element, columnIndex) => (
            <button className="yellow-button m-2">
              {element !== null ? element : 'Empty'}
            </button>
          ))}
        </div>
      ))}
    </div> 
  );
};

const Canvas = () => {
  return (
    <div>
      <canvas
      width={1000}
      height={1000}
      className="canvas"
      ></canvas>
    </div>
  );
};


function Voting({viewCurr, setViewCurr, setViewNext, players, socket}) {
    // const { roomId } = useParams();
    const [data, setData] = useState(["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]);
    const [seconds, setSeconds] = useState(60);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
    // const [seconds, setSeconds] = useState(10);
 
    const handleNextBtn = useCallback(() => {
      setViewNext(true);
      setViewCurr(false);
      setSeconds(60);
      /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
      // setSeconds(10);
    }, [setViewCurr, setViewNext, setSeconds]);

    const submitVote = () => {
      //disable buttons
      setIsButtonDisabled(true);
      socket.emit('vote submitted');
    };

    socket.on('vote go next', function() {
      handleNextBtn();
    });

    return (
      <div className="background custom-text">
        
          <div className= "flex justify-end">
            <Timer viewCurr={viewCurr} seconds={seconds} setSeconds={setSeconds} handleNextBtn={handleNextBtn} />
          </div>
        
          <div className="w-full mx-auto flex flex-row items-center">
              <div className="basis-1/2">
                <Canvas />
              </div>
              <div className="basis-1/2">
                <p className='header'>CATEGORY IS</p> <br />
                <p className='sub-header'>CATEGORY</p>
                <Grid data = {data} />
              </div>
              <div className="flex justify-center brown-button">
                <div>
                  <button onClick={submitVote} type="button" >
                    Submit
                  </button>
                </div>
              </div>
          </div>
      </div>
    );
}

export default Voting;