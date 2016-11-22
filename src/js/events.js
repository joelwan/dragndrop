import { Utils } from './utils'

class Events {
  
  static mousedown(callback, e){
    
    const el = document.getElementById(this.id);
    
    el.className += " moving";
    
    let wOff = e.clientX - el.offsetLeft;
    let hOff = e.clientY - el.offsetTop;
    
    this.events.mousemove = Events.mousemove.bind(this, wOff, hOff, callback);
    
    document.addEventListener('mousemove', this.events.mousemove, false);
    document.addEventListener('mouseup', this.events.mouseup, false);

    e.preventDefault();
    return false;
  };

  static mousemove(offsetW, offsetH, callback, e){
    
    const el = document.getElementById(this.id);
    
    let x = e.clientX - offsetW;
    let y = e.clientY - offsetH;
    
    let cx = x+(el.offsetWidth/2);
    let cy = y+(el.offsetHeight/2);
        
    let ri = this.rowIndex;
    let ci = this.colIndex;
    
    let left = Math.max(0,ci-1);
    let right = Math.min(ci+1, this.grid.totalCols()-1);
    let top = Math.max(0, ri-1);
    let bottom = Math.min(ri+1, this.grid.totalRows()-1);
    
    
    let neighbours = [];
    
    for (var i=top; i<=bottom; i++) {
      for (var j=left; j<= right; j++) {
        if (!(this.rowIndex == i && this.colIndex == j)) {
          neighbours.push(this.grid.snapGrid[i][j]);
        }
      }
    }
    
    if (!this.redrawing) {
      Utils.move(el, x, y); 
      Events.checkIntersection(cx, cy, neighbours, callback);
    }
  };

  static mouseup(e){
    const el = document.getElementById(this.id);
    el.className = el.className.replace(' moving', '');
    
    //snap item back to grid
    Utils.move(el, this.x, this.y);

    document.removeEventListener('mouseup', this.events.mouseup, false);
    document.removeEventListener('mousemove', this.events.mousemove, false);
  };
  
  static checkIntersection(x, y, neighbours, callback){
    
    for (var neighbour of neighbours) {
      
      var l = x > neighbour.x1;
      var r = x < neighbour.x2;
      var t = y > neighbour.y1;
      var b = y < neighbour.y2;
      
      //intersected 
      if (l && r && t && b) {
        callback(neighbour.row, neighbour.col);
      }
    }
  }
  
}

export { Events };