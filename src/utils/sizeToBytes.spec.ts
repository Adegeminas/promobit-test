import { describe, expect, it } from 'vitest';
import { defaultUnit, sizeToBytes, unitsForSystem } from './sizeToBytes';

describe('sizeToBytes', () => {
	it('десятичная: KB, MB, GB на базе 1000', () => {
		expect(sizeToBytes(1, 'KB', 'decimal')).toBe(1000);
		expect(sizeToBytes(2, 'MB', 'decimal')).toBe(2_000_000);
		expect(sizeToBytes(1, 'GB', 'decimal')).toBe(1_000_000_000);
	});

	it('двоичная: KiB, MiB, GiB на базе 1024', () => {
		expect(sizeToBytes(1, 'KiB', 'binary')).toBe(1024);
		expect(sizeToBytes(1, 'MiB', 'binary')).toBe(1024 ** 2);
		expect(sizeToBytes(1, 'GiB', 'binary')).toBe(1024 ** 3);
	});

	it('возвращает NaN при неверной единице или значении', () => {
		expect(Number.isNaN(sizeToBytes(1, 'XX', 'decimal'))).toBe(true);
		expect(Number.isNaN(sizeToBytes(-1, 'GB', 'decimal'))).toBe(true);
		expect(Number.isNaN(sizeToBytes(NaN, 'GB', 'decimal'))).toBe(true);
	});
});

describe('unitsForSystem / defaultUnit', () => {
	it('перечисляет единицы по системе', () => {
		expect(unitsForSystem('decimal')).toEqual(['KB', 'MB', 'GB']);
		expect(unitsForSystem('binary')).toEqual(['KiB', 'MiB', 'GiB']);
	});

	it('дефолтные единицы', () => {
		expect(defaultUnit('decimal')).toBe('GB');
		expect(defaultUnit('binary')).toBe('GiB');
	});
});
