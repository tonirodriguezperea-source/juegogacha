const DB = [
    { id: 1, nombre: "Bulbasaur", emoji: "🍃", saga: "Pokémon", tipo: "planta", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { id: 4, nombre: "Charmander", emoji: "🔥", saga: "Pokémon", tipo: "fuego", rareza: "comun", sprite:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { id: 7, nombre: "Squirtle", emoji: "💧", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { id: 101, nombre: "Goku", emoji: "👊", saga: "Dragon Ball", tipo: "fuego", rareza: "legendario", sprite:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFtTJKDlzYwwj82LmQVz4yqLcDS0N5Aq5vng&s" },
    { id: 102, nombre: "Vegeta", emoji: "👑", saga: "Dragon Ball", tipo: "agua", rareza: "epico", sprite:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdTUB-MGqR2sgm--j2QFzFX3GpJkKGmArPoQ&s" },
    { id: 103, nombre: "Gohan", emoji: "🧒", saga: "Dragon Ball", tipo: "planta", rareza: "raro" }
];

const RAREZAS = { 
    comun: '#94a3b8', raro: '#4ade80', epico: '#a855f7', legendario: '#f59e0b' 
};

const TABLA_TIPOS = { 
    fuego: { ventaja: 'planta', color: '#f87171' },
    planta: { ventaja: 'agua', color: '#4ade80' },
    agua: { ventaja: 'fuego', color: '#60a5fa' }
};