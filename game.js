// ==================== CONFIGURATION SECTION ====================
// All image paths centralized here - change these to swap graphics
const assetsConfig = {
    playerIdle: 'assets/player_idle.png',
    playerRun: 'assets/player_run.png',
    zombieWalk: 'assets/zombie_walk.png',
    background: 'assets/background.png',
    slotFrame: 'assets/slot_frame.png',
    reelBackground: 'assets/reel_background.png',
    highlightEffect: 'assets/highlight.png',
    xpOrb: 'assets/xp_orb.png',
    projectile: 'assets/projectile.png',
    weaponIcons: {
        rapidBlaster: 'assets/weapon1_icon.png',
        spreadShotgun: 'assets/weapon2_icon.png',
        orbitalBlades: 'assets/weapon3_icon.png',
        lightningChain: 'assets/weapon4_icon.png',
        flameRing: 'assets/weapon5_icon.png'
    }
};

// Weapon definitions - extensible data structure
const weaponsConfig = {
    rapidBlaster: {
        id: 'rapidBlaster',
        name: 'Rapid Blaster',
        icon: assetsConfig.weaponIcons.rapidBlaster,
        baseDamage: 5,
        type: 'projectile',
        fireRate: 0.2, // seconds between shots
        projectileSpeed: 400,
        upgradeLevel: 1,
        upgradePaths: {
            fireRate: [0.15, 0.1, 0.05],
            damage: [7, 10, 15],
            projectileSpeed: [500, 600, 700],
            multiTarget: [1, 2, 3]
        }
    },
    spreadShotgun: {
        id: 'spreadShotgun',
        name: 'Spread Shotgun',
        icon: assetsConfig.weaponIcons.spreadShotgun,
        baseDamage: 10,
        type: 'spread',
        pellets: 5,
        spreadAngle: 30,
        fireRate: 1.0,
        upgradeLevel: 1,
        upgradePaths: {
            pellets: [7, 9, 12],
            damage: [15, 20, 25],
            spreadAngle: [40, 50, 60],
            knockbackChance: [0.1, 0.3, 0.5]
        }
    },
    orbitalBlades: {
        id: 'orbitalBlades',
        name: 'Orbital Blades',
        icon: assetsConfig.weaponIcons.orbitalBlades,
        baseDamage: 8,
        type: 'orbital',
        bladeCount: 2,
        orbitRadius: 50,
        rotationSpeed: 3,
        upgradeLevel: 1,
        upgradePaths: {
            bladeCount: [3, 4, 6],
            damage: [12, 18, 25],
            orbitRadius: [70, 90, 120],
            rotationSpeed: [4, 5, 7]
        }
    },
    lightningChain: {
        id: 'lightningChain',
        name: 'Lightning Chain',
        icon: assetsConfig.weaponIcons.lightningChain,
        baseDamage: 12,
        type: 'chain',
        chainJumps: 2,
        cooldown: 2.0,
        upgradeLevel: 1,
        upgradePaths: {
            chainJumps: [3, 4, 6],
            damage: [18, 25, 35],
            cooldown: [1.5, 1.0, 0.7]
        }
    },
    flameRing: {
        id: 'flameRing',
        name: 'Flame Ring',
        icon: assetsConfig.weaponIcons.flameRing,
        baseDamage: 3,
        type: 'area',
        radius: 80,
        dps: 5,
        duration: 5,
        upgradeLevel: 1,
        upgradePaths: {
            radius: [100, 120, 150],
            dps: [8, 12, 18],
            duration: [7, 10, 15],
            burnChance: [0.2, 0.4, 0.6]
        }
    }
};

// Game settings
const gameConfig = {
    canvasWidth: 800,
    canvasHeight: CCC00,
    playerSpeed: 300,
    playerHealth: 100,
    zombieSpeed: 80,
    zombieHealth: 20,
    zombieDamage: 5,
    xpPerKill: 10,
    xpPerLevel: 100,
    spawnRate: 1.0, // zombies per second
    waveIncreaseRate: 0.1,
    slotMachineSpinTime: 2.0
};

// Slot machine reel items - generated from weapons config
const slotReelItems = Object.values(weaponsConfig).map(w => ({
    id: w.id,
    name: w.name,
    description: `${w.name}: Base damage ${w.baseDamage}`,
    iconSrc: w.icon,
    rarity: 'common'
}));

