// Viz Setup -----------------------------------------------------------

// Variables
var allowCustomUpload = true;  // Set this to false to disable custom upload option
var animationFrameId;  // variable to hold the ID of the animation frame

var demos = {
  1: { pano: 'PHOTO 6_post.jpg', audio: 'HOA3_LOWTHERN3D44.wav' },
  2: { pano: 'L2 PHOTO 11.jpg', audio: 'HOA3_LOWTHERN3D44.wav' },
  3: { pano: 'L4 PHOTO 19.jpg', audio: 'HOA3_rec1.ogg' },
  4: { pano: 'L5H PHOTO 27.jpg', audio: 'HOA3_rec1.ogg' },
  5: { pano: 'L7 PHOTO 37.jpg', audio: 'HOA3_rec1.ogg' }
};

// Elements
var container = document.getElementById('container');
var panoFileInput = document.getElementById('pano-file');
var audioFileInput = document.getElementById('audio-file');
var runButton = document.getElementById('run-button');
var customUploadContainer = document.getElementById('custom-upload-container');
var customUploadToggle = document.getElementById('custom-upload-toggle');
var demoSelector = document.getElementById('demo-selector');
var playButton = document.getElementById('play-button');
var stopButton = document.getElementById('stop-button');
// Element
var gainControl = document.getElementById('gain-control');


// Setup custom upload visibility
if (!allowCustomUpload) {
  customUploadToggle.style.display = 'none';
  customUploadContainer.style.display = 'none';
}

// Custom upload toggle click event
customUploadToggle.addEventListener('click', function() {
  customUploadContainer.classList.toggle('visible');
  customUploadToggle.textContent = customUploadContainer.classList.contains('visible') ? 'Custom upload ◀' : 'Custom upload ▶';
});

// THREE.js basics
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = Math.PI / 2; // restrict angle to be horizontal
controls.maxPolarAngle = Math.PI / 2; // restrict angle to be horizontal

// Sphere to carry Panoramic Image Texture
var geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1); // Invert the geometry on the x-axis so that all of the faces point inward

container.appendChild(renderer.domElement);

// Event handlers
panoFileInput.addEventListener('change', e => {
  console.log('panoFileInput change event triggered');  // Add this line
  var reader = new FileReader();
  reader.onload = function(event) {
    var texture = new THREE.TextureLoader().load(event.target.result);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };
  reader.readAsDataURL(e.target.files[0]);
});


window.addEventListener('resize', () => {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
});

// Initial size setup
camera.aspect = container.offsetWidth / container.offsetHeight;
camera.updateProjectionMatrix();
renderer.setSize(container.offsetWidth, container.offsetHeight);


// Audio SETUP -------------------------------------------------

let audioContext;
var ambisonicOrder = 3;
var HOA3soundSource, soundOut;

// Create or resume AudioContext on user interaction
window.addEventListener('click', function() {
  if (!audioContext) {
      audioContext = new AudioContext();
      initialiseAudio();
  } else if (audioContext.state === 'suspended') {
      audioContext.resume();
  }
});

var context;// = new AudioContext(); // Create and Initialize the Audio Context
var rotator;// = new ambisonics.sceneRotator(context, Order); // Define HOA rotator
var binDecoder;// = new ambisonics.binDecoder(context, Order);
var gainOut;// = context.createGain(); // Output gain
var converter;

function initialiseAudio()
{
  // Create ambisonic binaural decoder,rotator and gain nodes
  rotator = new ambisonics.sceneRotator(audioContext, ambisonicOrder); // Define HOA rotator
  binDecoder = new ambisonics.binDecoder(audioContext, ambisonicOrder);
  gainOut = audioContext.createGain(); // Output gain

  // Load decoding filters
  let irUrl = "aalto2016_N3.wav";// "HOA3_IRC_1008_virtual.wav";
  let loader_filters = new ambisonics.HOAloader(audioContext, ambisonicOrder, irUrl, function(buffer) {
      binDecoder.updateFilters(buffer);
  });
  loader_filters.load();

  // Connect audio nodes
  // encoder.out.connect(binDecoder.in); // Commented out as it's not used in this case
  //binDecoder.out.connect(audioContext.destination);

  // connect HOA blocks
  rotator.out.connect(binDecoder.in);
  binDecoder.out.connect(audioContext.destination);
  //gainOut.connect(audioContext.destination);

}

