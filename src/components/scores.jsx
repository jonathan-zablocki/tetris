import React, { Component } from "react";
import "./scores.css";

class Scores extends Component {
	constructor(props) {
		super(props);
		this.state = { isLoading: true, isError: false, isServerSlow: false };
	}

	componentDidMount() {
		//Free server can take a long time to wakeup. Give user a headsup
		const serverSlowTimeout = setTimeout(() => {
			this.setState({ isServerSlow: true });
		}, 15000);

		fetch("https://tetris-backend-server.herokuapp.com/scores")
			.then((res) => res.json())
			.then((data) => {
				this.setState({ serverData: data, isLoading: false });
				//Server responded in time
				clearTimeout(serverSlowTimeout);
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isError: true, isLoading: false, isSeverSlow: false });
			});
	}

	render = () => {
		const backButton = (
			<button
				className="closeScoresButton"
				onClick={this.props.handleCloseScores}
			>
				{"<"}
			</button>
		);

		if (this.state.isLoading) {
			if (!this.state.isServerSlow) {
				return <div className="scores">Loading ... {backButton}</div>;
			} else {
				return (
					<div className="scores">
						...Server is sleeping :( If you wait a minute it should wake up.
						{backButton}
					</div>
				);
			}
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
					{backButton}
				</div>
			);
		} else {
			setTimeout(() => {
				this.props.handleCloseScores();
			}, 5000);
			return (
				<div className="scores">
					<center>Could Not View High Scores</center>
					{backButton}
				</div>
			);
		}
	};
}

export default Scores;
