

AFRAME.registerComponent('animation-nathan', {
    schema: {
    },

    init: function(){
        console.log('entra en animation-nathan');
        const el = this.el;

        // console.log(this.el.components["animation-mixer"]);
        console.log(this.el.getAttribute('animation-mixer'));
        const durationAnimation = 3;
        this.el.setAttribute('animation-mixer', {loop:'infinite', duration:durationAnimation, timeScale: 0});
        
        // Caja morada de ayuda
        this.boxEl = document.createElement('a-box');
        this.boxEl.object3D.position.y += -0.4;
        this.boxEl.setAttribute('material',{color:'#F000F0'})
        this.el.appendChild(this.boxEl);

        const direction = new THREE.Vector3();
        this.el.addEventListener('animation-loop', function(){
            el.object3D.getWorldDirection(direction);
            el.object3D.position.addScaledVector(direction, 3.0);
        });

        //el.object3D.rotation.set(0,Math.PI / 2, 0);

        document.addEventListener('keydown', function (evt) {
            el.setAttribute('animation-mixer', {timeScale: 1});
          });
        document.addEventListener('keyup', function (evt) {
            el.setAttribute('animation-mixer', {timeScale: 0});
        });

        
    },

    tick: function(delta,deltatime) {
        
    }

});









//this.el.setAttribute('animation-mixer', {loop:'infinite'});
//loop:'once'