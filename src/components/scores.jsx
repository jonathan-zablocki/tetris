import React from "react";

const Scores = ({ scores }) => {
	return (
		<div>
			{scores.map((score) => (
				<table class="table">
					<thead class="thead-dark">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Score</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">1</th>
							<td>{scores.score}</td>
						</tr>
					</tbody>
				</table>
			))}
		</div>
	);
};

export default Scores;
