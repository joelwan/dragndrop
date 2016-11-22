import { fetch } from './ajax';
import { GalleryTile } from './gallery_tile'

require('../sass/gallery.scss');

class Gallery {
  
  constructor(domId, uri, callback) {
    fetch(uri)
      .catch(function(error) { throw new AJAXError(error); })
      .then(JSON.parse)
      .catch(function(error) { throw new JSONError(error); })
      .then((r) => { 
        this.images = r.gallery.images;
        this.render(); 
      })
      .catch(function(error) { throw new ApplicationError(error); });
    
    this.domId = domId;
    this.tiles = [];
    this.numTilesLoaded = 0;
    this.callback = callback;
    this.isReady = false;
    this.pointsX = [];
    this.pointsY = [];
    this.tileGrid = [];
    this.snapGrid = [];
  }
  
  render() {
    let html = document.createElement('div');
    document.getElementById(this.domId).appendChild(html);    
    var i = 0;
    for (var image of this.images) {
      let tile = new GalleryTile(i, image.imageURL, this, this.onTileLoadComplete.bind(this));
      this.tiles.push(tile);
      html.appendChild(tile.render());
      i++;
    }
    
  }
  
  onTileLoadComplete() {
    this.numTilesLoaded++;
    if (this.numTilesLoaded == this.tiles.length) {
      this.isReady = true;
      this.captureGridData();
      this.callback();
    }
  }
  
  isReady() {
    return this.isReady;
  }
  
  captureGridData() {
    this.tileGrid = [];
    this.snapGrid = [];
    this.pointsX = [];
    this.pointsY = [];
    
    let index = 0;
    var row = [];
    var snapRow = [];
    for (var tile of this.tiles){
      if (index > 0 && tile.x == this.tiles[0].x) {
        this.tileGrid.push(row);
        this.snapGrid.push(snapRow);
        row = [];
        snapRow = [];
      }
      tile.rowIndex = this.tileGrid.length;
      tile.colIndex = row.length;
      row.push(tile);
      snapRow.push({'row':tile.rowIndex, 'col':tile.colIndex, 'x1':tile.x, 'x2':tile.x+tile.height, 'y1':tile.y, 'y2':tile.y+tile.height});
      if (index == this.tiles.length-1) {
        this.tileGrid.push(row);
        this.snapGrid.push(snapRow);
      }
      this.pointsX.push(tile.x);
      this.pointsY.push(tile.y);
      document.getElementById(tile.id).style.position = "absolute";
      document.getElementById(tile.id).style.left = tile.x + 'px';
      document.getElementById(tile.id).style.top = tile.y + 'px';
      document.getElementById(tile.id).setAttribute('data-row-index', tile.rowIndex);
      document.getElementById(tile.id).setAttribute('data-col-index', tile.colIndex);
      index++;
    }
  }
  
  totalRows() {
    return this.tileGrid.length;
  }
  
  totalCols() {
    return this.tileGrid[0].length;
  }
  
  getSnapPointsX() {
    return this.pointsX;
  }
  
  getSnapPointsY() {
    return this.pointsY;
  }
  
  reDraw(a, b) {
    var index = 0;
    var movedTileIndex = -1;
    var destinationTileIndex = -1;
    for (var tile of this.tiles){
      if (tile.redrawing) {
        movedTileIndex = index;
        destinationTileIndex = a*this.totalCols() + b;
        
        if (destinationTileIndex > index) {
          this.tiles.splice(destinationTileIndex+1, 0, tile);
          this.tiles.splice(index, 1);
        } else {
          this.tiles.splice(destinationTileIndex, 0, tile);
          this.tiles.splice(index+1, 1);
        }
        
        tile.redrawing = false;
        
        break;
      }
      index++;
    }
    
    var index = 0;
    for (var tile of this.tiles){
      tile.x = this.pointsX[index];
      tile.y = this.pointsY[index];
      index++;
    }
    
    this.captureGridData();
  }
  
}

export { Gallery };