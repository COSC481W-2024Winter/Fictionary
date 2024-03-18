import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from './context/SocketContext'; // Ensure this is correctly imported

function Drawing({ viewCurr, setViewCurr, setViewNext }) {
    const { roomId } = useParams();
    const [artist, setArtist] = useState("user_3");
    const [tricksters, setTricksters] = useState(["user_1", "user_2", "user_4", "user_5", "user_6", "user_7", "user_8", "user_9"]);
    const [category, setCategory] = useState({ category: "Animals" });
    const [view, setView] = useState(true);
    const [counter, setCounter] = useState(180);
    /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
    // const [counter, setCounter] = useState(10);
    const [timer, setTimer] = useState("0:00");
    const [canvas, setCanvas] = useState(<canvas className="m-auto size-5/6 bg-white"></canvas>)
    const { socket } = useSocket();

    useEffect(() => {
        console.log('Requesting current category for room:', roomId);
        socket.emit('requestCurrentCategory', roomId);
      
        const handleCurrentCategory = (selectedCategory) => {
          console.log('Received current category:', selectedCategory);
          alert(selectedCategory);
          setCategory({ category: selectedCategory });
        };
      
        socket.on('currentCategory', handleCurrentCategory);
      
        return () => {
          socket.off('currentCategory', handleCurrentCategory);
        };
      }, [socket, roomId]);
      
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (viewCurr) {
                setCounter(counter => counter - 1);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [viewCurr, setCounter]);

    useEffect(() => {
        setTimer(() => {
            var minutes = Math.floor(counter / 60);
            var seconds = counter % 60;
            if (seconds > 9) {
                return (minutes + ":" + seconds);
            }
            return (minutes + ":0" + seconds);
        });
    }, [counter, setTimer]);

    //temporary function to test both views at once
    function swapView() {
        setView(() => {
            return !view;
        });
    }

    //placeholder until the drawing can actually be sent to the backend
    const submitDrawing = useCallback(() => {
        // navigate(`/voting/${roomId}`);
        setViewNext(true);
        setViewCurr(false);
        setCounter(180);
        /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
        // setCounter(10);
    }, [setViewCurr, setViewNext, setCounter]);

    useEffect(() => {
        if (counter <= 0) {
            submitDrawing();
        }
    }, [counter, viewCurr, submitDrawing]);

    //placeholder until messages can be sent between clients
    function sendMessage() { }

    if (view) {
        return (
            <div>
                {/* button for testing both views */}
                <div className="bg-[#cc6b49] text-[#ece6c2] font-sans" onClick={swapView}>Switch to "Trickster" View</div>

                <div className="background custom-text grid grid-cols-4 grid-rows-3">
                    <div className="col-start-2 col-span-2">
                        <p className="sub-header">Fictionary</p>
                        <p className="pb-4">Room: {roomId}</p>
                        <p className="header">CATEGORY IS:</p>
                        <p className="large-text">{category.category}</p>
                    </div>
                    <p className="timer">{timer}</p>

                    <form>
                        <section className="row-start-2">
                            <fieldset>
                                <legend className="large-text">Drawing Tools</legend>
                                <p>
                                    <label for="tool_1">Thin</label>
                                    <input type="radio" name="tool" id="tool_1" value="thin" />
                                </p>
                                <p>
                                    <label for="tool_2">Medium</label>
                                    <input type="radio" name="tool" id="tool_2" value="medium" />
                                </p>
                                <p>
                                    <label for="category_3">Thick</label>
                                    <input type="radio" name="tool" id="tool_3" value="thick" />
                                </p>
                            </fieldset>
                        </section>
                        <section className="row-start-3 pt-5">
                            <p>
                                <label className="large-text" for="colorPicker">Color Picker</label>
                                <select id="colorPicker" name="color">
                                    <option value="red">Red</option>
                                    <option value="orange">Orange</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="green">Green</option>
                                    <option value="blue">Blue</option>
                                    <option value="purple">Purple</option>
                                </select>
                            </p>
                        </section>
                    </form>

                    <div className="canvas col-start-2 col-span-2 row-start-2 row-span-2">{canvas}</div>

                    <div onClick={submitDrawing} className="brown-button w-fit col-start-4 row-start-3" >Submit Drawing</div>
                </div>
            </div>
        );
    }
    return (
        <div>
            {/* button for testing both views */}
            <div className="bg-[#73bda8] text-[#6f5643] font-sans" onClick={swapView}>Switch to "Artist" View</div>

            <div className="background custom-text grid grid-cols-4 grid-rows-4">
                <div>
                    <p className="sub-headerl">Fictionary</p>
                    <p>Room: {roomId}</p>
                </div>
                <div className="row-start-2">
                    <p className="header">CATEGORY IS:</p>
                    <p className="large-text">{category.category}</p>
                </div>
                <p className="timer row-start-3">{timer}</p>

                <div className="col-start-2 col-span-2 row-span-3">
                    <div className="canvas col-start-2 col-span-2 row-start-2 row-span-2">{canvas}</div>
                    <p>User {artist} is drawing</p>
                </div>

                <div className="col-start-4 row-span-2">
                    {/*placeholder until the actual chatroom can be displayed*/}
                    <p className="bg-[#6f5643] text-[#ece6c2] size-full">Chat Room</p>
                    <div>
                        <form>
                            <p>
                                <input className="text-entry-box w-full" type="text" id="message" name="message" placeholder="Message..." />
                            </p>
                        </form>
                        <div className="blue-button" onClick={sendMessage}>Send</div>
                    </div>
                </div>

                <form className="row-start-4 col-span-4">
                    <p>
                        <input className="text-entry-box w-5/6" type="text" id="guess" name="guess" placeholder="Enter Your Guess Here" />
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Drawing;