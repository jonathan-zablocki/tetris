import React, { Component } from "react";
import { Animation } from "./animation.jsx";
import * as CONST from "../constants/constants.js";
import "./game.css";
import "./canvas.css";
//import { tetromino } from "./tetromino.jsx";
//const tetromino = require("./tetromino.jsx");

class Game extends Component {
	initialState = () => {
		let board = [...Array(CONST.HEIGHT)].map(() => Array(CONST.WIDTH));
		for (let j = 0; j < CONST.HEIGHT; j++) {
			for (let i = 0; i < CONST.WIDTH; i++) {
				board[j][i] = 0;
			}
		}

		return {
			board: board,
			tetromino: this.createTetromino(),
			que: [this.createTetromino()],
			score: 0,
			linesCleared: 0,
		};
	};

	constructor(props) {
		super(props);
		this.state = this.initialState();
		this.lastDropTime = Date.now();
		this.accumTime = 0;
		this.dropTime = CONST.LEVEL_SPEEDS.speeds[0];
	}

	componentDidMount = () => {
		this.timeOut = setTimeout(this.nextDrop, this.dropTime);
	};

	reset() {
		this.setState(this.initialState());
		this.dropTime = CONST.LEVEL_SPEEDS.speeds[0];
		this.lastDropTime = Date.now();
		this.accumTime = 0;
		this.resetTimeout();
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

		if (clearRows.length) {
			let boardCopy = [...this.state.board];
			clearRows.sort();
			for (let i = clearRows.length - 1; i >= 0; i--) {
				boardCopy.splice(clearRows[i], 1);
				boardCopy.push(new Array(CONST.WIDTH).fill(0));
			}

			const linesMultiplier = [40, 100, 300, 1200][clearRows.length - 1];
			const points = linesMultiplier * (~~(this.state.linesCleared / 10) + 1);

			this.setState((state) => ({
				board: boardCopy,
				linesCleared: state.linesCleared + clearRows.length,
				score: state.score + points,
			}));
		}
	};

	spawnTetromino(tetromino) {
		if (this.checkCollision(tetromino)) {
			tetromino.origin.y++;
		}
		return tetromino;
	}

	tetrominoBottomedOut = () => {
		this.lockTetromino();
		this.clearLines();
		const levelIndex = CONST.LEVEL_SPEEDS.levels.findIndex(
			(element) => element >= Math.min(~~(this.state.linesCleared / 10), 29)
		);
		const speed = CONST.LEVEL_SPEEDS.speeds[levelIndex];
		let copyQueTetromino = JSON.parse(JSON.stringify(this.state.que[0]));
		const spawnedTetromino = this.spawnTetromino(copyQueTetromino);
		if (this.checkCollision(spawnedTetromino)) {
			console.log("GAME OVER");
			this.reset();
		} else {
			this.dropTime = speed;
			this.setState((state) => ({
				tetromino: spawnedTetromino,
				que: [this.createTetromino()],
			}));
		}
	};

	nextDrop = () => {
		this.accumTime += Date.now() - this.lastDropTime;

		this.lastDropTime = Date.now();
		let copyTetromino = JSON.parse(JSON.stringify(this.state.tetromino));
		copyTetromino.origin.y--;
		if (this.checkCollision(copyTetromino)) {
			this.tetrominoBottomedOut();
		} else {
			this.setState({
				tetromino: copyTetromino,
			});
		}

		this.resetTimeout();
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
			return false;
		});
	};

	resetTimeout = () => {
		clearTimeout(this.timeOut);
		this.timeOut = setTimeout(this.nextDrop, this.dropTime);
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

		if (downFlag) {
			//Reset the drop timer if the user dropped early and give bonus
			this.resetTimeout();
			this.setState((state) => ({
				score: state.score + 1,
			}));
		}
		if (this.checkCollision(copyTetromino)) {
			// User Soft dropped to bottom
			this.tetrominoBottomedOut();
		} else {
			// No collision Update move state
			this.setState((state) => ({
				tetromino: copyTetromino,
			}));
		}
	};

	render() {
		return (
			<div className="grid-container">
				<Animation
					className="canvas"
					board={this.state.board}
					tetromino={this.state.tetromino}
					handleKeyPress={this.handleKeyPress}
				/>
				<div className="score"> {this.state.score}</div>
				{/* <div className="canvas">Test</div> */}
				<div className="next-piece">
					{this.state.que[0] && this.state.que[0].value}
				</div>
				<div className="lines-cleared">{this.state.linesCleared}</div>
				<div className="level">{~~(this.state.linesCleared / 10)}</div>
			</div>
		);
	}
}

export default Game;