// ==================== UTILITY CLASSES ====================
class Sprite {
    constructor(src, width, height, frameCount = 1) {
        this.src = src;
        this.width = width;
        this.height = height;
        this.totalFrames = frameCount;
        this.currentFrame = 0;
        this.frameDuration = 100; // ms per frame
        this.lastFrameTime = 0;
        this.image = null;
        this.loaded = false;
        
        // Load image
        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => this.loaded = true;
    }
    
    update(deltaTime) {
        if (this.totalFrames > 1) {
            this.lastFrameTime += deltaTime;
            if (this.lastFrameTime >= this.frameDuration) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.lastFrameTime = 0;
            }
        }
    }
    
    draw(ctx, x, y) {
        if (!this.loaded) return;
        
        const frameWidth = this.width / this.totalFrames;
        const sx = this.currentFrame * frameWidth;
        
        ctx.drawImage(
            this.image,
            sx, 0, frameWidth, this.height,
            x, y, frameWidth, this.height
        );
    }
}

// ==================== ANIMATION HOOKS ====================
// Centralized animation triggers - replace these with complex animations later
const animationHooks = {
    playPlayerAttackAnimation(weaponId) {
        // Placeholder: scale player briefly
        Game.player.attackAnimationTime = 0.1;
    },
    
    playZombieHitAnimation(zombie) {
        // Placeholder: flash red
        zombie.hitAnimationTime = 0.2;
    },
    
    playLevelUpAnimation() {
        // Placeholder: show particle effects
        console.log('Level up animation triggered');
    },
    
    playSlotMachineSpin() {
        // Placeholder: reel spinning visual
        console.log('Slot machine spin animation');
    }
};

// ==================== GAME ENTITY CLASSES ====================
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = gameConfig.playerSpeed;
        this.health = gameConfig.playerHealth;
        this.maxHealth = gameConfig.playerHealth;
        this.direction = { x: 0, y: 0 };
        this.weapons = [];
        this.xp = 0;
        this.level = 1;
        this.xpNeeded = gameConfig.xpPerLevel;
        this.attackAnimationTime = 0;
        
        // Sprites
        this.idleSprite = new Sprite(assetsConfig.playerIdle, 40, 40, 4);
        this.runSprite = new Sprite(assetsConfig.playerRun, 40, 40, 4);
        this.currentSprite = this.idleSprite;
    }
    
    update(deltaTime, zombies) {
        // Movement
        const moveX = this.direction.x * this.speed * deltaTime;
        const moveY = this.direction.y * this.speed * deltaTime;
        this.x += moveX;
        this.y += moveY;
        
        // Keep within bounds
        this.x = Math.max(0, Math.min(gameConfig.canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(gameConfig.canvasHeight - this.height, this.y));
        
        // Update sprite
        if (this.direction.x !== 0 || this.direction.y !== 0) {
            this.currentSprite = this.runSprite;
        } else {
            this.currentSprite = this.idleSprite;
        }
        this.currentSprite.update(deltaTime);
        
        // Attack animation
        if (this.attackAnimationTime > 0) {
            this.attackAnimationTime -= deltaTime;
        }
        
        // Auto-attack with weapons
        for (const weapon of this.weapons) {
            weapon.update(deltaTime, this, zombies);
        }
    }
    
    draw(ctx) {
        // Draw player
        this.currentSprite.draw(ctx, this.x, this.y);
        
        // Attack animation effect
        if (this.attackAnimationTime > 0) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }
    
    addWeapon(weaponId) {
        const weaponData = weaponsConfig[weaponId];
        if (!weaponData) return;
        
        // Check if player already has this weapon
        const existing = this.weapons.find(w => w.id === weaponId);
        if (existing) {
            // Upgrade existing weapon
            existing.upgrade();
        } else {
            // Create new weapon instance
            const weapon = WeaponFactory.create(weaponId);
            this.weapons.push(weapon);
        }
    }
    
    collectXP(amount) {
        this.xp += amount;
        if (this.xp >= this.xpNeeded) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.xp = 0;
        this.xpNeeded = gameConfig.xpPerLevel * this.level;
        animationHooks.playLevelUpAnimation();
        Game.showSlotMachine();
    }
}

