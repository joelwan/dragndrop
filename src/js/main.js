import { Gallery } from './gallery'
import { Utils } from './utils'

require('../sass/main.scss');

let g = new Gallery('gallery', '/api/gallery.json', function(){
  console.log('grid loaded successfully');
});

window.g = g;