/** Логика из приложенного mock.js — без HTTP. */
const existingNames = [
	'fast-storage',
	'cold-disk',
	'dark-pool',
	'bright-node',
	'deep-cache',
	'sharp-shard',
	'slow-drive',
	'hot-block',
	'large-volume',
	'small-chunk',
];

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeError(): void {
	if (Math.random() < 0.08) {
		throw new Error('Internal Server Error');
	}
}

export const mockApi = {
	async checkName(name: string): Promise<{ unique: boolean }> {
		await delay(200 + Math.random() * 400);
		maybeError();
		return {
			unique: !existingNames.includes(name),
		};
	},
};
