import React from "react";
import "./display.css";

const Display = (props) => (
	<div className="display">
		{props.isNewGame ? "START" : "GAME OVER"}
		<button className="startButton" onClick={props.handleStartGame}>
			{">"}
		</button>
	</div>
);

export default Display;
