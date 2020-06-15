import React, { Component } from "react";
import { Animation } from "./animation.jsx";
import { HEIGHT, WIDTH } from "../constants/constants.js";

const I = () => {
	return {
		value: "I",
		origin: { x: 3, y: 17 },
		cells: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
	};
};

const L = () => {
	return {
		value: "L",
		origin: { x: 3, y: 18 },
		cells: [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		],
	};
};

const J = () => {
	return {
		value: "J",
		origin: { x: 3, y: 18 },
		cells: [
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
	};
};

const T = () => {
	return {
		value: "T",
		origin: { x: 3, y: 18 },
		cells: [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
	};
};

const S = () => {
	return {
		value: "S",
		origin: { x: 3, y: 18 },
		cells: [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0],
		],
	};
};

const Z = () => {
	return {
		value: "Z",
		origin: { x: 3, y: 18 },
		cells: [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0],
		],
	};
};

const O = () => {
	return {
		value: "O",
		origin: { x: 4, y: 19 },
		cells: [
			[1, 1],
			[1, 1],
		],
	};
};

class Game extends Component {
	constructor(props) {
		super(props);

		let board = [...Array(HEIGHT)].map(() => Array(WIDTH));
		for (let j = 0; j < HEIGHT; j++) {
			for (let i = 0; i < WIDTH; i++) {
				board[j][i] = { value: 0 };
			}
		}

		this.state = {
			board: board,
			tetromino: this.createTetromino(),
			dropTime: 1000,
			lastDrop: Date.now(),
		};
	}

	createTetromino = () => {
		return I();
	};

	nextGameStep = () => {
		// if (Date.now() - this.state.lastDrop > this.state.dropTime) {
		// 	this.setState({
		// 		lastDrop: Date.now(),
		// 		tetromino: { origin: { y: this.state.tetromino.origin.y - 1 } },
		// 	});
		// 	console.log(this.state.tetromino);
		// }
	};

	render() {
		return (
			<Animation
				nextGameStep={this.nextGameStep}
				board={this.state.board}
				tetromino={this.state.tetromino}
			/>
		);
	}
}

export default Game;
