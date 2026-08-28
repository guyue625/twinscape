import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
} from 'three'
import { createTwinViewer, type TwinPart } from '@twinscape/core'
import './styles.css'

const stage = document.querySelector<HTMLElement>('#stage')!
const labels = document.querySelector<HTMLElement>('#labels')!
const status = document.querySelector<HTMLElement>('#status')!
const count = document.querySelector<HTMLElement>('#part-count')!
const selected = document.querySelector<HTMLElement>('#selected-name')!
const form = document.querySelector<HTMLFormElement>('#model-form')!
const urlInput = document.querySelector<HTMLInputElement>('#model-url')!

const viewer = createTwinViewer(stage, {
  camera: { position: [5.5, 3.8, 7] },
  renderer: { clearColor: '#d9dfd8' },
  model: { targetSize: 4.6 },
  highlight: { color: '#ff4f19', dimOpacity: 0.22 },
})

function renderLabels(parts: TwinPart[]): void {
  count.textContent = String(parts.length).padStart(2, '0')
  const known = new Map([...labels.children].map((node) => [(node as HTMLElement).dataset.id, node as HTMLElement]))
  for (const part of parts) {
    let label = known.get(part.id)
    if (!label) {
      label = document.createElement('button')
      label.type = 'button'
      label.className = 'part-label'
      label.dataset.id = part.id
      label.addEventListener('click', () => viewer.select(part.id))
      labels.appendChild(label)
    }
    label.textContent = part.name
    label.style.transform = `translate(${part.label.x}px, ${part.label.y}px)`
    label.hidden = !part.label.visible
    label.classList.toggle('active', viewer.getSelectedId() === part.id)
    known.delete(part.id)
  }
  known.forEach((label) => label.remove())
}

viewer.on('parts:update', renderLabels)
viewer.on('select', (part) => {
  selected.textContent = part?.name.toUpperCase() ?? '—'
  renderLabels(viewer.getParts())
})
viewer.on('load:start', () => { status.textContent = 'LOADING' })
viewer.on('load:progress', ({ progress }) => {
  status.textContent = progress ? `${Math.round(progress * 100)}%` : 'LOADING'
})
viewer.on('load:end', () => { status.textContent = 'READY' })
viewer.on('load:error', ({ error }) => {
  if (!(error instanceof Error && error.name === 'AbortError')) status.textContent = 'ERROR'
})

function createFallbackModel(): Group {
  const root = new Group()
  const graphite = new MeshStandardMaterial({ color: '#263633', roughness: 0.58, metalness: 0.45 })
  const steel = new MeshStandardMaterial({ color: '#9ba9a2', roughness: 0.34, metalness: 0.68 })
  const orange = new MeshStandardMaterial({ color: '#d94b1b', roughness: 0.52, metalness: 0.25 })

  const pump = new Mesh(new CylinderGeometry(0.75, 0.9, 1.9, 32), graphite)
  pump.name = 'Pump body'
  pump.rotation.z = Math.PI / 2
  root.add(pump)

  const motor = new Mesh(new CylinderGeometry(0.62, 0.62, 1.6, 32), steel)
  motor.name = 'Drive motor'
  motor.rotation.z = Math.PI / 2
  motor.position.x = -1.65
  root.add(motor)

  const valve = new Mesh(new TorusGeometry(0.42, 0.08, 12, 32), orange)
  valve.name = 'Control valve'
  valve.rotation.x = Math.PI / 2
  valve.position.set(0.45, 1.12, 0)
  root.add(valve)

  const base = new Mesh(new BoxGeometry(4.2, 0.22, 1.65), graphite.clone())
  base.name = 'Mounting skid'
  base.position.y = -1.02
  root.add(base)
  return root
}

viewer.setModel(createFallbackModel())
viewer.focusOn(viewer.getParts()[0]?.id ?? '')
viewer.resetCamera()

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const url = urlInput.value.trim()
  if (!url) {
    viewer.setModel(createFallbackModel())
    status.textContent = 'FALLBACK'
    return
  }
  try {
    await viewer.load(url)
  } catch (error) {
    console.error(error)
  }
})

document.querySelector('#reset-view')?.addEventListener('click', () => viewer.resetCamera())
window.addEventListener('beforeunload', () => viewer.dispose())
