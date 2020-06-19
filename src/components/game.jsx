import React, { Component, Fragment } from "react";
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
				board[j][i] = 0;
			}
		}

		this.state = {
			board: board,
			tetromino: this.createTetromino(),
			dropTime: CONST.LEVEL_SPEEDS.speeds[0],
			lastDrop: Date.now(),
			que: [this.createTetromino()],
			hold: {},
			score: 0,
			linesCleared: 0,
		};
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
			board[pos.y][pos.x] = this.state.tetromino.value;
		});

		this.setState({
			board: board,
		});
	};

	clearLines = () => {
		const cellPositions = this.findPos(this.state.tetromino);
		const potentialRows = [...new Set(cellPositions.map((pos) => pos.y))];
		const clearRows = potentialRows.filter((rowNum) => {
			return !this.state.board[rowNum].includes(0);
		});
		//console.log(clearRows);

		if (clearRows.length) {
			let boardCopy = [...this.state.board];
			clearRows.sort();
			for (let i = clearRows.length - 1; i >= 0; i--) {
				boardCopy.splice(clearRows[i], 1);
				boardCopy.push(new Array(CONST.WIDTH).fill(0));
			}

			console.log(clearRows.length);

			this.setState({
				board: boardCopy,
				linesCleared: this.state.linesCleared + clearRows.length,
			});
		}
	};

	nextGameStep = () => {
		if (Date.now() - this.state.lastDrop > this.state.dropTime) {
			let copyTetromino = JSON.parse(JSON.stringify(this.state.tetromino));
			copyTetromino.origin.y--;
			if (this.checkCollision(copyTetromino)) {
				this.lockTetromino();
				this.clearLines();
				const levelIndex = CONST.LEVEL_SPEEDS.levels.findIndex(
					(element) => element >= ~~(this.linesCleard / 10)
				);
				const speed = CONST.LEVEL_SPEEDS.speeds[levelIndex];
				this.setState({
					lastDrop: Date.now(),
					tetromino: this.state.que.pop(),
					que: [this.createTetromino(), ...this.state.que],
					dropTime: speed,
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
			} else if (board[pos.y][pos.x]) {
				//Collision on the Board
				return true;
			}
		});
	};

	handleKeyPress = (e) => {
		let keyCode = e.code;
		let copyTetromino = JSON.parse(JSON.stringify(this.state.tetromino));

		let downFlag = false;

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
				downFlag = true;

				break;
			default:
				break;
		}
		if (!this.checkCollision(copyTetromino)) {
			this.setState({
				tetromino: copyTetromino,
				lastDrop: downFlag ? Date.now() : this.state.lastDrop,
			});
		}
	};

	render() {
		return (
			<Fragment>
				<Animation
					nextGameStep={this.nextGameStep}
					board={this.state.board}
					tetromino={this.state.tetromino}
					handleKeyPress={this.handleKeyPress}
				>
					<aside>
						asldjfl;asdjfl;ajsd;lf jl;asjdf;lajs;dlfjdjkkkkkkkdkdkskasldflasdlf{" "}
					</aside>
				</Animation>
				<div> {this.state.que[0] && this.state.que[0].value}</div>
				<div> {this.state.score}</div>
				<div> {this.state.linesCleared}</div>
				<div> {~~(this.state.linesCleared / 10)}</div>
			</Fragment>
		);
	}
}

export default Game;
