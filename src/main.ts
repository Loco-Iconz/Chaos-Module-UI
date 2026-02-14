import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { healthCheck, fetchChaosData, testChaos } from './api.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Chaos Module UI</h1>
    
    <div class="card">
      <h2>Backend Connection Test</h2>
      <button id="healthCheckBtn" type="button">Test Backend Connection</button>
      <button id="fetchDataBtn" type="button">Fetch Chaos Data</button>
      <button id="testChaosBtn" type="button">Run Chaos Test</button>
    </div>

    <div class="card">
      <h2>Response</h2>
      <pre id="response">No response yet. Click a button to test.</pre>
    </div>

    <div class="card">
      <h2>Counter</h2>
      <button id="counter" type="button"></button>
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// Set up backend testing
const responseEl = document.querySelector<HTMLPreElement>('#response')!

document.querySelector('#healthCheckBtn')?.addEventListener('click', async () => {
  responseEl.textContent = 'Loading...'
  const result = await healthCheck()
  responseEl.textContent = JSON.stringify(result, null, 2)
})

document.querySelector('#fetchDataBtn')?.addEventListener('click', async () => {
  responseEl.textContent = 'Loading...'
  const result = await fetchChaosData()
  responseEl.textContent = JSON.stringify(result, null, 2)
})

document.querySelector('#testChaosBtn')?.addEventListener('click', async () => {
  responseEl.textContent = 'Loading...'
  const result = await testChaos({ test_type: 'manual', intensity: 'low' })
  responseEl.textContent = JSON.stringify(result, null, 2)
})
