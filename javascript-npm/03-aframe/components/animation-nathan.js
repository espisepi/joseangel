

AFRAME.registerComponent('animation-nathan', {
    schema: {
    },

    init: function(){
        console.log('entra en animation-nathan');

        // console.log(this.el.components["animation-mixer"]);
        console.log(this.el.getAttribute('animation-mixer'));
        const durationAnimation = 3;
        this.el.setAttribute('animation-mixer', {loop:'infinite', duration:durationAnimation});
        
        // Caja morada de ayuda
        this.boxEl = document.createElement('a-box');
        this.boxEl.object3D.position.y += -0.4;
        this.boxEl.setAttribute('material',{color:'#F000F0'})
        this.el.appendChild(this.boxEl);

        let position = this.el.object3D.position;
        this.el.addEventListener('animation-loop', function(){
            position.z += durationAnimation;
        });
    },

});









//this.el.setAttribute('animation-mixer', {loop:'infinite'});
//loop:'once'