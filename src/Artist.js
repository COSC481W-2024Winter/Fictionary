import React from 'react';
import { useState, useEffect, useCallback } from "react";
import io from 'socket.io-client';


function Artist({viewCurr, setViewCurr, setViewNext, players, setPlayers, isHost, setIsHost, usedIndexes, setUsedIndexes, artist, setArtist, socket}) {
    const [count, setCount] = useState(null);


    const handleNext = useCallback(() => {
      setViewNext(true);
      setViewCurr(false);
  }, [setViewCurr, setViewNext]);

    const artistPicker = () => {
        socket.emit('pick artist');

        socket.on('artistPicked', (newArtist, index, previousHostIndex) => {
          const user = players.find((player) => player.id === newArtist.id);
          setArtist(user);
          setIsHost(user);
          socket.emit('updateHost', index, previousHostIndex);
      });
      
    };

    useEffect(() => {
        artistPicker();
      }, []);

    useEffect(() => {
      const delay = setTimeout(() => {
        setCount(3);
      }, 2000);
      return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
      if (count === null) return;
      const countdown = setTimeout(() => {
        if (count > 1) {
          setCount(count - 1);
        } else {
          handleNext();
        }
      }, 1000);
      return() => clearTimeout(countdown);
    }, [count]);

    return(
        <div className="background custom-text flex flex-col space-y-44 text-center py-12 text-6xl ">
           <button id= "nextButton" 
           data-testid= "next" 
           onClick={handleNext} 
           style={{ display: 'none' }}>
            next
            </button>
          <div>
            <div> NEXT ARTIST IS <br /> <br /> </div>
               <div className="animate-bounce">{artist && artist.name} </div>
            </div>
               {count !== null && (
                <>
                <div>
                  GET READY TO DRAW IN
                  <div>
                  {count}
                  </div>
                </div>
                </>
               )}

        </div>
    );

}

export default Artist;