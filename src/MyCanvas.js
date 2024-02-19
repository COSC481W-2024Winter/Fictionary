import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

function MyCanvas(roomId, cd) {
    // const { roomId } = useParams();
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    // const [canDraw, setCanDraw] = useState(false);
   
    const [lastPos, setLastPos] = useState(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:8000');
        socket.current.on('connect', () => {
            console.log("Connected to Socket.IO server");
            socket.current.emit('joinRoom', roomId);
        });

        // socket.current.on('drawingPrivilege', (hasPrivilege) => {
        //     setCanDraw(cd);
        //     console.log(`Received drawing privilege: ${hasPrivilege}`);
        // });

        socket.current.on('drawing', (data) => {
            drawLine(data.x0, data.y0, data.x1, data.y1);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.lineWidth = 2;
        context.strokeStyle = 'black';
    }, []);

    const getMousePos = (canvas, evt) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    const drawLine = (x0, y0, x1, y1) => {
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
        context.closePath();
    };

    const handleMouseDown = (e) => {
        // if (!cd) return;
        if(cd===true)
        {
            const pos = getMousePos(canvasRef.current, e);
            setLastPos(pos);
            setDrawing(true);
        }
        
    };

    const handleMouseMove = (e) => {
        // if (!drawing || !cd) return;
        if(drawing===true && cd===true)
        {
            const pos = getMousePos(canvasRef.current, e);
            if (lastPos) {
                drawLine(lastPos.x, lastPos.y, pos.x, pos.y);
                const drawData = { room: roomId, x0: lastPos.x, y0: lastPos.y, x1: pos.x, y1: pos.y };
                console.log('Emitting draw event', drawData);
                socket.current.emit('draw', drawData);
                setLastPos(pos);
            }
        }
    };

    const handleMouseUp = () => {
        setDrawing(false);
        setLastPos(null);
    };

    const handleMouseOut = () => {
        if (drawing) {
            setDrawing(false);
            setLastPos(null);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={443}
            height={350}
            className="bg-white shadow-lg border-2 border-gray-300 m-10"
            // className="canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}
        ></canvas>
    );
}

export default MyCanvas;
