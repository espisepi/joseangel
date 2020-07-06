

AFRAME.registerComponent('cubemap', {
    schema: {
        src: {},
    },
    init: function() {

        let texture_posx = new THREE.TextureLoader().load("../assets/textures/Park2/posx.jpg");
        let texture_negx = new THREE.TextureLoader().load("../assets/textures/Park2/negx.jpg");
        let texture_posy = new THREE.TextureLoader().load("../assets/textures/Park2/posy.jpg");
        let texture_negy = new THREE.TextureLoader().load("../assets/textures/Park2/negy.jpg");
        let texture_posz = new THREE.TextureLoader().load("../assets/textures/Park2/posz.jpg");
        let texture_negz = new THREE.TextureLoader().load("../assets/textures/Park2/negz.jpg");

        let materialArray = [];
        materialArray.push(new THREE.MeshBasicMaterial({map: texture_posx}));
        materialArray.push(new THREE.MeshBasicMaterial({map: texture_negx}));
        materialArray.push(new THREE.MeshBasicMaterial({map: texture_posy}));
        materialArray.push(new THREE.MeshBasicMaterial({map: texture_negy}));
        materialArray.push(new THREE.MeshBasicMaterial({map: texture_posz}));
        materialArray.push(new THREE.MeshBasicMaterial({map: texture_negz}));

        for(let i=0; i<6; i++){
            materialArray[i].side = THREE.BackSide;
        }

        let cubeGeometry = new THREE.BoxBufferGeometry(100,100,100);
        let cube = new THREE.Mesh(cubeGeometry, materialArray);

        this.el.setObject3D('mesh', cube);
        

    }
});