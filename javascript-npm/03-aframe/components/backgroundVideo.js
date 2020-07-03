
AFRAME.registerComponent('backgroundvideo', {
    schema: {
        src: {},
    },
    init: function() {
        const sceneEl = document.querySelector('a-scene');
        const video = sceneEl.querySelector(this.data.src);
        
        const texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        sceneEl.object3D.background = texture;
    }
});