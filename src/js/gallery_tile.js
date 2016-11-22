require('../sass/gallery_tile.scss');

import { Events } from './events'

class GalleryTile {
    
  constructor(id, imageURL, grid, callback) {
    this.imageURL = imageURL;
    this.id = 'tile-' + id;
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.grid = grid;
    this.callback = callback;
    this.redrawing = false;
    this.colIndex = 0;
    this.rowIndex = 0;
  }
  
  capture(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  listen(){
    this.events = {
      mousedown: Events.mousedown.bind(this, this.intersectionCallback.bind(this)),
      mouseup: Events.mouseup.bind(this),
    };
    this.el.addEventListener('mousedown', this.events.mousedown, false);
  }
  
  render() {
    this.el = document.createElement('div');
    this.el.setAttribute('id', this.id);
    let img = new Image();
    
    img.addEventListener('load', function() {
      this.capture(img.parentNode.offsetLeft, img.parentNode.offsetTop, img.parentNode.clientWidth, img.parentNode.clientHeight);    
      this.listen();
      this.callback();
    }.bind(this));
    
    img.setAttribute('src', this.imageURL);
    
    this.el.appendChild(img);

    
    this.el.className = 'tile';
    
    return this.el;
  }
  
  intersectionCallback(row, col) {
    
    this.redrawing = true;
    this.x = this.grid.pointsX[row];
    this.y = this.grid.pointsY[col];
    this.grid.reDraw(row, col);
  }
}

export { GalleryTile };