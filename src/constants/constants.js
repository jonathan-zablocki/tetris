export const GAME_INTERVAL = 12; //12 ms per interval = 60 fps
export const HEIGHT = 22;
export const HEIGHT_VIS = 20;
export const WIDTH = 10;

export const I_ORIENT = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	].reverse(),
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	].reverse(),
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	].reverse(),
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	].reverse(),
];

export const I = {
	value: "I",
	origin: { x: 3, y: 17 },
	orient: 0,
	cells: I_ORIENT[0],
};

export const T_ORIENT = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0],
	].reverse(),
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0],
	].reverse(),
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0],
	].reverse(),
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0],
	].reverse(),
];

export const T = {
	value: "T",
	origin: { x: 3, y: 18 },
	orient: 0,
	cells: T_ORIENT[0],
};

export const S_ORIENT = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	].reverse(),

	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	].reverse(),

	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	].reverse(),

	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	].reverse(),
];

export const S = {
	value: "S",
	origin: { x: 3, y: 18 },
	orient: 0,
	cells: S_ORIENT[0],
};

export const Z_ORIENT = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	].reverse(),
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0],
	].reverse(),
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1],
	].reverse(),
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0],
	].reverse(),
];

export const Z = {
	value: "Z",
	origin: { x: 3, y: 18 },
	orient: 0,
	cells: Z_ORIENT[0],
};

export const O_ORIENT = [
	[
		[1, 1],
		[1, 1],
	].reverse(),
	[
		[1, 1],
		[1, 1],
	].reverse(),
	[
		[1, 1],
		[1, 1],
	].reverse(),
	[
		[1, 1],
		[1, 1],
	].reverse(),
];

export const O = {
	value: "O",
	origin: { x: 4, y: 19 },
	orient: 0,
	cells: O_ORIENT[0],
};

export const J_ORIENT = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
	].reverse(),
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
	].reverse(),
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1],
	].reverse(),
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0],
	].reverse(),
];

export const J = {
	value: "J",
	origin: { x: 4, y: 19 },
	orient: "J",
	cells: J_ORIENT[0],
};

export const L_ORIENT = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
	].reverse(),
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
	].reverse(),
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1],
	].reverse(),
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0],
	].reverse(),
];

export const L = {
	value: "L",
	origin: { x: 4, y: 19 },
	orient: 0,
	cells: L_ORIENT[0],
};
