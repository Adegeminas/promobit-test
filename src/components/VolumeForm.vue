<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { mockApi } from '../mock';
import { measurementSystemKey } from '../injectionKeys';
import {
	defaultUnit,
	sizeToBytes,
	unitsForSystem,
	type MeasurementSystem,
} from '../utils/sizeToBytes';
import { isValidVolumeNameFormat, volumeNameFormatError } from '../utils/volumeName';

export type VolumePayload = {
	name: string;
	type: 'block' | 'file';
	sizeBytes: number;
};

function requireInject<T>(value: T | undefined, message: string): T {
	if (value === undefined) {
		throw new Error(message);
	}
	return value;
}

const measurementSystem = requireInject(
	inject(measurementSystemKey),
	'VolumeForm: measurementSystem не предоставлен',
);

const name = ref('');
const type = ref<'block' | 'file'>('block');
const sizeValue = ref<string>('');
const sizeUnit = ref<string>(defaultUnit(measurementSystem.value));

const nameTouched = ref(false);
const nameChecking = ref(false);
const nameUnique = ref<boolean | null>(null);
const nameCheckError = ref<string | null>(null);

const submitted = ref<VolumePayload | null>(null);

const unitOptions = computed(() => [...unitsForSystem(measurementSystem.value)]);

watch(
	() => measurementSystem.value,
	(sys: MeasurementSystem) => {
		const allowed = unitsForSystem(sys);
		if (!allowed.includes(sizeUnit.value as never)) {
			sizeUnit.value = defaultUnit(sys);
		}
	},
);

watch(name, () => {
	nameUnique.value = null;
	nameCheckError.value = null;
});

let nameDebounceTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleNameCheck(): void {
	if (nameDebounceTimer) {
		clearTimeout(nameDebounceTimer);
	}
	nameDebounceTimer = setTimeout(() => {
		void runNameCheck();
	}, 450);
}

async function runNameCheck(): Promise<void> {
	const n = name.value.trim();
	if (!isValidVolumeNameFormat(n)) {
		nameUnique.value = null;
		nameChecking.value = false;
		return;
	}
	nameChecking.value = true;
	nameCheckError.value = null;
	try {
		const { unique } = await mockApi.checkName(n);
		nameUnique.value = unique;
	} catch {
		nameCheckError.value = 'Ошибка проверки имени. Повторите попытку.';
		nameUnique.value = null;
	} finally {
		nameChecking.value = false;
	}
}

const nameFormatMessage = computed(() => {
	if (!nameTouched.value && name.value.length === 0) {
		return null;
	}
	return volumeNameFormatError(name.value.trim());
});

const nameUniqueMessage = computed(() => {
	if (nameFormatMessage.value || nameCheckError.value) {
		return null;
	}
	if (nameChecking.value) {
		return null;
	}
	if (nameUnique.value === false) {
		return 'Имя уже занято';
	}
	return null;
});

const sizeNum = computed(() => {
	const raw = sizeValue.value.trim().replace(',', '.');
	if (raw === '') {
		return NaN;
	}
	return Number(raw);
});

const sizeError = computed(() => {
	const n = sizeNum.value;
	if (!Number.isFinite(n) || n <= 0) {
		return 'Укажите положительное число';
	}
	const bytes = sizeToBytes(n, sizeUnit.value, measurementSystem.value);
	if (!Number.isFinite(bytes) || bytes <= 0) {
		return 'Некорректный размер';
	}
	return null;
});

const canSubmit = computed(() => {
	const n = name.value.trim();
	if (!isValidVolumeNameFormat(n)) {
		return false;
	}
	if (nameChecking.value || nameUnique.value !== true) {
		return false;
	}
	if (sizeError.value) {
		return false;
	}
	return true;
});

async function onSubmit(): Promise<void> {
	nameTouched.value = true;
	submitted.value = null;

	const n = name.value.trim();
	if (!isValidVolumeNameFormat(n)) {
		return;
	}

	if (nameUnique.value !== true || nameCheckError.value) {
		await runNameCheck();
		if (nameUnique.value !== true || nameCheckError.value) {
			return;
		}
	}

	if (sizeError.value) {
		return;
	}

	const bytes = Math.round(sizeToBytes(sizeNum.value, sizeUnit.value, measurementSystem.value));

	submitted.value = {
		name: n,
		type: type.value,
		sizeBytes: bytes,
	};
}

