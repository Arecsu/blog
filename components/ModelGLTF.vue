<script setup lang="ts">
import { Scene, PerspectiveCamera, OrthographicCamera, Mesh, SphereGeometry, BoxGeometry, MeshBasicMaterial, WebGLRenderer, AmbientLight, DirectionalLight, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useWindowSize, useMouse } from '@vueuse/core'

const { x: mouseX, y: mouseY, sourceType } = useMouse()
let renderer: WebGLRenderer
const experience: Ref<HTMLCanvasElement | null> = ref(null)
const { width, height } = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)
const scene = new Scene()
const camera = new PerspectiveCamera(75, aspectRatio.value, 0.1, 1000)
const loader = new GLTFLoader()
let model: any = null
loader.load('/DamagedHelmet.glb', (gltf) => {
   model = gltf.scene
   model.position.set(0, 0, 0)
   scene.add(model)
}, undefined, (error) => {
   console.error(error)
})



// const camera = new OrthographicCamera(-2, 2, 2, -2, 0.1, 1000)
camera.position.set(0, 0, 4)
scene.add(camera)
const sphere = new Mesh(new SphereGeometry(1, 32, 32), new MeshBasicMaterial({ color: 0x803080 }))
// scene.add(sphere)
// cube geometry with visible wireframes
const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x803080, wireframe: true }))
// const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x803080 }))

// Add lights
const ambientLight = new AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 1, 0)
scene.add(directionalLight)

// scene.add(cube)
function updateCamera() {
   camera.aspect = aspectRatio.value
   camera.updateProjectionMatrix()
}
function updateRenderer() {
   renderer.setSize(width.value, height.value)
   renderer.render(scene, camera)
}
function setRenderer() {
   if (experience.value) {
      renderer = new WebGLRenderer({ canvas: experience.value, alpha: true, antialias: true })
      updateRenderer()
   }
}

function rotateModelOnClick(event: MouseEvent) {
   if (model) {
      const { x, y } = { x: mouseX.value / width.value, y: mouseY.value / height.value }
      const deltaX = x - 0.5
      const deltaY = y - 0.5
      const angleX = deltaX * Math.PI
      const angleY = deltaY * Math.PI
      model.rotation.setFromVector3(new Vector3(-angleY, angleX, 0))
   }
}


watch(aspectRatio, () => {
   updateCamera()
   updateRenderer()
})
onMounted(() => {
   setRenderer()
   experience.value?.addEventListener('pointerdown', rotateModelOnClick)
   loop()
})

let reverseMultiplier = 1

const loop = () => {
   updateRenderer()
   requestAnimationFrame(loop)
}
</script>
<template>
   <div>
      <canvas ref="experience" />
   </div>
</template>