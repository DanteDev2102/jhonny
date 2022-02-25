import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

let xVel = 0;
let yVel = 0;

export default class Camera extends Node {
	constructor(options) {
		super(options);
		Utils.init(this, this.constructor.defaults, options);

		this.projection = mat4.create();
		this.updateProjection();

		this.mousemoveHandler = this.mousemoveHandler.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.keyupHandler = this.keyupHandler.bind(this);
		this.keys = {};
	}

	updateProjection() {
		mat4.perspective(
			this.projection,
			this.fov,
			this.aspect,
			this.near,
			this.far
		);
	}

	update(dt) {
		const c = this;

		let dx_update = 0;
		let dy_update = 0;
		if (this.keys['ArrowRight']) {
			dx_update = -this.keySensitivity;
		}
		if (this.keys['ArrowLeft']) {
			dx_update = this.keySensitivity;
		}
		if (this.keys['ArrowDown']) {
			dy_update = -this.keySensitivity;
		}
		if (this.keys['ArrowUp']) {
			dy_update = this.keySensitivity;
		}
		xVel = xVel + dx_update * dt * this.acceleration;
		yVel = yVel + dy_update * dt * this.acceleration;
		if (
			!this.keys['ArrowRight'] &&
			!this.keys['ArrowLeft'] &&
			!this.keys['ArrowDown'] &&
			!this.keys['ArrowUp']
		) {
			xVel *= 1 - this.friction;
			yVel *= 1 - this.friction;
		}
		if (xVel > this.maxMouseSpeed) {
			xVel = this.maxMouseSpeed;
		}
		if (xVel < -this.maxMouseSpeed) {
			xVel = -this.maxMouseSpeed;
		}
		if (yVel > this.maxMouseSpeed) {
			yVel = this.maxMouseSpeed;
		}
		if (yVel < -this.maxMouseSpeed) {
			yVel = -this.maxMouseSpeed;
		}
		c.rotation[1] += xVel;
		c.rotation[0] += yVel;
	}

	enable() {
		document.addEventListener('mousemove', this.mousemoveHandler);
		document.addEventListener('keydown', this.keydownHandler);
		document.addEventListener('keyup', this.keyupHandler);
	}

	disable() {
		document.removeEventListener(
			'mousemove',
			this.mousemoveHandler
		);
		document.removeEventListener('keydown', this.keydownHandler);
		document.removeEventListener('keyup', this.keyupHandler);

		for (let key in this.keys) {
			this.keys[key] = false;
		}
	}

	mousemoveHandler(e) {
		const c = this;

		const pi = Math.PI;
		const twopi = pi * 2;
		const halfpi = pi / 2;

		if (c.rotation[0] > halfpi) {
			c.rotation[0] = halfpi;
		}
		if (c.rotation[0] < -halfpi) {
			c.rotation[0] = -halfpi;
		}

		c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
	}

	keydownHandler(e) {
		this.keys[e.code] = true;
	}

	keyupHandler(e) {
		this.keys[e.code] = false;
	}

	getRotation() {
		return vec3.set(
			vec3.create(),
			this.rotation[0],
			this.rotation[1],
			0
		);
	}

	getLocation() {
		return vec3.set(
			vec3.create(),
			this.translation[0],
			this.translation[1],
			this.translation[2]
		);
	}
}

Camera.defaults = {
	aspect: 1,
	fov: 1.5,
	near: 0.01,
	far: 1000,
	velocity: [0, 0, 0],
	mouseSensitivity: 0.0000075,
	maxSpeed: 3,
	friction: 0.03,
	acceleration: 3,
	mouseAcceleration: 1,
	maxMouseSpeed: 0.01,
	keySensitivity: 0.0025
};
