export type MeasurementSystem = 'decimal' | 'binary';

export const DECIMAL_UNITS = ['KB', 'MB', 'GB'] as const;
export const BINARY_UNITS = ['KiB', 'MiB', 'GiB'] as const;

export type DecimalUnit = (typeof DECIMAL_UNITS)[number];
export type BinaryUnit = (typeof BINARY_UNITS)[number];

const DECIMAL_MULTIPLIERS: Record<DecimalUnit, number> = {
	KB: 1_000,
	MB: 1_000 ** 2,
	GB: 1_000 ** 3,
};

const BINARY_MULTIPLIERS: Record<BinaryUnit, number> = {
	KiB: 1024,
	MiB: 1024 ** 2,
	GiB: 1024 ** 3,
};

/** Конвертирует введённое значение в байты согласно системе и единице. */
export function sizeToBytes(value: number, unit: string, system: MeasurementSystem): number {
	if (!Number.isFinite(value) || value < 0) {
		return NaN;
	}
	if (system === 'decimal') {
		const m = DECIMAL_MULTIPLIERS[unit as DecimalUnit];
		return m !== undefined ? value * m : NaN;
	}
	const m = BINARY_MULTIPLIERS[unit as BinaryUnit];
	return m !== undefined ? value * m : NaN;
}

export function unitsForSystem(system: MeasurementSystem): readonly string[] {
	return system === 'decimal' ? DECIMAL_UNITS : BINARY_UNITS;
}

export function defaultUnit(system: MeasurementSystem): DecimalUnit | BinaryUnit {
	return system === 'decimal' ? 'GB' : 'GiB';
}
