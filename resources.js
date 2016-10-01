"use strict";

// Resources Module handles determining what sort of mode we should be operating in.
//
// CRITICAL, LOW, NORMAL
//
// The mode is based upon a combination of factors, including:
//   Room Controller Level
//   Room Structures - Storage, Container
//   Room Sources (probably a linear relationship to other things like minimum stored energy)

// Things which are expected to vary based upon the resource mode, room level, and sources:
//   Creep behavior (e.g., no upgrading room controller at CRITICAL)
//   Number of creeps of each type
//   Body size/configuration of creeps
//   Minimum level of repair for decayable things (storage, roads, ramparts)
//   Minimum level of repair of walls

// Resource budget is complex.
// 1. Income averages to 10 energy per tick per source
// 2. A creep lasts 1500 ticks, 
//    a. takes 3 ticks per body part to build (CREEP_SPAWN_TIME)
//    b. takes a variable energy cost per body part (BODYPART_COST)
// 3. Number of structures differs at controller level (CONTROLLER_STRUCTURES, no arrays)
// 



// Summarizes the situation in a room in a single object.
function summarize_room(room) {
    if (room == null) {
        return null;
    }
    if (room.controller == null || !room.controller.my) {
        // Can null even happen?
        return null;
    }
    const controller_level = room.controller.level;
    const controller_progress = room.controller.progress;
    const controller_needed = room.controller.progressTotal;
    const controller_downgrade = room.controller.ticksToDowngrade;
    const controller_blocked = room.controller.upgradeBlocked;
    const controller_safemode = room.controller.safeMode ? room.controller.safeMode : 0;
    const controller_safemode_avail = room.controller.safeModeAvailable;
    const controller_safemode_cooldown = room.controller.safeModeCooldown;
    const has_storage = room.storage != null;
    const storage_energy = room.storage ? room.storage.store[RESOURCE_ENERGY] : 0;
    const energy_avail = room.energyAvailable;
    const energy_cap = room.energyCapacityAvailable;
    const containers = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER });
    const num_containers = containers == null ? 0 : containers.length;
    const container_energy = _.sum(containers, c => c.store.energy);
    const sources = room.find(FIND_SOURCES);
    const num_sources = sources == null ? 0 : sources.length;
    const source_energy = _.sum(sources, s => s.energy);
    const links = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_LINK && s.my });
    const num_links = links == null ? 0 : links.length;
    const link_energy = _.sum(links, l => l.energy);
    const minerals = room.find(FIND_MINERALS);
    const mineral = minerals && minerals.length > 0 ? minerals[0] : null;
    const mineral_type = mineral ? mineral.mineralType : "";
    const mineral_amount = mineral ? mineral.mineralAmount : 0;
    const creeps = _.filter(Game.creeps, c => c.pos.roomName == room.name && c.my);
    const num_creeps = creeps ? creeps.length : 0;
    const enemy_creeps = _.filter(Game.creeps, c => c.pos.roomName == room.name && !c.my);
    const creep_energy = _.sum(Game.creeps, c => c.carry.energy);
    const num_enemies = enemy_creeps ? enemy_creeps.length : 0;
    const spawns = room.find(FIND_MY_SPAWNS);
    const num_spawns = spawns ? spawns.length : 0;
    const spawns_spawning =  _.sum(spawns, s => s.spawning ? 1 : 0);
    const towers = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER && s.my });
    const num_towers = towers ? towers.length : 0;
    const tower_energy = _.sum(towers, t => t.energy);

    // Number of each kind of creeps
    // const creep_types = new Set(creeps.map(c => c.memory.role));
    const creep_counts = _.countBy(creeps, c => c.memory.role);

    // Other things we can count:
    // Tower count, energy
    // Minimum health of ramparts, walls
    // Minimum health of roads
    // Number of roads?
    // Resources (energy/minerals) on the ground?

    // Other things we can't count but we _can_ track manually:
    // Energy spent on repairs
    // Energy spent on making creeps
    // Energy lost to links
    //
    // Energy in a source when it resets (wasted/lost energy)

    let retval = {
        controller_level,
        controller_progress,
        controller_needed,
        controller_downgrade,
        controller_blocked,
        controller_safemode,
        controller_safemode_avail,
        controller_safemode_cooldown,
        energy_avail,
        energy_cap,
        num_sources,
        source_energy,
        mineral_type,
        mineral_amount,
        has_storage,
        storage_energy,
        num_containers,
        container_energy,
        num_links,
        link_energy,
        num_creeps,
        creep_counts,
        creep_energy,
        num_enemies,
        num_spawns,
        spawns_spawning,
        num_towers,
        tower_energy,
    };
    
    // console.log('Room ' + room.name + ': ' + JSON.stringify(retval));
    return retval;
} // summarize_room

function summarize_rooms() {
    const now = Game.time;

    // First check if we cached it
    if (global.summarized_room_timestamp == now) {
        return global.summarized_rooms;
    }

    let retval = {};

    for (let r in Game.rooms) {
        let summary = summarize_room(Game.rooms[r]);
        retval[r] = summary;
    }

    global.summarized_room_timestamp = now;
    global.summarized_rooms = retval;

    // console.log('All rooms: ' + JSON.stringify(retval));
    return retval;
} // summarize_rooms

module.exports = {
    summarize_room,
    summarize_rooms,
};
