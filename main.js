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
    const geometry = new THREE.PlaneGeometry(0.8, 0.8);
    const themeColors = [0xff9a9e, 0x93affc]; // Colors from your navbar gradient
    const randomColor = themeColors[Math.floor(Math.random() * themeColors.length)];
    const material = new THREE.MeshBasicMaterial({
        color: randomColor,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.1 // Random opacity between 0.1 and 0.6
    });
    const square = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(15));

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

        // Bounce off the "walls"
        if (square.position.x > 8 || square.position.x < -8) square.userData.velocity.x *= -1;
        if (square.position.y > 8 || square.position.y < -8) square.userData.velocity.y *= -1;
        if (square.position.z > 4 || square.position.z < -15) square.userData.velocity.z *= -1;
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