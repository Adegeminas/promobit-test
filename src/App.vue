<script setup lang="ts">
import { provide, ref } from 'vue';
import VolumeForm from './components/VolumeForm.vue';
import { measurementSystemKey } from './injectionKeys';
import type { MeasurementSystem } from './utils/sizeToBytes';

const measurementSystem = ref<MeasurementSystem>('decimal');
provide(measurementSystemKey, measurementSystem);

function setSystem(sys: MeasurementSystem): void {
	measurementSystem.value = sys;
}
</script>

<template>
	<div class="app">
		<header class="header">
			<h1 class="header__title">Volume Manager</h1>
			<div class="header__switch" role="group" aria-label="Система измерения размера">
				<button
					type="button"
					class="seg"
					:class="{ 'seg--active': measurementSystem === 'decimal' }"
					@click="setSystem('decimal')"
				>
					Десятичная
					<span class="seg__sub">KB, MB, GB (×1000)</span>
				</button>
				<button
					type="button"
					class="seg"
					:class="{ 'seg--active': measurementSystem === 'binary' }"
					@click="setSystem('binary')"
				>
					Двоичная
					<span class="seg__sub">KiB, MiB, GiB (×1024)</span>
				</button>
			</div>
		</header>

		<main class="main">
			<VolumeForm />
		</main>
	</div>
</template>

<style>
:root {
  --bg: #0f1419;
  --surface: #1a222d;
  --border: #2d3a4a;
  --text: #e7ecf1;
  --muted: #8b9aab;
  --accent: #3d8bfd;
  --danger: #f87171;
  --ok: #4ade80;
  --code-bg: #121920;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Segoe UI", system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.45;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.header__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
}

.header__switch {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.seg {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font: inherit;
  cursor: pointer;
  text-align: left;
}

.seg--active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.seg__sub {
  font-size: 0.7rem;
  color: var(--muted);
  font-weight: 400;
}

.main {
  flex: 1;
  padding: 1.5rem;
}
</style>