class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = gameConfig.zombieSpeed;
        this.health = gameConfig.zombieHealth;
        this.damage = gameConfig.zombieDamage;
        this.target = null;
        this.hitAnimationTime = 0;
        
        this.sprite = new Sprite(assetsConfig.zombieWalk, 30, 30, 4);
    }
    
    update(deltaTime, player) {
        this.target = player;
        
        // Move toward player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * this.speed * deltaTime;
            this.y += (dy / distance) * this.speed * deltaTime;
        }
        
        // Update sprite animation
        this.sprite.update(deltaTime);
        
        // Hit animation
        if (this.hitAnimationTime > 0) {
            this.hitAnimationTime -= deltaTime;
        }
    }
    
    draw(ctx) {
        this.sprite.draw(ctx, this.x, this.y);
        
        // Hit animation effect
        if (this.hitAnimationTime > 0) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        
        // Health bar above zombie
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 5, this.width * (this.health / gameConfig.zombieHealth), 3);
    }
    
    takeDamage(damage) {
        this.health -= damage;
        animationHooks.playZombieHitAnimation(this);
        return this.health <= 0;
    }
}

class XPOrb {
    constructor(x, y, amount) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 15;
        this.amount = amount;
        this.collected = false;
        
        this.sprite = new Sprite(assetsConfig.xpOrb, 15, 15);
    }
    
    update(deltaTime, player) {
        // Check collection distance
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 50) {
            player.collectXP(this.amount);
            this.collected = true;
        }
    }
    
    draw(ctx) {
        if (!this.collected) {
            this.sprite.draw(ctx, this.x, this.y);
        }
    }
}

// ==================== WEAPON SYSTEM ====================
class WeaponFactory {
    static create(weaponId) {
        const config = weaponsConfig[weaponId];
        if (!config) return null;
        
        switch(config.type) {
            case 'projectile':
                return new ProjectileWeapon(config);
            case 'spread':
                return new SpreadWeapon(config);
            case 'orbital':
                return new OrbitalWeapon(config);
            case 'chain':
                return new ChainWeapon(config);
            case 'area':
                return new AreaWeapon(config);
            default:
                return new BaseWeapon(config);
        }
    }
}

class BaseWeapon {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.icon = config.icon;
        this.damage = config.baseDamage;
        this.fireRate = config.fireRate;
        this.upgradeLevel = config.upgradeLevel;
        this.upgradePaths = config.upgradePaths;
        this.lastFireTime = 0;
    }
    
    upgrade() {
        this.upgradeLevel++;
        // Apply upgrade effects based on paths
        if (this.upgradePaths.fireRate) {
            this.fireRate = this.upgradePaths.fireRate[this.upgradeLevel - 1] || this.fireRate;
        }
        if (this.upgradePaths.damage) {
            this.damage = this.upgradePaths.damage[this.upgradeLevel - 1] || this.damage;
        }
    }
    
    canFire(currentTime) {
        return currentTime - this.lastFireTime >= this.fireRate;
    }
    
    update(deltaTime, player, zombies) {
        // Base weapon does nothing - override in subclasses
    }
}

class ProjectileWeapon extends BaseWeapon {
    constructor(config) {
        super(config);
        this.projectileSpeed = config.projectileSpeed;
        this.multiTarget = 1;
        this.projectiles = [];
    }
    
    update(deltaTime, player, zombies) {
        const currentTime = Date.now() / 1000;
        
        if (this.canFire(currentTime) && zombies.length > 0) {
            // Find nearest zombie
            let nearest = zombies[0];
            let minDist = Infinity;
            
            for (const zombie of zombies) {
                const dx = zombie.x - player.x;
                const dy = zombie.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = zombie;
                }
            }
            
            // Fire projectile
            for (let i = 0; i < this.multiTarget; i++) {
                const proj = new Projectile(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    nearest.x + nearest.width / 2,
                    nearest.y + nearest.height / 2,
                    this.projectileSpeed,
                    this.damage
                );
                this.projectiles.push(proj);
            }
            
            this.lastFireTime = currentTime;
            animationHooks.playPlayerAttackAnimation(this.id);
        }
        
        // Update projectiles
        for (const proj of this.projectiles) {
            proj.update(deltaTime, zombies);
        }
        
        // Remove finished projectiles
        this.projectiles = this.projectiles.filter(p => !p.finished);
    }
}

class SpreadWeapon extends BaseWeapon {
    constructor(config) {
        super(config);
        this.pellets = config.pellets;
        this.spreadAngle = config.spreadAngle;
        this.knockbackChance = 0;
        this.lastDirection = 0;
    }
    
