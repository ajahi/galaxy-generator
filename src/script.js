import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters={}
parameters.size=0.02
parameters.count=1000
parameters.branches=3
parameters.radius=5
parameters.spin=1
parameters.randomness=0.1
parameters.randomnessPower = 3

let geometry = null
let material = null
let particles = null

const generateGalaxy=()=>{
    //remove old galaxy
    if(particles!==null){
        geometry.dispose()
        material.dispose()
        scene.remove(particles)
    }
    
    
     geometry=new THREE.BufferGeometry()//geometry

     const positions=new Float32Array(parameters.count*3)//position array

    for(let i=0;i<parameters.count;i++){
        const i3=i*3

        const radius=Math.random() * parameters.radius
        const spinAngle=radius * parameters.spin
        const branchAngle=((i % parameters.branches)/parameters.branches)*2 *Math.PI
        
        const randomX=Math.pow(Math.random(),parameters.randomnessPower) *(Math.random() < 0.5 ? 1 : -1) *parameters.randomness*radius
        const randomY=Math.pow(Math.random(),parameters.randomnessPower) *(Math.random() < 0.5 ? 1 : -1) *parameters.randomness*radius
        const randomZ=Math.pow(Math.random(),parameters.randomnessPower) *(Math.random() < 0.5 ? 1 : -1) *parameters.randomness*radius


        positions[i3]=Math.cos(branchAngle + spinAngle)*radius + randomX//x coordinates
        positions[i3+1]=randomY
        positions[i3+2]=Math.sin(branchAngle + spinAngle)*radius +randomZ
        if(i<20){
            console.log(i,randomX,randomY,randomZ)
        }
    }
    //material and its attributes
     material=new THREE.PointsMaterial({
        size:parameters.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending
    })
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions,3)
    )
    particles=new THREE.Points(geometry,material)
    scene.add(particles)
    
}

gui.add(parameters,'count').min(100).max(10000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.02).max(0.2).step(0.02).onFinishChange(generateGalaxy)
gui.add(parameters,'branches').min(3).max(6).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0.1).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomnessPower').min(0.1).max(5).step(0.01).onFinishChange(generateGalaxy)


generateGalaxy()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()