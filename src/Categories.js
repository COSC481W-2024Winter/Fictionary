import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";


function Categories({viewCurr, setViewCurr, setViewNext, players, setPlayers, isHost, setIsHost,round,setRound, socket}) {
    const { roomId } = useParams();
    //const [categories, setCategories] = useState([{category: "Animals"}, {category: "Objects"}, {category: "Buildings"}]);
    const [categories, setCategories] = useState(["1", "2", "3"]);
    const [counter, setCounter] = useState(60);
    /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
    // const [counter, setCounter] = useState(10);
    const [timer, setTimer] = useState("0:00");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleNextBtn = useCallback (() => {
        setViewNext(true);
        setViewCurr(false);
        setCounter(60);
        /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
        // setCounter(10);
    }, [setViewCurr, setViewNext, setCounter]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (viewCurr) {
                setCounter(counter => counter - 1)
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [viewCurr, setCounter]);

    useEffect(() => {
        setTimer(() => {
            var minutes = Math.floor(counter / 60);
            var seconds = counter % 60;
            if(seconds > 9){
                return (minutes + ":" + seconds);
            }
            return (minutes + ":0" + seconds);
        });
    }, [counter, setTimer]);

    //this makes it so the page will only nav if all users have submitted
    const handleClick = () => {
        socket.emit('category submitted');
        setIsButtonDisabled(true);
    };

    socket.on('cat go next', function() {
        handleNextBtn();
      });
      
    //placeholder until votes can be sent to the backend
    useEffect(() => {
        if (counter <= 0) {
            handleNextBtn();
        }
    }, [counter, viewCurr, handleNextBtn]);


    

    //Category retrieval 
    useEffect(() => {
        //For testing only
        if(process.env.NODE_ENV ==="test"){
            setCategories(["food","clothing","animals"]);
        }

        setRound(round+1);
        //converts roomID to a number, add round
        function seedGeneration() {
            
            let num = "";
            for (let i = 0; i < roomId.length; i++) {
              num += roomId.charCodeAt(i);
            }
            let number = parseInt(num);
            return number+round;
        }
        let seed = seedGeneration();
        //request function IF HOST
        //if(isHost){
            console.log("THIS IS BEING CALLED");
            async function fetchCategories() {
                //swap Url on deployment (back end url)
                const response = await fetch(`https://fictionary-backend-ylsan.ondigitalocean.app?seed=${seed}`);
                const categories = await response.json();
    
                setCategories(categories);
                console.log(categories);
            }
            fetchCategories().catch(console.dir);
        //}

    },[isHost,roomId]);

    return (
        <div className="background custom-text">
            <button type="button" onClick={handleNextBtn} className="" >&#40;this should not be visible&#41;</button>
            <div className="grid grid-cols-5 grid-rows-2 justify-center">
                <p className="header col-start-2 col-span-3">Fictionary</p>
                <p className="timer">{timer}</p>
                <p className="text-1xl col-start-2 col-span-3 row-start-2">Room: {roomId}</p>
            </div>
            <form className="bg-[#6f5643] p-4">
                <fieldset className="grid grid-cols-3 grid-rows-2 gap-x-3">
                    <legend className="header text-[#ece6c2] col-span-3">Vote for a Category</legend>
                    <p className="grid col-start-1 row-start-2">
                        <label className="bg-[#73bda8] p-4 mx-auto text-3xl" for="category_1">{categories[0]}</label>
                        <input type="radio" name="category" id="category_1" value={categories[0]} />
                    </p>
                    <p className="grid col-start-2 row-start-2">
                        <label className="bg-[#73bda8] p-4 mx-auto text-3xl" for="category_2">{categories[1]}</label>
                        <input type="radio" name="category" id="category_2" value={categories[1]} />
                    </p>
                    <p className="grid col-start-3 row-start-2">
                        <label className="bg-[#73bda8] p-4 mx-auto text-3xl" for="category_3">{categories[2]}</label>
                        <input type="radio" name="category" id="category_3" value={categories[2]} />
                    </p>
                </fieldset>
            </form>
            <div className = "flex justify-center brown-button">
                <div>
                    <button type="button" 
                    onClick={handleClick} 
                    disabled={isButtonDisabled}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Categories;