    update(deltaTime, player, zombies) {
        const currentTime = Date.now() / 1000;
        
        if (this.canFire(currentTime)) {
            // Determine firing direction (based on player movement or random)
            this.lastDirection = player.direction.x !== 0 || player.direction.y !== 0 
                ? Math.atan2(player.direction.y, player.direction.x)
                : Math.random() * Math.PI * 2;
            
            // Create pellets
            for (let i = 0; i < this.pellets; i++) {
                const angle = this.lastDirection + (Math.random() * this.spreadAngle - this.spreadAngle / 2) * Math.PI / 180;
                const proj = new Projectile(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    player.x + Math.cos(angle) * 500,
                    player.y + Math.sin(angle) * 500,
                    300,
                    this.damage
                );
                Game.projectiles.push(proj);
            }
            
            this.lastFireTime = currentTime;
            animationHooks.playPlayerAttackAnimation(this.id);
        }
    }
}

class OrbitalWeapon extends BaseWeapon {
    constructor(config) {
        super(config);
        this.bladeCount = config.bladeCount;
        this.orbitRadius = config.orbitRadius;
        this.rotationSpeed = config.rotationSpeed;
        this.angle = 0;
        this.blades = [];
        
        // Initialize blades
        for (let i = 0; i < this.bladeCount; i++) {
            this.blades.push({
                angle: (i / this.bladeCount) * Math.PI * 2,
                x: 0,
                y: 0
            });
        }
    }
    
    update(deltaTime, player, zombies) {
        this.angle += this.rotationSpeed * deltaTime;
        
        // Update blade positions
        for (let i = 0; i < this.blades.length; i++) {
            const bladeAngle = this.angle + this.blades[i].angle;
            this.blades[i].x = player.x + player.width / 2 + Math.cos(bladeAngle) * this.orbitRadius;
            this.blades[i].y = player.y + player.height / 2 + Math.sin(bladeAngle) * this.orbitRadius;
            
            // Check collision with zombies
            for (const zombie of zombies) {
                const dx = this.blades[i].x - zombie.x;
                const dy = this.blades[i].y - zombie.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 20) {
                    zombie.takeDamage(this.damage);
                }
            }
        }
    }
}

class ChainWeapon extends BaseWeapon {
    constructor(config) {
        super(config);
        this.chainJumps = config.chainJumps;
        this.cooldown = config.cooldown;
        this.lastChainTime = 0;
    }
    
    update(deltaTime, player, zombies) {
        const currentTime = Date.now() / 1000;
        
        if (currentTime - this.lastChainTime >= this.cooldown && zombies.length > 0) {
            // Pick random zombie
            const target = zombies[Math.floor(Math.random() * zombies.length)];
            target.takeDamage(this.damage);
            
            // Chain to nearby zombies
            let currentTarget = target;
            for (let i = 0; i < this.chainJumps; i++) {
                // Find nearest zombie to current target
                let nearest = null;
                let minDist = Infinity;
                
                for (const zombie of zombies) {
                    if (zombie === currentTarget || zombie.health <= 0) continue;
                    
                    const dx = zombie.x - currentTarget.x;
                    const dy = zombie.y - currentTarget.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100 && dist < minDist) {
                        minDist = dist;
                        nearest = zombie;
                    }
                }
                
                if (nearest) {
                    nearest.takeDamage(this.damage);
                    currentTarget = nearest;
                } else {
                    break;
                }
            }
            
            this.lastChainTime = currentTime;
            animationHooks.playPlayerAttackAnimation(this.id);
        }
    }
}

class AreaWeapon extends BaseWeapon {
    constructor(config) {
        super(config);
        this.radius = config.radius;
        this.dps = config.dps;
        this.duration = config.duration;
        this.activeTime = 0;
        this.isActive = false;
    }
    
    update(deltaTime, player, zombies) {
        if (!this.isActive) {
            // Activate periodically
            const currentTime = Date.now() / 1000;
            if (currentTime - this.lastFireTime >= this.fireRate) {
                this.isActive = true;
                this.activeTime = 0;
                this.lastFireTime = currentTime;
                animationHooks.playPlayerAttackAnimation(this.id);
            }
        }
        
        if (this.isActive) {
            this.activeTime += deltaTime;
            
            // Damage zombies in radius
            for (const zombie of zombies) {
                const dx = zombie.x - player.x;
                const dy = zombie.y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.radius) {
                    zombie.takeDamage(this.dps * deltaTime);
                }
            }
            
            // Deactivate after duration
            if (this.activeTime >= this.duration) {
                this.isActive = false;
            }
        }
    }
}

