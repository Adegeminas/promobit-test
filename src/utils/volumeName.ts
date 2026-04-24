/** Латиница, цифры и дефис (как в ТЗ). */
const NAME_PATTERN = /^[a-zA-Z0-9-]+$/;

export function isValidVolumeNameFormat(name: string): boolean {
	return name.length > 0 && NAME_PATTERN.test(name);
}

export function volumeNameFormatError(name: string): string | null {
	if (name.length === 0) {
		return 'Укажите имя';
	}
	if (!NAME_PATTERN.test(name)) {
		return 'Только латиница, цифры и дефис';
	}
	return null;
}
