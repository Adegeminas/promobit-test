import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import VolumeForm from './VolumeForm.vue';
import { measurementSystemKey } from '../injectionKeys';
import type { MeasurementSystem } from '../utils/sizeToBytes';
import { mockApi } from '../mock';

vi.mock('../mock', () => ({
	mockApi: {
		checkName: vi.fn(),
	},
}));

function mountForm(system: MeasurementSystem = 'decimal') {
	const measurementSystem = ref<MeasurementSystem>(system);
	return mount(VolumeForm, {
		global: {
			provide: {
				[measurementSystemKey as symbol]: measurementSystem,
			},
		},
	});
}

describe('VolumeForm', () => {
	describe('отправка формы', () => {
		beforeEach(() => {
			vi.mocked(mockApi.checkName).mockImplementation(async (name: string) => {
				await new Promise((r) => setTimeout(r, 100));
				return { unique: name === 'new-unique-name-xyz' };
			});
		});

		afterEach(() => {
			vi.clearAllMocks();
		});

		it('после проверки имени и валидного размера отправляет sizeBytes (десятичная GB)', async () => {
			const wrapper = mountForm('decimal');
			await wrapper.get('input[placeholder="my-volume-1"]').setValue('new-unique-name-xyz');
			await wrapper.get('input[placeholder="my-volume-1"]').trigger('blur');
			await flushPromises();
			await new Promise((r) => setTimeout(r, 150));

			await wrapper.get('[data-testid="volume-size"]').setValue('1');
			await wrapper.get('.field__select').setValue('GB');
			await wrapper.vm.$nextTick();

			const sizeInput = wrapper.get('[data-testid="volume-size"]').element as HTMLInputElement;
			expect(sizeInput.value).toBe('1');

			const btn = wrapper.get('button[type="submit"]');
			expect(btn.attributes('disabled')).toBeUndefined();

			await wrapper.get('form').trigger('submit');
			await flushPromises();

			const pre = wrapper.get('pre.result__json');
			expect(JSON.parse(pre.text())).toEqual({
				name: 'new-unique-name-xyz',
				type: 'block',
				sizeBytes: 1_000_000_000,
			});
		});
	});

	it('обновляет список единиц при смене системы измерения (provide)', async () => {
		vi.mocked(mockApi.checkName).mockResolvedValue({ unique: true });

		const measurementSystem = ref<MeasurementSystem>('decimal');
		const wrapper = mount(VolumeForm, {
			global: {
				provide: {
					[measurementSystemKey as symbol]: measurementSystem,
				},
			},
		});

		const optionLabels = () =>
			wrapper
				.find('select')
				.findAll('option')
				.map((o) => o.text());

		expect(optionLabels()).toEqual(['KB', 'MB', 'GB']);

		measurementSystem.value = 'binary';
		await wrapper.vm.$nextTick();

		expect(optionLabels()).toEqual(['KiB', 'MiB', 'GiB']);
	});
});
