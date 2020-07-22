import React, { Component } from "react";
import "./scores.css";

class Scores extends Component {
	constructor(props) {
		super(props);
		this.state = { isLoading: true, isError: false };
	}

	componentDidMount() {
		fetch("https://tetris-backend-server.herokuapp.com/scores")
			.then((res) => res.json())
			.then((data) => {
				this.setState({ serverData: data, isLoading: false });
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isError: true, isLoading: false });
			});
	}

	render = () => {
		if (this.state.isLoading) {
			return <div className="scores">Loading ...</div>;
		} else if (!this.state.isError) {
			const scores = this.state.serverData.map((a) => a.score);
			console.log(this.props);
			return (
				<div className="scores">
					<div className="title">High Scores</div>
					<div className="scroll">
						<table>
							<tbody>
								{scores.map((score, index) => (
									<tr key={index + 1}>
										<td className="position">{index + 1}</td>
										<td className="high-score">{score}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<button
						className="closeScoresButton"
						onClick={this.props.handleCloseScores}
					>
						{"<"}
					</button>
				</div>
			);
		} else {
			setTimeout(() => {
				this.props.handleCloseScores();
			}, 3000);
			return (
				<div className="scores">
					<center>Could Not View High Scores</center>
				</div>
			);
		}
	};
}

export default Scores;
