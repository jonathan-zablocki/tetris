import React from "react";

const Display = (props) => {
	return (
		<div>
			{props.isNewGame ? "yes" : "no"}
			<button onClick={props.startGame}>{">"}</button>
		</div>
	);
};

export default Display;
