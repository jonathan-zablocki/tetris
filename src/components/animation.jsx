import React, { Component, createRef } from "react";
import * as CONST from "../constants/constants.js";
import "./canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();
	}

	componentDidMount = () => {
		document.addEventListener("keydown", this.props.handleKeyPress);
	};

	componentWillUnmount = () => {
		document.removeEventListener("keydown", this.props.handleKeyPress);
	};

	componentDidUpdate = () => {
		const canvas = this.canvasRef.current;
		const ctx = canvas.getContext("2d");
		const board = this.props.board;
		const tetromino = this.props.tetromino;

		console.log(canvas.clientWidth);
		console.log(canvas.clientHeight);

		console.log(canvas.width);
		console.log(canvas.height);

		canvas.width = 10 * CONST.SCALE;
		canvas.height = 20 * CONST.SCALE;

		// Draw Board
		for (let j = 0; j < CONST.HEIGHT_VIS; j++) {
			for (let i = 0; i < CONST.WIDTH; i++) {
				drawCell(ctx, { x: i, y: j }, { x: 0, y: 0 }, board[j][i]);
			}
		}

		//Draw Tetromino
		for (let j = 0; j < tetromino.cells.length; j++) {
			for (let i = 0; i < tetromino.cells[0].length; i++) {
				if (tetromino.cells[j][i]) {
					drawCell(
						ctx,
						{ x: i, y: j },
						tetromino.origin,
						tetromino.value,
						false
					);
				}
			}
		}
	};

	render() {
		return <canvas className="canvas" ref={this.canvasRef} />;
	}
}

export default Canvas;

export class Animation extends React.Component {
	constructor(props) {
		super(props);
		this.AnimationFlag = false;
		this.lastUpdate = Date.now();
	}

	componentDidMount = () => {
		this.rAF = requestAnimationFrame(this.updateAnimationState);
	};

	shouldComponentUpdate = () => {
		return this.AnimationFlag;
	};

	componentDidUpdate = () => {
		this.AnimationFlag = false;
	};

	updateAnimationState = () => {
		this.rAF = requestAnimationFrame(this.updateAnimationState);
		this.AnimationFlag = true;
	};

	componentWillUnmount = () => {
		cancelAnimationFrame(this.rAF);
	};

	render = () => {
		return <Canvas {...this.props} />;
	};
}

export function drawCell(
	ctx,
	pos,
	offset = { x: 0, y: 0 },
	value = null,
	isLocked = true,
	scale = CONST.SCALE,
	isNextPeice = false
) {
	ctx.save();
	ctx.scale(1 * scale, -1 * scale);
	if (!isNextPeice) {
		ctx.translate(0, -CONST.HEIGHT_VIS);
	}
	ctx.translate(pos.x + offset.x, pos.y + offset.y);

	// Lower Saturation on tetromino after they are placed
	const decSaturation = isLocked ? -25 : 0;

	switch (value) {
		case "I":
			ctx.fillStyle = "hsl(192.7, " + (73.8 + decSaturation) + "%, 68.7%)";
			break;
		case "J":
			ctx.fillStyle = "hsl(217.2, " + (100 + decSaturation) + "%, 36.7%)";
			break;
		case "L":
			ctx.fillStyle = "hsl(38.3, " + (100 + decSaturation) + "%, 50%)";
			break;
		case "S":
			ctx.fillStyle = "hsl(111.5, " + (67.4 + decSaturation) + "%, 50.6%)";
			break;
		case "Z":
			ctx.fillStyle = "hsl(355.8, " + (85.4 + decSaturation) + "%, 56.9%)";
			break;
		case "T":
			ctx.fillStyle = "hsl(300, " + (64 + decSaturation) + "%, 44.7%)";
			break;
		case "O":
			ctx.fillStyle = "hsl(51.7, " + (100 + decSaturation) + "%, 49.8%)";
			break;
		default:
			ctx.fillStyle = "hsl(214.3, 4%, 33.9%)";
			break;
	}
	ctx.fillRect(0, 0, 1, 1);
	ctx.lineWidth = ~~(1 / scale);
	ctx.rect(0, 0, 1, 1);
	ctx.restore();
	ctx.stroke();
}
