const args = [
    [Blocks.water, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.water, Blocks.dacite, Blocks.dacite],
    [Blocks.dacite, Blocks.water, Blocks.water, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.water, Blocks.dacite, Blocks.dacite, Blocks.dacite],
    [Blocks.grass, Blocks.dacite, Blocks.grass, Blocks.water, Blocks.dacite, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.dacite, Blocks.water, Blocks.water, Blocks.dacite, Blocks.dacite],
    [Blocks.water, Blocks.water, Blocks.grass, Blocks.water, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.dacite, Blocks.water, Blocks.water, Blocks.dacite],  
    [Blocks.water, Blocks.water, Blocks.water, Blocks.dacite, Blocks.dacite, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.water, Blocks.dacite],  
    [Blocks.grass, Blocks.water, Blocks.water, Blocks.water, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.water, Blocks.dacite],  
    [Blocks.water, Blocks.water, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.grass, Blocks.water, Blocks.water],  
    [Blocks.water, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.water, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.grass, Blocks.dacite],  
    [Blocks.water, Blocks.water, Blocks.grass, Blocks.water, Blocks.water, Blocks.dacite, Blocks.water, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.dacite],
    [Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.water, Blocks.dacite, Blocks.water, Blocks.water, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.dacite], 
    [Blocks.water, Blocks.water, Blocks.grass, Blocks.dacite, Blocks.water, Blocks.water, Blocks.water, Blocks.water, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.dacite, Blocks.dacite], 
    [Blocks.water, Blocks.water, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.grass, Blocks.dacite, Blocks.water, Blocks.dacite, Blocks.water, Blocks.dacite, Blocks.water, Blocks.dacite],
    [Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dacite, Blocks.dacite, Blocks.dacite, Blocks.dacite, Blocks.dacite]
];

const scl = 5;
const seed = 1;
const waterOffset = 0.07;

const koriGenerator = extendContent(SerpuloPlanetGenerator, {
	
	getColor(position){
                var block = getBlock(position);
                //replace salt with sand color
                if(block == Blocks.salt) return Blocks.sand.mapColor;
                return Tmp.c1.set(block.mapColor);
        },
	
	genTile(position, tile){
		
		let value = Simplex.noise3d(1, 5, 2, 250, position.x, position.y, 0);
		
		
		if(value < 0.15){
			tile.floor = value < 0.02 ? Blocks.deepwater : Blocks.water;
		}else if(value < 0.3){
			tile.floor = Blocks.sand;
		}else if(value < 5){
			tile.floor = Blocks.grass;
		}else{
			tile.floor = Blocks.stone;
		}
		
                tile.block = tile.floor.asFloor().wall;

                /*if(Ridged.noise3d(1, position.x, position.y, position.z, 2, 22) > 0.31){
                        tile.block = Blocks.air;
                }*/
        },
	
	function rawHeight(position){
                position = Tmp.v33.set(position).scl(scl);
                return (Mathf.pow(Simplex.noise3d(seed, 7, 0.5, 1/3, position.x, position.y, position.z), 2.3) + waterOffset) / (1 + waterOffset);
        },
		
	function getBlock(position){
        var height = this.rawHeight(position);
        Tmp.v31.set(position);
        position = Tmp.v33.set(position).scl(scl);
        var rad = scl;
        var temp = Mathf.clamp(Math.abs(position.y * 2) / (rad));
        var tnoise = Simplex.noise3d(seed, 7, 0.56, 1/3, position.x, position.y + 999, position.z);
        temp = Mathf.lerp(temp, tnoise, 0.5);
        height *= 1.2;
        height = Mathf.clamp(height);

        var tar = Simplex.noise3d(seed, 4, 0.55, 1/2, position.x, position.y + 999, position.z) * 0.3 + Tmp.v31.dst(0, 0, 1) * 0.2;

        var res = a[Mathf.clamp(Mathf.floor(temp * a.length), 0, a[0].length - 1)][Mathf.clamp(Mathf.floor(height * a[0].length), 0, a[0].length - 1)];
        if(tar > 0.5){
            return this.tars.get(res, res);
        }else{
            return res;
        },
		

		
	
};
	
});

const kori = extend(Planet, "kori", Planets.sun, 3, 1, {});
kori.generator = newGen;
kori.meshLoader =  prov(() => new HexMesh(kori, 6));
kori.atmosphereColor = Color.valueOf("#aaaaaa");
kori.atmosphereRadIn = 0.003;
kori.atmosphereRadOut = 0.37;
kori.startSector = 11;

kori.alwaysUnlocked = true;