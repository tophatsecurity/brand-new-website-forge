// Cool username generator inspired by sci-fi, anime, hacker movies, and 80s culture

const prefixes = [
  // Star Trek
  'Warp', 'Vulcan', 'Klingon', 'Borg', 'Phaser', 'Trekker', 'Enterprise', 'Spock', 'Picard', 'Data',
  // Star Wars
  'Jedi', 'Sith', 'Wookie', 'Droid', 'Force', 'Rebel', 'Mandalorian', 'Kyber', 'Saber', 'Vader',
  // Goonies
  'Goonie', 'Chunk', 'Sloth', 'OneEyed', 'Truffle', 'Pirate', 'Copper', 'Bones',
  // Sci-Fi
  'Cyber', 'Neo', 'Matrix', 'Replicant', 'Nexus', 'Blade', 'Runner', 'Morpheus', 'Zion', 'Oracle',
  'Skynet', 'Terminator', 'Chrome', 'Neon', 'Quantum', 'Vector', 'Plasma', 'Ion', 'Photon', 'Neutron',
  // Anime
  'Akira', 'Ghost', 'Shell', 'Mecha', 'Gundam', 'Bebop', 'Spike', 'Cowboy', 'Ninja', 'Shinobi',
  'Otaku', 'Sensei', 'Ronin', 'Samurai', 'Shogun', 'Titan', 'Hunter', 'Alchemist', 'Demon', 'Dragon',
  // Hacker Movies
  'Zero', 'Cool', 'Crash', 'Override', 'Acid', 'Burn', 'Phantom', 'Phreak', 'Cereal', 'Killer',
  'Lord', 'Nikon', 'Razor', 'Blade', 'Ghost', 'Shadow', 'Virus', 'Trojan', 'Root', 'Admin',
  // 80s Movies
  'Ferris', 'Marty', 'McFly', 'Doc', 'Flux', 'Delorean', 'Risky', 'Maverick', 'Goose', 'Iceman',
  'Karate', 'Cobra', 'Kai', 'Highlander', 'Thunder', 'Cats', 'Gremlins', 'Gizmo', 'Atreyu', 'Falkor',
];

const suffixes = [
  // Star Trek
  'Prime', 'Seven', 'Alpha', 'Delta', 'Omega', 'Quadrant', 'Sector', 'Deck',
  // Star Wars
  'Walker', 'Wing', 'Trooper', 'Master', 'Knight', 'Hunter', 'Pilot', 'Smuggler',
  // Goonies
  'Shuffle', 'Treasure', 'Adventure', 'Willy',
  // Sci-Fi
  'Runner', 'Hacker', 'Jacker', 'Glitch', 'Sync', 'Core', 'Node', 'Byte', 'Bit', 'Pixel',
  'Protocol', 'System', 'Code', 'Cipher', 'Key', 'Lock', 'Grid', 'Net', 'Web', 'Link',
  // Anime
  'Kun', 'San', 'Sama', 'Sensei', 'Dono', 'Senpai', 'Maru', 'Kage', 'Ryu', 'Ken',
  'Jutsu', 'Kai', 'Zangetsu', 'Bankai', 'Titan', 'Slayer',
  // Hacker
  'Override', 'Access', 'Root', 'Sudo', 'Ping', 'Trace', 'Exec', 'Stack', 'Heap', 'Buffer',
  // 80s
  'Kid', 'Express', 'Flash', 'Thunder', 'Lightning', 'Rider', 'Ranger', 'Force', 'Quest', 'Max',
];

const numbers = ['42', '007', '1984', '2001', '1138', '2049', '3000', '9000', '88', '99', '101', '404', '500', '666', '777', '808', '909'];

/**
 * Generates a random cool username based on sci-fi, anime, hacker movies, and 80s culture
 */
export function generateCoolUsername(): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // 50% chance to add a number
  const addNumber = Math.random() > 0.5;
  const number = addNumber ? numbers[Math.floor(Math.random() * numbers.length)] : '';
  
  // Various formatting styles
  const styles = [
    `${prefix}${suffix}${number}`,
    `${prefix}_${suffix}${number}`,
    `${prefix}${number}${suffix}`,
    `The${prefix}${suffix}`,
    `${prefix}X${suffix}`,
  ];
  
  return styles[Math.floor(Math.random() * styles.length)];
}

/**
 * Generates a slug-friendly version of the username (lowercase, no spaces)
 */
export function generateSluggedUsername(): string {
  return generateCoolUsername().toLowerCase().replace(/\s+/g, '-');
}