function onNameBlur(): void {
	nameTouched.value = true;
	void runNameCheck();
}
</script>

<template>
	<div class="layout">
		<form class="form" @submit.prevent="onSubmit">
			<h2 class="form__title">Новый Volume</h2>

			<label class="field">
				<span class="field__label">Имя</span>
				<input
					v-model="name"
					class="field__input"
					type="text"
					autocomplete="off"
					placeholder="my-volume-1"
					@blur="onNameBlur"
					@input="scheduleNameCheck"
				/>
				<span v-if="nameChecking" class="field__hint field__hint--muted">Проверка имени…</span>
				<span v-if="nameFormatMessage" class="field__hint field__hint--error">{{
					nameFormatMessage
				}}</span>
				<span v-else-if="nameCheckError" class="field__hint field__hint--error">{{
					nameCheckError
				}}</span>
				<span v-else-if="nameUniqueMessage" class="field__hint field__hint--error">{{
					nameUniqueMessage
				}}</span>
				<span v-else-if="nameUnique === true" class="field__hint field__hint--ok"
					>Имя свободно</span
				>
			</label>

			<fieldset class="field field--inline">
				<legend class="field__label">Тип</legend>
				<label class="radio">
					<input v-model="type" type="radio" value="block" />
					block
				</label>
				<label class="radio">
					<input v-model="type" type="radio" value="file" />
					file
				</label>
			</fieldset>

			<div class="field field--row">
				<label class="field field--grow">
					<span class="field__label">Размер</span>
					<input
						v-model="sizeValue"
						class="field__input"
						type="text"
						inputmode="decimal"
						placeholder="10"
						data-testid="volume-size"
					/>
				</label>
				<label class="field field--unit">
					<span class="field__label">Единица</span>
					<select v-model="sizeUnit" class="field__input field__select">
						<option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
					</select>
				</label>
			</div>
			<p v-if="sizeError && sizeValue.trim() !== ''" class="field__hint field__hint--error">
				{{ sizeError }}
			</p>
			<p v-else class="field__hint field__hint--muted">
				Система измерения задаётся в шапке: KB/MB/GB (×1000) или KiB/MiB/GiB (×1024).
			</p>

			<button class="btn" type="submit" :disabled="!canSubmit">Сохранить</button>
		</form>

		<section v-if="submitted" class="result" aria-live="polite">
			<h3 class="result__title">Объект для бэкенда</h3>
			<pre class="result__json">{{ JSON.stringify(submitted, null, 2) }}</pre>
		</section>
	</div>
</template>

<style scoped>
.layout {
  display: grid;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: minmax(0, 28rem) minmax(0, 1fr);
  }
}

.form {
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  border: none;
}

.field--inline {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.field--row {
  flex-direction: row;
  align-items: flex-end;
  gap: 0.75rem;
}

.field--grow {
  flex: 1;
  min-width: 0;
}

.field--unit {
  flex: 0 0 7rem;
}

.field__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--muted);
}

.field__input,
.field__select {
  font: inherit;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: inherit;
}

.field__select {
  cursor: pointer;
}

.field__hint {
  font-size: 0.8rem;
  margin: 0;
}

.field__hint--muted {
  color: var(--muted);
}

.field__hint--error {
  color: var(--danger);
}

.field__hint--ok {
  color: var(--ok);
}

.radio {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn {
  align-self: flex-start;
  font: inherit;
  font-weight: 500;
  padding: 0.55rem 1.25rem;
  border: none;
  border-radius: 6px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.result {
  margin-top: 0;
  max-width: 100%;
}

.result__title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.result__json {
  margin: 0;
  padding: 1rem;
  border-radius: 8px;
  background: var(--code-bg);
  border: 1px solid var(--border);
  font-size: 0.85rem;
  overflow: auto;
}
</style>
