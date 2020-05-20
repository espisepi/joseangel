function inicializa() {


  var img = new Image();
  img.src = 'images/rhino.jpg';
  img.onload = function() {
    draw(this);
  };

  function draw(img) {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    img.style.display = 'none';
    
    // imageData para volver a la imagen original sin modificar los pixeles
    var imageDataOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // imageData que vamos a modificar sus pixeles
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
      
    // Metodos de los buttons
    var invert = function() {
      for (var i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    var grayscale = function() {
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    var restore = function() {
      ctx.putImageData(imageDataOriginal, 0, 0);
    }

    // Enlazar los metodos a los buttons
    var invertbtn = document.getElementById('invertbtn');
    invertbtn.addEventListener('click', invert);
    var grayscalebtn = document.getElementById('grayscalebtn');
    grayscalebtn.addEventListener('click', grayscale);
    var restorebtn = document.getElementById('restorebtn');
    restorebtn.addEventListener('click', restore);

  }













  // var canvas = document.getElementById('canvas');
  // var ctx = canvas.getContext('2d');
  // var imageData;

  // var img = new Image();
  // img.onload = function() {
  //   // for (var i = 0; i < 4; i++) {
  //   //   for (var j = 0; j < 3; j++) {
  //   //     ctx.drawImage(img, j * 50, i * 38, 50, 38);
  //   //   }
  //   // }
    
  //   ctx.drawImage(img, 0, 0);
  //   imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //   draw();
  // };
  // img.src = 'images/rhino.jpg';

  // function borrarCanvas() {
  // canvas.width = canvas.width;
  // canvas.height = canvas.height;
  // }

  // function draw() {
  //   if(imageData){
  //     modifyImageData();
  //   }
  //   requestAnimationFrame(draw);
  // }

  // function modifyImageData() {
  //   var data = imageData.data;
  //   data = imageData.data.map( (x) => { return 3; });
  //   console.log(imageData.data);
  // }

}

