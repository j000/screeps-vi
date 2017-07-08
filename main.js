// vim: tabstop=4 shiftwidth=0 noexpandtab
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

function isset(a) {
	return typeof a !== 'undefined';
}

function delayRun(a, ticksMin, ticksMax) {
	var ticks = isset(ticksMax) ? Game.cpu.bucket/10000 * (ticksMax-ticksMin) + ticksMin : ticksMin;
	if (!isset(Memory.timer[a]) || Game.time - Memory.timer[a] >= ticks) {
		Memory.timer[a] = Game.time;
		return true;
	}
	return false;
}

module.exports.loop = function () {

	if (delayRun('garbage', 40)) {
		for(var name in Memory.creeps) {
			if(!Game.creeps[name]) {
				delete Memory.creeps[name];
				console.log('Clearing non-existing creep memory:', name);
			}
		}
	}

	var tower = Game.getObjectById('TOWER_ID');
	if(tower) {
		var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => structure.hits < structure.hitsMax
		});
		if(closestDamagedStructure) {
			tower.repair(closestDamagedStructure);
		}

		var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(closestHostile) {
			tower.attack(closestHostile);
		}
	}

	var harvesters = 0,
		builders = 0,
		upgraders = 0;
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if(creep.memory.role == 'harvester') {
			++harvesters;
			roleHarvester.run(creep);
		} else if(creep.memory.role == 'upgrader') {
			++upgraders;
			roleUpgrader.run(creep);
		} else if(creep.memory.role == 'builder') {
			++builders;
			roleBuilder.run(creep);
		}
	}

	if (harvesters < 2) {
		var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
		console.log('Spawning new harvester: ' + newName);
	} else if (upgraders < 3) {
		var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
		console.log('Spawning new upgrader: ' + newName);
	} else if (builders < 5) {
		var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
		console.log('Spawning new builder: ' + newName);
	}

	if(Game.spawns['Spawn1'].spawning) {
		var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
		Game.spawns['Spawn1'].room.visual.text(
			'🛠️' + spawningCreep.memory.role,
			Game.spawns['Spawn1'].pos.x + 1,
			Game.spawns['Spawn1'].pos.y,
			{align: 'left', opacity: 0.8});
	}
	if (delayRun('lastStatus', 20)) {
		console.log('Harvesters: ' + harvesters);
		console.log('Builders: ' + builders);
		console.log('Upgraders: ' + upgraders);
	}
}
