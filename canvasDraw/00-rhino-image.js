function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.onload = function() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        //ctx.drawImage(img, j * 50, i * 38, 50, 38);
      }
    }
    canvas.width = img.width;
    canvas.height = img.height;
    //ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.drawImage(img, 20, 0, 60, 60);
  };
  img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
}