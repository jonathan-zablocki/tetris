import React from "react";
import "./display.css";

const Display = (props) => (
	<div className="display">
		{props.isNewGame ? "START" : "GAME OVER"}
		<button className="startButton" onClick={props.handleStartGame}>
			{">"}
		</button>
		<button className="trophy" onClick={props.handleOpenScores}>
			<i className="fa fa-trophy" aria-hidden="true"></i>
		</button>
	</div>
);

export default Display;