class Projectile {
    constructor(x, y, targetX, targetY, speed, damage) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.damage = damage;
        this.width = 10;
        this.height = 10;
        this.finished = false;
        
        // Calculate direction
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.direction = { x: dx / distance, y: dy / distance };
        
        this.sprite = new Sprite(assetsConfig.projectile, 10, 10);
    }
    
    update(deltaTime, zombies) {
        this.x += this.direction.x * this.speed * deltaTime;
        this.y += this.direction.y * this.speed * deltaTime;
        
        // Check collision with zombies
        for (const zombie of zombies) {
            const dx = this.x - zombie.x;
            const dy = this.y - zombie.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) {
                zombie.takeDamage(this.damage);
                this.finished = true;
                break;
            }
        }
        
        // Remove if far away
        const dx = this.x - this.targetX;
        const dy = this.y - this.targetY;
        if (Math.sqrt(dx * dx + dy * dy) > 500) {
            this.finished = true;
        }
    }
    
    draw(ctx) {
        if (!this.finished) {
            this.sprite.draw(ctx, this.x, this.y);
        }
    }
}

// ==================== SLOT MACHINE UI ====================
class SlotMachine {
    constructor() {
        this.isActive = false;
        this.spinning = false;
        this.spinTime = 0;
        this.selectedChoices = [];
        this.reelItems = slotReelItems;
    }
    
    spin() {
        this.spinning = true;
        this.spinTime = 0;
        this.selectedChoices = [];
        
        // Randomly select 3 items
        for (let i = 0; i < 3; i++) {
            const randomItem = this.reelItems[Math.floor(Math.random() * this.reelItems.length)];
            this.selectedChoices.push(randomItem);
        }
        
        animationHooks.playSlotMachineSpin();
        
        // Update UI
        for (let i = 0; i < 3; i++) {
            const itemEl = document.querySelector(`.slot-item[data-index="${i}"]`);
            const descEl = document.querySelector(`.desc[data-desc="${i}"]`);
            
            if (itemEl && descEl) {
                // Create icon image
                itemEl.innerHTML = '';
                const img = new Image();
                img.src = this.selectedChoices[i].iconSrc;
                img.style.width = '80%';
                img.style.height = '80%';
                itemEl.appendChild(img);
                
                descEl.textContent = this.selectedChoices[i].description;
            }
        }
    }
    
    update(deltaTime) {
        if (this.spinning) {
            this.spinTime += deltaTime;
            
            // Animate reel
            const reelEl = document.querySelector('.slot-reel');
            if (reelEl) {
                const spinProgress = this.spinTime / gameConfig.slotMachineSpinTime;
                const offset = spinProgress * 600; // 600px width
                reelEl.style.transform = `translateX(-${offset}px)`;
            }
            
            // Stop spinning
            if (this.spinTime >= gameConfig.slotMachineSpinTime) {
                this.spinning = false;
                reelEl.style.transform = 'translateX(0px)';
            }
        }
    }
    
    selectChoice(index) {
        if (!this.spinning && this.selectedChoices[index]) {
            Game.player.addWeapon(this.selectedChoices[index].id);
            Game.hideSlotMachine();
        }
    }
}

// ==================== MAIN GAME CLASS ====================
class Game {
    static instance = null;
    
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = gameConfig.canvasWidth;
        this.height = gameConfig.canvasHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.player = new Player(this.width / 2, this.height / 2);
        this.zombies = [];
        this.xpOrbs = [];
        this.projectiles = [];
        this.slotMachine = new SlotMachine();
        
        this.lastTime = 0;
        this.spawnTimer = 0;
        this.wave = 1;
        this.paused = false;
        
        // Input
        this.keys = {};
        this.initInput();
        
        // UI elements
        this.healthFill = document.querySelector('.health-fill');
        this.xpFill = document.querySelector('.xp-fill');
        this.xpText = document.querySelector('.xp-text');
        this.slotOverlay = document.getElementById('slotMachineOverlay');
        
