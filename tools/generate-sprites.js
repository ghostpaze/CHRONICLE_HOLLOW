const fs = require('fs');
const { PNG } = require('pngjs');

function hexToRgba(h){
  if(!h) return [0,0,0,0];
  if(h.startsWith('#')) h = h.slice(1);
  if(h.length===8){
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),parseInt(h.slice(6,8),16)];
  }
  if(h.length===6){
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),255];
  }
  if(h.length===4){
    return [parseInt(h[0]+h[0],16),parseInt(h[1]+h[1],16),parseInt(h[2]+h[2],16),parseInt(h[3]+h[3],16)];
  }
  return [0,0,0,0];
}

function write(grid, palette, scale, outPath){
  const size = grid.length * scale;
  const png = new PNG({width:size, height:size});
  for(let y=0;y<grid.length;y++){
    for(let x=0;x<grid[y].length;x++){
      const idx = grid[y][x];
      const color = palette[idx] || '#00000000';
      const rgba = hexToRgba(color.replace('0x','#').replace('0x','#'));
      for(let sy=0; sy<scale; sy++){
        for(let sx=0; sx<scale; sx++){
          const px = ( (y*scale+sy) * size + (x*scale+sx) ) << 2;
          png.data[px] = rgba[0];
          png.data[px+1] = rgba[1];
          png.data[px+2] = rgba[2];
          png.data[px+3] = rgba[3];
        }
      }
    }
  }

  fs.mkdirSync(require('path').dirname(outPath), {recursive:true});
  png.pack().pipe(fs.createWriteStream(outPath)).on('finish', ()=> console.log('Wrote', outPath));
}

// Ghost
const pGhost = ['#00000000','#ffffff','#000000','#66ffcc','#ff66ff'];
const gGhost = [
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1, 1, 1, 3, 1, 1, 3, 1, 1,-1,-1,-1,-1],
  [-1,-1,-1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1,-1,-1,-1],
  [-1,-1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1,-1,-1],
  [-1,-1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1,-1,-1],
  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
  [-1,-1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 4, 1, 1,-1,-1],
  [-1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1],
  [-1,-1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
];

// Bones
const pBones = ['#00000000','#ffffff','#000000','#ffff66','#66ffff'];
const gBones = [
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1, 1, 1, 1, 1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1, 1, 1, 1, 2, 2, 1, 1, 1,-1,-1,-1,-1],
  [-1,-1,-1, 1, 1, 1, 2, 3, 3, 2, 1, 1, 1,-1,-1,-1],
  [-1,-1, 1, 1, 1, 1, 2, 3, 3, 2, 1, 1, 1, 1,-1,-1],
  [-1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1,-1],
  [-1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1,-1],
  [-1, 1, 1, 1, 2, 2, 4, 1, 1, 4, 2, 2, 1, 1, 1,-1],
  [-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1],
  [-1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1],
  [-1,-1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
];

write(gGhost, pGhost, 8, 'src/assets/ghost.png');
write(gBones, pBones, 8, 'src/assets/bones.png');
