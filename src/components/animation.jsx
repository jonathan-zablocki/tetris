import React, { Component, createRef } from "react";
import {
	GAME_INTERVAL,
	HEIGHT,
	WIDTH,
	HEIGHT_VIS,
} from "../constants/constants.js";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();
	}

	componentDidMount = () => {
		this.forceUpdate();
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

		// Draw Board
		for (let j = 0; j < HEIGHT_VIS; j++) {
			for (let i = 0; i < WIDTH; i++) {
				drawCell({ x: i, y: j }, { x: 0, y: 0 }, board[j][i].value);
			}
		}

		//Draw Tetromino
		for (let j = 0; j < tetromino.cells.length; j++) {
			for (let i = 0; i < tetromino.cells[0].length; i++) {
				if (tetromino.cells[j][i]) {
					drawCell({ x: i, y: j }, tetromino.origin, tetromino.value);
				}
			}
		}

		function drawCell(pos, offset = { x: 0, y: 0 }, value = null) {
			ctx.save();
			ctx.beginPath();
			ctx.translate(0, HEIGHT_VIS * 10);
			ctx.scale(1, -1);
			ctx.translate((pos.x + offset.x) * 10, (pos.y + offset.y) * 10);
			if (value) {
				ctx.fillStyle = "#e68a8a";
			} else {
				ctx.fillStyle = "#dcdcdc";
			}
			ctx.fillRect(0, 0, 10, 10);
			ctx.strokeRect(0, 0, 10, 10);
			ctx.restore();
		}
	};

	render() {
		return (
			<div>
				<canvas
					ref={this.canvasRef}
					style={{
						border: "1px solid #000",
						marginTop: 10,
						marginLeft: 10,
					}}
					width={100}
					height={200}
				/>
			</div>
		);
	}
}

export default Canvas;

export class Animation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			accumTime: 0,
			lastUpdate: Date.now(),
		};
	}
	componentDidMount = () => {
		this.rAF = requestAnimationFrame(this.updateAnimationState);
	};

	updateAnimationState = () => {
		this.rAF = requestAnimationFrame(this.updateAnimationState);
		this.setState({
			accumTime: Date.now() - this.state.lastUpdate,
		});

		while (this.state.accumTime >= GAME_INTERVAL) {
			this.setState({
				lastUpdate: Date.now(),
				accumTime: this.state.accumTime - GAME_INTERVAL,
			});
			this.props.nextGameStep();
		}
	};

	componentWillUnmount = () => {
		cancelAnimationFrame(this.rAF);
	};

	render = () => {
		return <Canvas {...this.props} />;
	};
}
