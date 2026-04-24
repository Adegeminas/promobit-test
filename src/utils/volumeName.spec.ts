import { describe, expect, it } from 'vitest';
import { isValidVolumeNameFormat, volumeNameFormatError } from './volumeName';

describe('volumeName', () => {
	it('принимает латиницу, цифры и дефис', () => {
		expect(isValidVolumeNameFormat('ab-12')).toBe(true);
		expect(isValidVolumeNameFormat('MyVolume')).toBe(true);
	});

	it('отклоняет пустое и недопустимые символы', () => {
		expect(isValidVolumeNameFormat('')).toBe(false);
		expect(isValidVolumeNameFormat('пробел')).toBe(false);
		expect(isValidVolumeNameFormat('under_score')).toBe(false);
		expect(isValidVolumeNameFormat('dot.name')).toBe(false);
	});

	it('volumeNameFormatError сообщения', () => {
		expect(volumeNameFormatError('')).toBe('Укажите имя');
		expect(volumeNameFormatError('bad name')).toContain('Только латиница');
		expect(volumeNameFormatError('ok-name')).toBeNull();
	});
});
