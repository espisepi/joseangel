import {Water} from '../../node_modules/three/examples/jsm/objects/Water.js';

AFRAME.registerComponent('water', {
    schema: {
    },
  
    /**
     * Initial creation and setting of the mesh.
     */
    init: function () {
      console.log('utilizando componente water');
      var data = this.data;
      var el = this.el;
  
    //   // Create geometry.
    //   this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
  
    //   // Create material.
    //   this.material = new THREE.MeshStandardMaterial({color: data.color});
  
    //   // Create mesh.
    //   this.mesh = new THREE.Mesh(this.geometry, this.material);

      // --------------- WATER -------------

        const waterGeometry = new THREE.BoxBufferGeometry( 10, 10, 10 );

        //const waterGeometry = new THREE.PlaneBufferGeometry( 100, 100 );
        const water = new Water(
            waterGeometry,
            {
                side: THREE.DoubleSide,
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( '../assets/textures/waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                alpha: 1.0,
                sunDirection: new THREE.Vector3(0 ,0.5, 0),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                //fog: scene.fog !== undefined
            }
        );
        water.position.set(0, 6, 0);
  
      // Set mesh on entity. this.mesh
      //el.setObject3D('mesh', water);
      this.water = water;
      el.object3D.add(water);
    },

    tick: function(time, deltaTime) {
      this.water.material.uniforms[ 'time' ].value += (1.0 / 60.0) * 0.1;
    }
  });