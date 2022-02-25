export default class Scene {
	constructor() {
		this.nodes = [];
	}

	addNode(node) {
		this.nodes.push(node);
	}

	removeNode(node) {
		this.nodes.pop(node);
	}

	deleteNode(node) {
		let indexPlaneta = this.nodes.indexOf(node);

		if (indexPlaneta !== -1) {
			this.nodes.splice(indexPlaneta, 1);
		}
	}

	traverse(before, after) {
		this.nodes.forEach((node) => node.traverse(before, after));
	}
}