// load samples and assign to buffers
var callbackOnLoad = function(buffer) {

  HOA3soundSource = audioContext.createBufferSource();
  HOA3soundSource.buffer = buffer;

} 

function loadPano(panoUrl) {
  var loader = new THREE.TextureLoader();
  loader.load(
    panoUrl,
    function(texture) {
      var material = new THREE.MeshBasicMaterial({ map: texture });
      var mesh = new THREE.Mesh(geometry, material);
      // Remove the old mesh from the scene
      scene.remove(scene.children[0]);
      // Add the new mesh to the scene
      scene.add(mesh);
    },
    undefined,
    function(err) {
      console.error('An error occurred while loading the texture');
    }
  );
}


function loadAudio(soundUrl)
{
  var loader_sound = new ambisonics.HOAloader(audioContext, ambisonicOrder, soundUrl, callbackOnLoad);
  loader_sound.load();
}

function getBaseFileName(splitFileName) {
  // Regular expression to match the format HOA{order}_{baseFileName}_{channels}.wav or .ogg
  var regex = /(HOA\d_.*)(_\d{2}-\d{2}ch\.(wav|ogg))/;
  
  // Extract the baseFileName from the splitFileName
  var match = splitFileName.match(regex);
  
  // If the regex matches the format, return the baseFileName
  if (match && match[1] && match[3]) {
    return match[1] + '.' + match[3];
  }
  
  // If the format does not match, return null
  return null;
}

// Function to load panoramic image for a given demo
function loadPanoForDemo(demoNumber) {
  var demo = demos[String(demoNumber)];  // Convert demoNumber to a string
  if (demo) {
    loadPano(demo.pano);
  }
}

// Event handler
gainControl.addEventListener('input', function() {
  gainOut.gain.value = gainControl.value;
});

// Play button click event
playButton.addEventListener('click', function() {
  var demoNumber = demoSelector.value;

  // Load the audio for the currently selected demo and start playing
  loadPanoForDemo(demoNumber);
  loadAudioForDemo(demoNumber);

  // Start Sourcee and Connect to Start of Signal Chain.

  console.log(HOA3soundSource);
  HOA3soundSource.loop = true;
  HOA3soundSource.connect(rotator.in);
  HOA3soundSource.start(0);
  HOA3soundSource.isPlaying = true;
  console.log(HOA3soundSource.channelCount);

  // Run the View
  camera.position.set(0, 0, 0);
  controls.target.set(1, 0, 0);

   // Start the animation
  animate();
});


// Function to load audio for a given demo
function loadAudioForDemo(demoNumber) {
  var demo = demos[String(demoNumber)];  // Convert demoNumber to a string
  if (demo) {
    loadAudio(demo.audio);
  }
}



function animate() {
  animationFrameId = requestAnimationFrame(animate);
  rotator.yaw = controls.getAzimuthalAngle() * (180 / Math.PI);  // update rotator with azimuthal angle from OrbitControls
  console.log(rotator.yaw);
  rotator.updateRotMtx();
  controls.update();
  renderer.render(scene, camera);
}

// Stop button click event
stopButton.addEventListener('click', function() {
  // Stop the audio
  if (HOA3soundSource) {
    HOA3soundSource.stop(0);
    HOA3soundSource = null;
  }

  // Clear the scene
  while (scene.children.length > 0) { 
    scene.remove(scene.children[0]); 
  }

  // Stop the animation
  cancelAnimationFrame(animationFrameId);
});


