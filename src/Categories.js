import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from './context/SocketContext';

function Categories({ viewCurr, setViewCurr, setViewNext }) {
    const { roomId } = useParams();
    const { socket } = useSocket();
    const initialCategories = [{ category: "Animals" }, { category: "Objects" }, { category: "Buildings" }];
    const [categories, setCategories] = useState(initialCategories);
    const [counter, setCounter] = useState(60);
    const [timer, setTimer] = useState("0:00");

    const handleVote = useCallback((category) => {
        // Emit vote to the server.
        socket.emit('voteCategory', { roomId, category });
    }, [socket, roomId]);

    // Handle the countdown.
    useEffect(() => {
        if (counter > 0) {
            const intervalId = setInterval(() => {
                setCounter(c => c - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else {
            // Once the counter reaches zero, inform the server to end voting.
            socket.emit('endVoting', roomId);
            // Optionally, you can hide the voting UI here or wait for the server's response.
        }
    }, [counter, socket, roomId]);

    useEffect(() => {
        setTimer(() => {
            const minutes = Math.floor(counter / 60);
            const seconds = counter % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        });
    }, [counter]);

    // Listen for the server to announce the selected category.
    useEffect(() => {
        const handleCategorySelected = (selectedCategory) => {
            console.log(`Category Selected: ${selectedCategory}`);
            // Proceed to the next view or action based on the selected category.
            setViewNext(true);
            setViewCurr(false); // Ensure the current view is hidden.
        };

        socket.on('categorySelected', handleCategorySelected);

        return () => {
            socket.off('categorySelected', handleCategorySelected);
        };
    }, [socket, setViewNext, setViewCurr]);

    return (
        <div className="background custom-text">
            <div className="grid grid-cols-5 grid-rows-2 justify-center">
                <p className="header col-start-2 col-span-3">Fictionary</p>
                <p className="timer">{timer}</p>
                <p className="text-1xl col-start-2 col-span-3 row-start-2">Room: {roomId}</p>
            </div>
            <form className="bg-[#6f5643] p-4" onSubmit={(e) => e.preventDefault()}>
                <fieldset className="grid grid-cols-3 grid-rows-2 gap-x-3">
                    <legend className="header text-[#ece6c2] col-span-3">Vote for a Category</legend>
                    {categories.map((categoryObj, index) => (
                        <div className="grid" key={index}>
                            <label className="bg-[#73bda8] p-4 mx-auto text-3xl" htmlFor={`category_${index}`}>
                                {categoryObj.category}
                            </label>
                            <input type="radio" name="category" id={`category_${index}`} value={categoryObj.category} onChange={() => handleVote(categoryObj.category)} />
                        </div>
                    ))}
                </fieldset>
            </form>
        </div>
    );
}

export default Categories;
