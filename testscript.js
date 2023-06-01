let audioContext;

// Create or resume AudioContext on user interaction
window.addEventListener('click', function() {
    if (!audioContext) {
        audioContext = new AudioContext();
        setupAudioNodes();
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});

function setupAudioNodes() {
    // Define the order of the ambisonic decoder
    let ambisonicOrder = 3;

    // Create ambisonic decoder and binaural decoder nodes
    let binDecoder = new ambisonics.binDecoder(audioContext, ambisonicOrder);

    // Load decoding filters
    let irUrl = "aalto2016_N3.wav";// "HOA3_IRC_1008_virtual.wav";
    let loader_filters = new ambisonics.HOAloader(audioContext, ambisonicOrder, irUrl, function(buffer) {
        binDecoder.updateFilters(buffer);
    });
    loader_filters.load();

    // Load sound source and set it to the decoder input
    let soundSourceUrl = "HOA3_LOWTHERN3D.wav";
    let loader_sound = new ambisonics.HOAloader(audioContext, ambisonicOrder, soundSourceUrl, function(buffer) {
        let soundSource = audioContext.createBufferSource();
        soundSource.buffer = buffer;
        soundSource.loop = true;
        soundSource.start(0);
        soundSource.connect(binDecoder.in);
    });
    loader_sound.load();

    // Connect audio nodes
    // encoder.out.connect(binDecoder.in); // Commented out as it's not used in this case
    binDecoder.out.connect(audioContext.destination);
}




/* let audioContext;

// Create or resume AudioContext on user interaction
window.addEventListener('click', function() {
    if (!audioContext) {
        audioContext = new AudioContext();
        setupAudioNodes();
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});

function setupAudioNodes() {
    // Define the order of the ambisonic decoder
    let ambisonicOrder = 3;

    // Create ambisonic encoder, decoder and binaural decoder nodes
    let encoder = new ambisonics.monoEncoder(audioContext, ambisonicOrder);
    let binDecoder = new ambisonics.binDecoder(audioContext, ambisonicOrder);

    // Load decoding filters
    let irUrl = "HOA3_IRC_1008_virtual.wav";
    let loader_filters = new ambisonics.HOAloader(audioContext, ambisonicOrder, irUrl, function(buffer) {
        binDecoder.updateFilters(buffer);
    });
    loader_filters.load();

    // Connect audio nodes
    encoder.out.connect(binDecoder.in);
    binDecoder.out.connect(audioContext.destination);

    // Load sound source and set it to the encoder input
    let soundSourceUrl = "examples_sounds_sample2.wav";
    let audioElement = new Audio(soundSourceUrl);
    let sourceNode = audioContext.createMediaElementSource(audioElement);
    sourceNode.connect(encoder.in);

    // Start audio
    audioElement.loop = true;
    audioElement.play();

    // Function to update source position
    function updateSourcePosition() {
        let azimuth = document.getElementById("azimuth").value;
        let elevation = document.getElementById("elevation").value;
        encoder.azim = azimuth;
        encoder.elev = elevation;
        encoder.updateGains();
    }

    // Update source position when sliders are moved
    document.getElementById("azimuth").addEventListener("input", updateSourcePosition);
    document.getElementById("elevation").addEventListener("input", updateSourcePosition);
}
 */