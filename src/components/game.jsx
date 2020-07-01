import React, { Component, createRef } from "react";
import { Animation, drawCell } from "./animation.jsx";
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
		this.dropTime = CONST.LEVEL_SPEEDS.speeds[0];
		this.canvasRef = createRef();
	}

	componentDidMount = () => {
		this.timeOut = setTimeout(this.nextDrop, this.dropTime);
		this.canvas = this.canvasRef.current;
		this.ctx = this.canvas.getContext("2d");
	};

	reset() {
		this.setState(this.initialState());
		this.dropTime = CONST.LEVEL_SPEEDS.speeds[0];
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

		let score = this.state.score;

		if (downFlag) {
			//Reset the drop timer if the user dropped early and give bonus
			this.resetTimeout();
			score++;
		}
		if (this.checkCollision(copyTetromino)) {
			if (downFlag) {
				// User Soft dropped to bottom
				this.tetrominoBottomedOut();
			}
		} else {
			// No collision Update move state
			this.setState((state) => ({
				tetromino: copyTetromino,
				score: score,
			}));
		}
	};

	componentDidUpdate = () => {
		//Draw Next Tetromino
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		let tetromino = JSON.parse(JSON.stringify(this.state.que[0]));
		tetromino.origin = { x: 2, y: 3 };

		// this.ctx.width = tetromino.cells[0].length;
		// this.ctx.hieght = tetromino.cells.length;

		for (let j = 0; j < tetromino.cells.length; j++) {
			for (let i = 0; i < tetromino.cells[0].length; i++) {
				if (tetromino.cells[j][i]) {
					drawCell(
						this.ctx,
						{ x: i, y: j },
						tetromino.origin,
						tetromino.value,
						false
					);
				}
			}
		}

		this.ctx.save();
		this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.lineWidth = 10;
		this.ctx.stroke();
		this.ctx.restore();
	};

	render = () => {
		return (
			<div className="grid-container">
				<div className="score"> Score: {this.state.score}</div>
				<Animation
					board={this.state.board}
					tetromino={this.state.tetromino}
					handleKeyPress={this.handleKeyPress}
				/>

				{/* <div className="next-piece">Next:{this.state.que[0] && drawCell()}</div> */}
				<div className="next-piece">
					Next:
					<canvas
						ref={this.canvasRef}
						width={400}
						height={800}
						style={{ border: 1 }}
					/>
				</div>
				<div className="lines-cleared">
					{" "}
					Lines Cleared: {this.state.linesCleared}
				</div>
				<div className="level"> Level: {~~(this.state.linesCleared / 10)}</div>
			</div>
		);
	};
}

export default Game;
