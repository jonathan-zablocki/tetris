import React, { Component } from "react";
import { Animation } from "./animation.jsx";
import * as CONST from "../constants/constants.js";
//import { tetromino } from "./tetromino.jsx";
//const tetromino = require("./tetromino.jsx");

class Game extends Component {
	constructor(props) {
		super(props);

		let board = [...Array(CONST.HEIGHT)].map(() => Array(CONST.WIDTH));
		for (let j = 0; j < CONST.HEIGHT; j++) {
			for (let i = 0; i < CONST.WIDTH; i++) {
				board[j][i] = { value: 0 };
			}
		}

		this.state = {
			board: board,
			tetromino: this.createTetromino(),
			dropTime: 500,
			lastDrop: Date.now(),
			que: this.createTetromino(),
			hold: {},
		};
		console.log(this.state);
	}

	createTetromino = () => {
		const tetrominoTypes = [
			CONST.I,
			CONST.J,
			CONST.L,
			CONST.I,
			CONST.O,
			CONST.S,
			CONST.Z,
			CONST.T,
		];

		return tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
	};

	lockTetromino = () => {
		const pos = this.findPos(this.state.tetromino);
		let board = JSON.parse(JSON.stringify(this.state.board));

		pos.forEach((pos) => {
			board[pos.y][pos.x].value = this.state.tetromino.value;
		});

		this.setState({
			board: board,
		});
	};

	nextGameStep = () => {
		if (Date.now() - this.state.lastDrop > this.state.dropTime) {
			let copyTetromino = JSON.parse(JSON.stringify(this.state.tetromino));
			copyTetromino.origin.y--;
			if (this.checkCollision(copyTetromino)) {
				this.lockTetromino();
				this.setState({
					tetromino: this.createTetromino(),
				});
			} else {
				this.setState({
					lastDrop: Date.now(),
					tetromino: copyTetromino,
				});
			}
		}
	};

	findPos(tetromino) {
		const cells = tetromino.cells;
		let positions = [];
		for (let j = 0; j < cells.length; j++) {
			for (let i = 0; i < cells[0].length; i++) {
				if (cells[j][i]) {
					positions.push({
						x: i + tetromino.origin.x,
						y: j + tetromino.origin.y,
					});
				}
			}
		}
		return positions;
	}

	checkCollision = (tetromino) => {
		const positions = this.findPos(tetromino);
		console.log(positions);
		const board = this.state.board;

		return positions.some((pos) => {
			if (
				pos.x >= CONST.WIDTH ||
				pos.x < 0 ||
				pos.y >= CONST.HEIGHT ||
				pos.y < 0
			) {
				// Outof Bounds
				return true;
			} else if (board[pos.y][pos.x].value) {
				//Collision on the Board
				return true;
			}
		});
	};

	moveTetromino() {}

	handleKeyPress = (e) => {
		let keyCode = e.code;
		let copyTetromino = JSON.parse(JSON.stringify(this.state.tetromino));

		switch (keyCode) {
			case "ArrowLeft":
				copyTetromino.origin.x--;
				break;
			case "ArrowRight":
				copyTetromino.origin.x++;
				break;
			case "ArrowUp":
				const orientations = {
					I: CONST.I_ORIENT,
					J: CONST.J_ORIENT,
					L: CONST.L_ORIENT,
					Z: CONST.Z_ORIENT,
					S: CONST.S_ORIENT,
					T: CONST.T_ORIENT,
					O: CONST.O_ORIENT,
				};
				copyTetromino.orient = (copyTetromino.orient + 1) % 4;
				copyTetromino.cells =
					orientations[copyTetromino.value][copyTetromino.orient];
				break;
			case "ArrowDown":
				copyTetromino.origin.y--;
				break;
			default:
				break;
		}
		console.log(this.checkCollision(copyTetromino));
		if (!this.checkCollision(copyTetromino)) {
			this.setState({
				tetromino: copyTetromino,
			});
		}
	};

	render() {
		return (
			<Animation
				nextGameStep={this.nextGameStep}
				board={this.state.board}
				tetromino={this.state.tetromino}
				handleKeyPress={this.handleKeyPress}
			>
				<aside>
					<p>this.state.que.value</p>
				</aside>
			</Animation>
		);
	}
}

export default Game;