        // Slot machine buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = parseInt(btn.dataset.choice);
                this.slotMachine.selectChoice(choice);
            });
        });
        
        Game.instance = this;
    }
    
    initInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    updatePlayerInput() {
        const dir = { x: 0, y: 0 };
        
        if (this.keys['w'] || this.keys['arrowup']) dir.y = -1;
        if (this.keys['s'] || this.keys['arrowdown']) dir.y = 1;
        if (this.keys['a'] || this.keys['arrowleft']) dir.x = -1;
        if (this.keys['d'] || this.keys['arrowright']) dir.x = 1;
        
        this.player.direction = dir;
    }
    
    spawnZombie() {
        // Spawn from edges
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: // top
                x = Math.random() * this.width;
                y = -50;
                break;
            case 1: // right
                x = this.width + 50;
                y = Math.random() * this.height;
                break;
            case 2: // bottom
                x = Math.random() * this.width;
                y = this.height + 50;
                break;
            case 3: // left
                x = -50;
                y = Math.random() * this.height;
                break;
        }
        
        this.zombies.push(new Zombie(x, y));
    }
    
    update(deltaTime) {
        if (this.paused) return;
        
        // Update player input
        this.updatePlayerInput();
        
        // Update player
        this.player.update(deltaTime, this.zombies);
        
        // Update zombies
        for (const zombie of this.zombies) {
            zombie.update(deltaTime, this.player);
            
            // Check collision with player
            const dx = zombie.x - this.player.x;
            const dy = zombie.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                this.player.health -= zombie.damage * deltaTime;
            }
            
            // Remove dead zombies and spawn XP orb
            if (zombie.health <= 0) {
                this.xpOrbs.push(new XPOrb(zombie.x, zombie.y, gameConfig.xpPerKill));
                this.zombies.splice(this.zombies.indexOf(zombie), 1);
            }
        }
        
        // Update XP orbs
        for (const orb of this.xpOrbs) {
            orb.update(deltaTime, this.player);
        }
        this.xpOrbs = this.xpOrbs.filter(orb => !orb.collected);
        
        // Update projectiles
        for (const proj of this.projectiles) {
            proj.update(deltaTime, this.zombies);
        }
        this.projectiles = this.projectiles.filter(proj => !proj.finished);
        
        // Spawn zombies
        this.spawnTimer += deltaTime;
        const spawnRate = gameConfig.spawnRate + (this.wave * gameConfig.waveIncreaseRate);
        if (this.spawnTimer >= 1 / spawnRate) {
            this.spawnZombie();
            this.spawnTimer = 0;
        }
        
        // Update slot machine if active
        if (this.slotMachine.isActive) {
            this.slotMachine.update(deltaTime);
        }
        
        // Update UI
        this.updateUI();
    }
    
    updateUI() {
        // Health bar
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        this.healthFill.style.width = `${healthPercent}%`;
        
        // XP bar
        const xpPercent = (this.player.xp / this.player.xpNeeded) * 100;
        this.xpFill.style.width = `${xpPercent}%`;
        this.xpText.textContent = `Level ${this.player.level}`;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw zombies
        for (const zombie of this.zombies) {
            zombie.draw(this.ctx);
        }
        
        // Draw XP orbs
        for (const orb of this.xpOrbs) {
            orb.draw(this.ctx);
        }
        
        // Draw projectiles
        for (const proj of this.projectiles) {
            proj.draw(this.ctx);
        }
        
        // Draw orbital weapons
        for (const weapon of this.player.weapons) {
            if (weapon instanceof OrbitalWeapon) {
                for (const blade of weapon.blades) {
                    this.ctx.fillStyle = 'cyan';
                    this.ctx.fillRect(blade.x - 5, blade.y - 5, 10, 10);
                }
            }
            
            if (weapon instanceof AreaWeapon && weapon.isActive) {
                this.ctx.strokeStyle = 'orange';
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, weapon.radius, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
    }
    
    showSlotMachine() {
        this.paused = true;
        this.slotMachine.isActive = true;
        this.slotOverlay.classList.remove('hidden');
        this.slotMachine.spin();
    }
    
    hideSlotMachine() {
        this.paused = false;
        this.slotMachine.isActive = false;
        this.slotOverlay.classList.add('hidden');
    }
    
    run() {
        const loop = (currentTime) => {
            const deltaTime = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;
            
            this.update(deltaTime);
            this.draw();
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }
}

// ==================== INITIALIZATION ====================
window.addEventListener('load', () => {
    const game = new Game();
    game.run();
    
    // Give player a starting weapon
    game.player.addWeapon('rapidBlaster');
});
