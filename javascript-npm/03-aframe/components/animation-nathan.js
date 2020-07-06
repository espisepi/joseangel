

AFRAME.registerComponent('animation-nathan', {
    schema: {
    },

    init: function(){
        console.log('entra en animation-nathan');
        const self = this;
        const el = this.el;

        // console.log(this.el.components["animation-mixer"]);
        console.log(this.el.getAttribute('animation-mixer'));
        const durationAnimation = 3;
        this.el.setAttribute('animation-mixer', {loop:'infinite', duration:durationAnimation, timeScale: 1});
        
        // Caja morada de ayuda
        this.boxEl = document.createElement('a-box');
        this.boxEl.object3D.position.y += -0.4;
        this.boxEl.setAttribute('material',{color:'#F000F0'})
        //this.el.appendChild(this.boxEl);

        let stopAnimation = false;
        let input = {vertical: 0, horizontal: 0};
        this.input = input;

        const direction = new THREE.Vector3();
        this.el.addEventListener('animation-loop', function(){
            el.object3D.getWorldDirection(direction);
            el.object3D.position.addScaledVector(direction, 3.0);
            // if(stopAnimation){
            //     el.setAttribute('animation-mixer', {timeScale: 0});
            // }else{
            //     console.log(self.input);

            //     // Calculamos la rotacion segun los valores del input
                

            // }
        });

        document.addEventListener('keydown', function (evt) {
            // if(evt.key === "a"){
            //     input.horizontal = -1;
            //     el.object3D.rotation.y = -Math.PI / 2;
            //     stopAnimation = false;
            //     el.setAttribute('animation-mixer', {timeScale: 1});
            // }
            // if(evt.key === "w"){
            //     input.vertical = 1;
            //     el.object3D.rotation.y = 0;
            //     stopAnimation = false;
            //     el.setAttribute('animation-mixer', {timeScale: 1});
            // }
            // if(evt.key === "s"){
            //     input.vertical = -1;
            //     el.object3D.rotation.y = Math.PI;
            //     stopAnimation = false;
            //     el.setAttribute('animation-mixer', {timeScale: 1});
            // }
            // if(evt.key === "d"){
            //     input.horizontal = 1;
            //     el.object3D.rotation.y = Math.PI / 2;
            //     stopAnimation = false;
            //     el.setAttribute('animation-mixer', {timeScale: 1});
            // }
          });
        document.addEventListener('keyup', function (evt) {
            // stopAnimation = true;

            // if(evt.key === "a"){
            //     input.horizontal = 0;
            // }
            // if(evt.key === "w"){
            //     input.vertical = 0;
            // }
            // if(evt.key === "s"){
            //     input.vertical = 0;
            // }
            // if(evt.key === "d"){
            //     input.horizontal = 0;
            // }
        });

        
    },

    tick: function(delta,deltatime) {
        
    }

});









//this.el.setAttribute('animation-mixer', {loop:'infinite'});
//loop:'once'