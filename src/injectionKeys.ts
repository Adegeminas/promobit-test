import type { InjectionKey, Ref } from 'vue';
import type { MeasurementSystem } from './utils/sizeToBytes';

export const measurementSystemKey: InjectionKey<Ref<MeasurementSystem>> =
	Symbol('measurementSystem');
