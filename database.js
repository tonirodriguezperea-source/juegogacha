const DB = [
    // --- LÍNEA BULBASAUR ---
    { id: 1, nombre: "Bulbasaur", emoji: "🍃", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { id: 2, nombre: "Ivysaur", emoji: "🌿", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" },
    { id: 3, nombre: "Venusaur", emoji: "🌳", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
    
    // --- LÍNEA CHARMANDER ---
    { id: 4, nombre: "Charmander", emoji: "🔥", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { id: 5, nombre: "Charmeleon", emoji: "☄️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png" },
    { id: 6, nombre: "Charizard", emoji: "🐲", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
    
    // --- LÍNEA SQUIRTLE ---
    { id: 7, nombre: "Squirtle", emoji: "💧", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { id: 8, nombre: "Wartortle", emoji: "🌊", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png" },
    { id: 9, nombre: "Blastoise", emoji: "🔫", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
    
    // --- BICHOS INICIALES ---
    { id: 10, nombre: "Caterpie", emoji: "🐛", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png" },
    { id: 11, nombre: "Metapod", emoji: "🔍", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png" },
    { id: 12, nombre: "Butterfree", emoji: "🦋", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png" },
    { id: 13, nombre: "Weedle", emoji: "🐝", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png" },
    { id: 14, nombre: "Kakuna", emoji: "🛡️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png" },
    { id: 15, nombre: "Beedrill", emoji: "⚔️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png" },
    
    // --- AVES ---
    { id: 16, nombre: "Pidgey", emoji: "🐦", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png" },
    { id: 17, nombre: "Pidgeotto", emoji: "🦅", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png" },
    { id: 18, nombre: "Pidgeot", emoji: "🌪️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png" },
    { id: 19, nombre: "Rattata", emoji: "🐭", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png" },
    { id: 20, nombre: "Raticate", emoji: "🦷", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png" },
    { id: 21, nombre: "Spearow", emoji: "🐤", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png" },
    { id: 22, nombre: "Fearow", emoji: "🪁", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png" },
    
    // --- SERPIENTES ---
    { id: 23, nombre: "Ekans", emoji: "🐍", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png" },
    { id: 24, nombre: "Arbok", emoji: "👿", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png" },
    
    // --- ELÉCTRICOS ---
    { id: 25, nombre: "Pikachu", emoji: "⚡", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
    { id: 26, nombre: "Raichu", emoji: "🔋", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png" },
    
    // --- TIERRA/VENENO ---
    { id: 27, nombre: "Sandshrew", emoji: "🏜️", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png" },
    { id: 28, nombre: "Sandslash", emoji: "🌵", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png" },
    { id: 29, nombre: "Nidoran♀", emoji: "🚺", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png" },
    { id: 30, nombre: "Nidorina", emoji: "💠", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png" },
    { id: 31, nombre: "Nidoqueen", emoji: "👑", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png" },
    { id: 32, nombre: "Nidoran♂", emoji: "🚹", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png" },
    { id: 33, nombre: "Nidorino", emoji: "⚛️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/33.png" },
    { id: 34, nombre: "Nidoking", emoji: "👺", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png" },
    
    // --- HADAS ---
    { id: 35, nombre: "Clefairy", emoji: "🌙", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png" },
    { id: 36, nombre: "Clefable", emoji: "🧚", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png" },
    
    // --- FUEGO ---
    { id: 37, nombre: "Vulpix", emoji: "🦊", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png" },
    { id: 38, nombre: "Ninetales", emoji: "🏮", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png" },
    
    // --- GLOBO ---
    { id: 39, nombre: "Jigglypuff", emoji: "🎤", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png" },
    { id: 40, nombre: "Wigglytuff", emoji: "🎀", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/40.png" },
    
    // --- MURCIÉLAGOS ---
    { id: 41, nombre: "Zubat", emoji: "🦇", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png" },
    { id: 42, nombre: "Golbat", emoji: "🧛", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" },
    
    // --- PLANTAS ---
    { id: 43, nombre: "Oddish", emoji: "🌱", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png" },
    { id: 44, nombre: "Gloom", emoji: "🥀", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png" },
    { id: 45, nombre: "Vileplume", emoji: "🌸", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png" },
    { id: 46, nombre: "Paras", emoji: "🍄", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/46.png" },
    { id: 47, nombre: "Parasect", emoji: "🦀", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/47.png" },
    
    // --- INSECTOS ---
    { id: 48, nombre: "Venonat", emoji: "🟣", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png" },
    { id: 49, nombre: "Venomoth", emoji: "🛸", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/49.png" },
    { id: 50, nombre: "Diglett", emoji: "🪵", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png" },

// --- CONTINUACIÓN 1ª GENERACIÓN (51-151) ---
    { id: 51, nombre: "Dugtrio", emoji: "🌋", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/51.png" },
    { id: 52, nombre: "Meowth", emoji: "🐱", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png" },
    { id: 53, nombre: "Persian", emoji: "🐆", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/53.png" },
    { id: 54, nombre: "Psyduck", emoji: "🦆", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" },
    { id: 55, nombre: "Golduck", emoji: "🌊", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png" },
    { id: 56, nombre: "Mankey", emoji: "🐒", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/56.png" },
    { id: 57, nombre: "Primeape", emoji: "💢", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/57.png" },
    { id: 58, nombre: "Growlithe", emoji: "🐕", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png" },
    { id: 59, nombre: "Arcanine", emoji: "🔥", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png" },
    { id: 60, nombre: "Poliwag", emoji: "🌀", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png" },
    { id: 61, nombre: "Poliwhirl", emoji: "🐸", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/61.png" },
    { id: 62, nombre: "Poliwrath", emoji: "👊", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/62.png" },
    { id: 63, nombre: "Abra", emoji: "🧠", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png" },
    { id: 64, nombre: "Kadabra", emoji: "🥄", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png" },
    { id: 65, nombre: "Alakazam", emoji: "🧙", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png" },
    { id: 66, nombre: "Machop", emoji: "💪", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png" },
    { id: 67, nombre: "Machoke", emoji: "🏋️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/67.png" },
    { id: 68, nombre: "Machamp", emoji: "🏅", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png" },
    { id: 69, nombre: "Bellsprout", emoji: "🌱", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png" },
    { id: 70, nombre: "Weepinbell", emoji: "🍃", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/70.png" },
    { id: 71, nombre: "Victreebel", emoji: "🪴", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/71.png" },
    { id: 72, nombre: "Tentacool", emoji: "🦑", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png" },
    { id: 73, nombre: "Tentacruel", emoji: "🐙", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/73.png" },
    { id: 74, nombre: "Geodude", emoji: "🌑", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png" },
    { id: 75, nombre: "Graveler", emoji: "🪨", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/75.png" },
    { id: 76, nombre: "Golem", emoji: "🌍", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png" },
    { id: 77, nombre: "Ponyta", emoji: "🐴", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png" },
    { id: 78, nombre: "Rapidash", emoji: "🦄", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png" },
    { id: 79, nombre: "Slowpoke", emoji: "🥱", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png" },
    { id: 80, nombre: "Slowbro", emoji: "🐚", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/80.png" },
    { id: 81, nombre: "Magnemite", emoji: "🧲", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png" },
    { id: 82, nombre: "Magneton", emoji: "📡", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/82.png" },
    { id: 83, nombre: "Farfetch'd", emoji: "🎋", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/83.png" },
    { id: 84, nombre: "Doduo", emoji: "🐦", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png" },
    { id: 85, nombre: "Dodrio", emoji: "🔱", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/85.png" },
    { id: 86, nombre: "Seel", emoji: "🦭", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png" },
    { id: 87, nombre: "Dewgong", emoji: "❄️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/87.png" },
    { id: 88, nombre: "Grimer", emoji: "☣️", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png" },
    { id: 89, nombre: "Muk", emoji: "🌋", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/89.png" },
    { id: 90, nombre: "Shellder", emoji: "👅", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png" },
    { id: 91, nombre: "Cloyster", emoji: "💎", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png" },
    { id: 92, nombre: "Gastly", emoji: "💨", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png" },
    { id: 93, nombre: "Haunter", emoji: "👻", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png" },
    { id: 94, nombre: "Gengar", emoji: "😈", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" },
    { id: 95, nombre: "Onix", emoji: "⛓️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" },
    { id: 96, nombre: "Drowzee", emoji: "💤", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png" },
    { id: 97, nombre: "Hypno", emoji: "🌀", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/97.png" },
    { id: 98, nombre: "Krabby", emoji: "🦀", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png" },
    { id: 99, nombre: "Kingler", emoji: "🔨", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/99.png" },
    { id: 100, nombre: "Voltorb", emoji: "🔴", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png" },
    { id: 101, nombre: "Electrode", emoji: "⚪", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/101.png" },
    { id: 102, nombre: "Exeggcute", emoji: "🥚", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png" },
    { id: 103, nombre: "Exeggutor", emoji: "🌴", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png" },
    { id: 104, nombre: "Cubone", emoji: "🦴", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png" },
    { id: 105, nombre: "Marowak", emoji: "💀", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/105.png" },
    { id: 106, nombre: "Hitmonlee", emoji: "🦵", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png" },
    { id: 107, nombre: "Hitmonchan", emoji: "🥊", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/107.png" },
    { id: 108, nombre: "Lickitung", emoji: "👅", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png" },
    { id: 109, nombre: "Koffing", emoji: "💣", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png" },
    { id: 110, nombre: "Weezing", emoji: "☢️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png" },
    { id: 111, nombre: "Rhyhorn", emoji: "🦏", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png" },
    { id: 112, nombre: "Rhydon", emoji: "🛡️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png" },
    { id: 113, nombre: "Chansey", emoji: "🥚", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png" },
    { id: 114, nombre: "Tangela", emoji: "🧶", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png" },
    { id: 115, nombre: "Kangaskhan", emoji: "🤱", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/115.png" },
    { id: 116, nombre: "Horsea", emoji: "🧜", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/116.png" },
    { id: 117, nombre: "Seadra", emoji: "🐉", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/117.png" },
    { id: 118, nombre: "Goldeen", emoji: "🐠", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png" },
    { id: 119, nombre: "Seaking", emoji: "🔱", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/119.png" },
    { id: 120, nombre: "Staryu", emoji: "⭐", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png" },
    { id: 121, nombre: "Starmie", emoji: "🌠", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png" },
    { id: 122, nombre: "Mr. Mime", emoji: "🤡", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png" },
    { id: 123, nombre: "Scyther", emoji: "🔪", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png" },
    { id: 124, nombre: "Jynx", emoji: "💋", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png" },
    { id: 125, nombre: "Electabuzz", emoji: "🔌", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png" },
    { id: 126, nombre: "Magmar", emoji: "🔥", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png" },
    { id: 127, nombre: "Pinsir", emoji: "🦂", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png" },
    { id: 128, nombre: "Tauros", emoji: "🐂", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png" },
    { id: 129, nombre: "Magikarp", emoji: "🐟", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png" },
    { id: 130, nombre: "Gyarados", emoji: "🐉", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png" },
    { id: 131, nombre: "Lapras", emoji: "⛵", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png" },
    { id: 132, nombre: "Ditto", emoji: "🍮", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png" },
    { id: 133, nombre: "Eevee", emoji: "🐕", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
    { id: 134, nombre: "Vaporeon", emoji: "🧜", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png" },
    { id: 135, nombre: "Jolteon", emoji: "⚡", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png" },
    { id: 136, nombre: "Flareon", emoji: "🔥", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png" },
    { id: 137, nombre: "Porygon", emoji: "👾", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png" },
    { id: 138, nombre: "Omanyte", emoji: "🐚", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/138.png" },
    { id: 139, nombre: "Omastar", emoji: "🦑", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/139.png" },
    { id: 140, nombre: "Kabuto", emoji: "🛡️", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/140.png" },
    { id: 141, nombre: "Kabutops", emoji: "⚔️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/141.png" },
    { id: 142, nombre: "Aerodactyl", emoji: "🦖", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png" },
    { id: 143, nombre: "Snorlax", emoji: "😴", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" },
    { id: 144, nombre: "Articuno", emoji: "❄️", saga: "Pokémon", tipo: "agua", rareza: "legendario", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png" },
    { id: 145, nombre: "Zapdos", emoji: "⚡", saga: "Pokémon", tipo: "agua", rareza: "legendario", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png" },
    { id: 146, nombre: "Moltres", emoji: "🔥", saga: "Pokémon", tipo: "agua", rareza: "legendario", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png" },
    { id: 147, nombre: "Dratini", emoji: "🐍", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png" },
    { id: 148, nombre: "Dragonair", emoji: "🐉", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png" },
    { id: 149, nombre: "Dragonite", emoji: "🐲", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png" },
    { id: 150, nombre: "Mewtwo", emoji: "🧬", saga: "Pokémon", tipo: "agua", rareza: "legendario", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" },
    { id: 151, nombre: "Mew", emoji: "✨", saga: "Pokémon", tipo: "agua", rareza: "legendario", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png" },
    // --- DRAGON BALL (Mantenemos los tuyos) ---
    { id: 152, nombre: "Goku", emoji: "👊", saga: "Dragon Ball", tipo: "fuego", rareza: "legendario", sprite: "https://media.tenor.com/y_26-S_C8SIAAAAC/goku-pixel.gif" },
    { id: 153, nombre: "Vegeta", emoji: "👑", saga: "Dragon Ball", tipo: "agua", rareza: "epico", sprite: "https://media.tenor.com/Y38G7Z4u830AAAAC/vegeta-pixel.gif" }
];

const RAREZAS = { 
    comun: '#94a3b8', raro: '#4ade80', epico: '#a855f7', legendario: '#f59e0b' 
};

const TABLA_TIPOS = { 
    fuego: { ventaja: 'planta', color: '#f87171' },
    planta: { ventaja: 'agua', color: '#4ade80' },
    agua: { ventaja: 'fuego', color: '#60a5fa' }
};