// vim: tabstop=4 shiftwidth=0 noexpandtab
var roleBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {
		if ((creep.memory.building || typeof creep.memory.building === 'undefined') && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say('🔄 harvest');
			var sources = creep.room.find(FIND_SOURCES);
			var sourceNo = Math.floor(Math.random() * sources.length);
			creep.memory.source = sourceNo;
		}
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say('🚧 build');
		}

		if(creep.memory.building) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if(targets.length) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		} else {
			var sources = creep.room.find(FIND_SOURCES);
			if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	}
};

module.exports = roleBuilder;
