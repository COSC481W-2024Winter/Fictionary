import { useParams } from "react-router-dom";

function Scoreboard() {
    // ellen: placeholder roomId value in the case nothing is passed so it doesn't break during testing
    const { roomId } = useParams() || `e776`;

    return (
        <div>
            hi mom! &#40;scoreboard&#41;
        </div>
    )
}

export default Scoreboard;