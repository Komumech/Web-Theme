import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true, // for transparent background
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(5);

const squares = [];

function addSquare() {
    const geometry = new THREE.PlaneGeometry(0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({
        color: 0x93affc, // A color from your navbar gradient
        transparent: true,
        opacity: Math.random() * 0.5 + 0.1 // Random opacity between 0.1 and 0.6
    });
    const square = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(10));

    square.position.set(x, y, z);

    const [rx, ry, rz] = Array(3).fill().map(() => Math.random() * 0.01 - 0.005);
    square.userData.rotationSpeed = { x: rx, y: ry, z: rz };

    const [vx, vy, vz] = Array(3).fill().map(() => Math.random() * 0.005 - 0.0025);
    square.userData.velocity = new THREE.Vector3(vx, vy, vz);

    squares.push(square);
    scene.add(square);
}

Array(50).fill().forEach(addSquare);

function animate() {
    requestAnimationFrame(animate);

    squares.forEach(square => {
        square.rotation.x += square.userData.rotationSpeed.x;
        square.rotation.y += square.userData.rotationSpeed.y;

        square.position.add(square.userData.velocity);

        // Reset position if it goes too far
        if (square.position.x > 6 || square.position.x < -6) square.userData.velocity.x *= -1;
        if (square.position.y > 6 || square.position.y < -6) square.userData.velocity.y *= -1;
        if (square.position.z > 6 || square.position.z < -6) square.userData.velocity.z *= -1;
    });

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}