/*
Updated by: Nico Fannelli
*/

const GLOBAL_LATENCY = 80; //set this to slightly lower than your ping
const DEBUG = true;
//const DISABLE = false;

const JOB_NINJA = 11;
const GLOBAL_LOCK_DELAY = 1000;

const 
SKILL_AA = 11200,
SKILL_AA_DURATION = 800,
SKILL_AA_DISTANCE = 50,

SKILL_RETALIATE = 101000,

SKILL_HBH = 150732,
SKILL_HBH_DURATION = 1400, //? harmonious burning heart
SKILL_HBH_DISTANCE = 0,

SKILL_DC = 141101,
SKILL_DC_DURATION = 600, //600
SKILL_DC_DISTANCE = 162,

SKILL_DCFAST = 141102,
SKILL_DCFAST_DURATION = 600, //600
SKILL_DCFAST_DISTANCE = 162,

SKILL_SKYFALL = 121001,
SKILL_SKYFALL_DURATION = 800, //800
SKILL_SKYFALL_DISTANCE = 154.72,

SKILL_COS = 130901,
SKILL_COS_DURATION = 1400, //1600, 1700, 1500
SKILL_COS_DISTANCE = 245.06,

SKILL_LotW = 30800,
SKILL_LotW_DURATION = 1035,

SKILL_JP1 = 41001,
SKILL_JP1_DURATION = 300, //640, 450
SKILL_JP1_DISTANCE = 469,

SKILL_JP2 = 41010,
SKILL_JP2_DURATION = 75, //270, 150
SKILL_JP2_DISTANCE = 150,

SKILL_BH = 150701, // for each tick increment with 1 each time
SKILL_BH_DURATION = 800,
SKILL_BH2_DURATION = 350,

SKILL_CHAKRA_THRUST = 190500,
SKILL_CHAKRA_THRUST_DURATION = 500, //500
SKILL_CHAKRA_THRUST_DISTANCE = 127.5,

SKILL_QUICK_ATTACK = 220140,
SKILL_QUICK_ATTACK_DURATION = 800,
SKILL_QUICK_ATTACK_DISTANCE = 150,


SKILL_DECOY = 71000,
SKILL_DECOY_DURATION = 1350;


const BLACKLIST = [110100, 111110, 111111, 111112, 111113, 111114, 111115, 111116, 111117, 111118, 111119, 111120, 111121, 111122, 111124, 111125,
	111126, 111127, 111128, 111129, 111130, 111131, 111134, 111135, 111139, 111140, 111143, 111144, 111145, 111190, 111191, 111193,
	111194, 111195, 111197, 111199, 111202, 111203, 116001, 116002, 116003, 116004, 117002, 117003, 140100, 460100, 480100, 900001,
	111136, 111137, 111138, 111141, 111142, 111147, 111149, 111150, 111151, 111152, 111153, 111154, 111155, 111156, 111157, 111158,
	211141, 211150, 111123, 111132, 111133, 111146, 111148, 111192, 111196, 111198, 211145, 111159, 111160, 111161, 111162, 111163,
	111164, 111165, 111166, 111168, 111169, 111170, 111171, 111172, 111173, 111174, 111175, 111176, 111177, 111178, 111179, 111180,
	111204, 111205, 111206, 111207, 111208, 111209, 111210, 111211, 111212, 111214, 111215, 111216, 111217, 111218, 111219, 111220,
	111221, 111222, 111223, 111224, 111225, 111226, 111227, 111228, 111229, 111230, 111231, 111232, 111233, 111234, 111235, 111236,
	111237, 111238, 111239, 111241, 111242, 111243, 111244, 111245, 111246, 111247, 111248, 111249, 111250, 111251, 111252, 111253,
	111254, 111255, 111256, 111257, 111258, 111259, 111260, 111261, 111262, 111263, 111264, 111265, 111266, 111267, 111268, 111269,
	111270, 111271, 111272, 111273, 111274, 111275, 111276, 111277, 111278, 111279, 111280, 111281, 111282, 111283, 111284, 111285,
	111286, 111287, 111288, 111289, 111290, 111291, 111292, 111293, 111294, 111295, 111296, 111297, 111298, 111299, 111301, 111302];


module.exports = function ninja(dispatch){
	let cid, job, model, enabled, player, aspd;
	let retval = false;
	
	let lastSkill, lastEvent, lastLastSkill, actionStart;
	
	let atkid = [];
	let atkid_base = 0xFEFEFFEE;
	let timer = [];
	
	let disabSkill = []; //Prevent double cast
	
	let collisionLocX;
	let collisionLocY;
	let collisionLocZ;
	
	let DISABLE = false;
	
	
	 dispatch.command.add('ninju', () => {
        DISABLE = !DISABLE;
        dispatch.command.message(`Ninju skript disabled: ${DISABLE}`);
    });
	
	
	
	
	function fakeEnd(event, duration, dist){
		collisionLocX = false;
		collisionLocY = false;
		collisionLocZ = false;		
		let bonusAttackId = 0;
		let speedMultiplier = 1;
		
/*
		if(event.skill.id == SKILL_DC && (lastSkill == SKILL_JP1 || lastSkill == SKILL_JP2)){
			bonusAttackId = 0;
			duration = SKILL_DC_DURATION;
			disabSkill[SKILL_SKYFALL] = true;
			setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, duration/aspd);
			disabSkill[SKILL_COS] = true;
			setTimeout(function(){ disabSkill[SKILL_COS] = false; }, duration/aspd);
			disabSkill[SKILL_DECOY] = true;
			setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, duration/aspd);
		}
		
		if(event.skill.id == SKILL_DECOY && (lastSkill == SKILL_DC || lastSkill == SKILL_SKYFALL)){
			bonusAttackId = 0;
			duration = 400;
			disabSkill[SKILL_DC] = true;
			setTimeout(function(){ disabSkill[SKILL_DC] = false; }, duration/aspd);
			disabSkill[SKILL_SKYFALL] = true;
			setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, duration/aspd);
			disabSkill[SKILL_JP1] = true;
			setTimeout(function(){ disabSkill[SKILL_JP1] = false; }, duration/aspd);
		}
		
		if(event.skill.id == SKILL_SKYFALL && (lastSkill == SKILL_DECOY || lastSkill == SKILL_DC)){
			bonusAttackId = 0;
			duration = 550; //650
			disabSkill[SKILL_COS] = true;
			setTimeout(function(){ disabSkill[SKILL_COS] = false; }, duration/aspd);
			disabSkill[SKILL_DC] = true;
			setTimeout(function(){ disabSkill[SKILL_DC] = false; }, duration/aspd);
			disabSkill[SKILL_JP1] = true;
			setTimeout(function(){ disabSkill[SKILL_JP1] = false; }, duration/aspd);
			disabSkill[SKILL_DECOY] = true;
			setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, duration/aspd);
		}
		
		if(event.skill.id == SKILL_COS && (lastSkill == SKILL_SKYFALL)){
			bonusAttackId = 0;
			duration = SKILL_COS_DURATION;
			disabSkill[SKILL_DC] = true;
			setTimeout(function(){ disabSkill[SKILL_DC] = false; }, duration/aspd);
			disabSkill[SKILL_DECOY] = true;
			setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, duration/aspd);
			disabSkill[SKILL_JP1] = true;
			setTimeout(function(){ disabSkill[SKILL_JP1] = false; }, duration/aspd);
		}
		
		if(event.skill.id >= SKILL_BH && event.skill.id <= SKILL_BH + 10 && (lastSkill >= SKILL_BH && lastSkill <= SKILL_BH + 10)){
			bonusAttackId = 0;
			duration = SKILL_BH2_DURATION;
			disabSkill[SKILL_JP1] = true;
			setTimeout(function(){ disabSkill[SKILL_JP1] = false; }, duration/aspd);
			disabSkill[SKILL_DC] = true;
			setTimeout(function(){ disabSkill[SKILL_DC] = false; }, duration/aspd);
		}

*/		
		atkid[event.skill.id + bonusAttackId] = atkid_base;
		atkid_base--;
		
		dispatch.toClient("S_ACTION_STAGE", 9, {
			gameId: cid,
			loc: { x: event.loc.x, y: event.loc.y, z: event.loc.z },
			w: event.w,
			templateId: model,
			skill: event.skill.id + bonusAttackId,
			stage: 0,
			speed: aspd / 1.2 * speedMultiplier,
			id: atkid[event.skill.id + bonusAttackId],
			stage: 0,
			effectScale: 1.0, moving: false, dest: { x: 0, y: 0, Z: 0 }, target: 0, movement: [],
		});
		
		/*
		var newX;
		var newY;
		var angle = parseFloat(event.w);
		angle /= 10000;
		angle /= 1.043;
		var vvv = 748;
		newX = Math.cos(angle) * dist;
		newY = Math.sin(angle) * dist;
		
		timer[event.skill.id] = setTimeout(
			function(event){
				dispatch.toClient("S_ACTION_END", 5, {
					gameId: cid,
					loc: {
					x: collisionLocX || (event.loc.x + newX),
					y: collisionLocY || (event.loc.y + newY),
					z: collisionLocZ || (event.loc.z + 2)
					},
					w: event.w,
					templateId: model,
					skill: event.skill.id + bonusAttackId,
					type: 0,
					id: atkid[event.skill.id + bonusAttackId],
				});
			}, duration / (aspd * speedMultiplier), event);
			
		*/

		var newX;
		var newY;
		var angle = parseFloat(event.w);

		newX = Math.cos(angle) * dist;
		newY = Math.sin(angle) * dist;
		
		timer[event.skill.id] = setTimeout(
			function (event) {
				if (lastSkill == 1) { return; }
				dispatch.toClient('S_ACTION_END', 5, {
					gameId: cid,
					loc: {
						x: collisionLocX || event.loc.x + newX,
						y: collisionLocY || event.loc.y + newY,
						z: collisionLocZ || (event.loc.z + 2)
					},
					w: event.w,
					templateId: model,
					skill: event.skill.id + bonusAttackId,
					type: 0,
					id: atkid[event.skill.id + bonusAttackId],
				});
			}, duration / (aspd * speedMultiplier), event);

	}
	
	dispatch.hook('S_LOGIN', 14, (event) => {
		cid = event.gameId;
		model = event.templateId;
		player = event.name;
		job = (model - 10101) % 100;
		enabled = [JOB_NINJA].includes(job);
		
		if(DEBUG)
			console.log("NINJA!", enabled);
		
	});	
	
	dispatch.hook("C_START_SKILL", 7, (event) => {
		if(!enabled) return;
		
		if(DEBUG)
			console.log("C_START_SKILL:", event.skill.id, disabSkill[event.skill.id]);
		
		if(DISABLE) return;
		if(disabSkill[event.skill.id] == 'undefined') disabSkill[event.skill.id] = false;
		if(!disabSkill[event.skill.id]){
			
			var xzzy = event.skill.type === 1 && event.skill.id <= 999999 && BLACKLIST.indexOf(event.skill.id) === -1;
			
			if(!xzzy) return true;  //blacklisted
			if(event.skill.id == SKILL_AA) return true;  //auto attack
			if(event.skill.id == SKILL_RETALIATE) return true;  // retaliate
			
			// Retries a tope
				setTimeout(function(){dispatch.toServer('C_START_SKILL', 7, event);},25);
				setTimeout(function(){dispatch.toServer('C_START_SKILL', 7, event);},50);
				setTimeout(function(){dispatch.toServer('C_START_SKILL', 7, event);},75);
			//	setTimeout(function(){dispatch.toServer('C_START_SKILL', 7, event);},100);
			

			if(event.skill.id == SKILL_DC){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_DC_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_DC_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_DC_DURATION/aspd);
				fakeEnd(event, SKILL_DC_DURATION, SKILL_DC_DISTANCE);
			}
			
			if(event.skill.id == SKILL_DCFAST){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_DCFAST] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_DCFAST_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_DCFAST_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_DCFAST_DURATION/aspd);
				fakeEnd(event, SKILL_DCFAST_DURATION, SKILL_DCFAST_DISTANCE);
			}
			
			if(event.skill.id == SKILL_SKYFALL){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_QUICK_ATTACK] = true;
				setTimeout(function(){ disabSkill[SKILL_QUICK_ATTACK] = false; }, SKILL_SKYFALL_DURATION/aspd);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_SKYFALL_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_SKYFALL_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_SKYFALL_DURATION/aspd);
				fakeEnd(event, SKILL_SKYFALL_DURATION, SKILL_SKYFALL_DISTANCE);
			}
			
			if(event.skill.id == SKILL_COS){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_COS_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_COS_DURATION/aspd);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_COS_DURATION/aspd);
				fakeEnd(event, SKILL_COS_DURATION, SKILL_COS_DISTANCE);
			}
			
			if(event.skill.id == SKILL_JP1){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_JP1] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_JP1_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_JP1_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_JP1_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_JP1_DURATION/aspd);
				fakeEnd(event, SKILL_JP1_DURATION, SKILL_JP1_DISTANCE);
			}
			
			if(event.skill.id == SKILL_JP2){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_JP2] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_JP2_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_JP2_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_JP2_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_JP2_DURATION/aspd);
				fakeEnd(event, SKILL_JP2_DURATION, SKILL_JP2_DISTANCE);
			}
			
			/*if(event.skill.id == SKILL_LotW){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_DC_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_DC_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_DC_DURATION/aspd);
				fakeEnd()
			}*/
			
			/*
			if(event.skill.id == SKILL_BH){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_BH] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_BH_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_BH_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_BH_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_BH_DURATION/aspd);
				fakeEnd(event, SKILL_BH_DURATION, 0);
			}
			
			
			if(event.skill.id >= SKILL_BH + 1 && event.skill.id <= SKILL_BH + 10){
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_BH2_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_BH2_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_BH2_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_BH2_DURATION/aspd);
				fakeEnd(event, SKILL_BH2_DURATION, 0);
			}
			*/
			
			if(event.skill.id == SKILL_CHAKRA_THRUST){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_CHAKRA_THRUST] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_CHAKRA_THRUST_DURATION/aspd);
				disabSkill[SKILL_DCFAST] = true;
				setTimeout(function(){ disabSkill[SKILL_DCFAST] = false; }, SKILL_CHAKRA_THRUST_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_CHAKRA_THRUST_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_CHAKRA_THRUST_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_CHAKRA_THRUST_DURATION/aspd);
				fakeEnd(event, SKILL_CHAKRA_THRUST_DURATION, SKILL_CHAKRA_THRUST_DISTANCE);
			}
			
			if(event.skill.id == SKILL_DECOY){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_DECOY_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_DECOY_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_DECOY_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_DECOY_DURATION/aspd);
				fakeEnd(event, SKILL_DECOY_DURATION, 0);
			}
/*
			if(event.skill.id == SKILL_QUICK_ATTACK){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_QUICK_ATTACK] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_DCFAST] = true;
				setTimeout(function(){ disabSkill[SKILL_DCFAST] = false; }, SKILL_QUICK_ATTACK_DURATION/aspd);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_QUICK_ATTACK_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_QUICK_ATTACK_DURATION/aspd);
				disabSkill[SKILL_CHAKRA_THRUST] = true;
				setTimeout(function(){ disabSkill[SKILL_CHAKRA_THRUST] = false; }, SKILL_QUICK_ATTACK_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_QUICK_ATTACK_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_QUICK_ATTACK_DURATION/aspd);
				fakeEnd(event, SKILL_QUICK_ATTACK_DURATION, SKILL_QUICK_ATTACK_DISTANCE);
			}
			
*/	
		
			if(event.skill.id == SKILL_HBH){
				disabSkill[event.skill.id] = true;
				setTimeout(function(){ disabSkill[SKILL_HBH] = false; }, GLOBAL_LOCK_DELAY/aspd);
				disabSkill[SKILL_DCFAST] = true;
				setTimeout(function(){ disabSkill[SKILL_DCFAST] = false; }, SKILL_HBH_DURATION/aspd);
				disabSkill[SKILL_DC] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, SKILL_HBH_DURATION/aspd);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_HBH_DURATION/aspd);
				disabSkill[SKILL_QUICK_ATTACK] = true;
				setTimeout(function(){ disabSkill[SKILL_QUICK_ATTACK] = false; }, SKILL_HBH_DURATION/aspd);
				disabSkill[SKILL_CHAKRA_THRUST] = true;
				setTimeout(function(){ disabSkill[SKILL_CHAKRA_THRUST] = false; }, SKILL_HBH_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_HBH_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_HBH_DURATION/aspd);
				fakeEnd(event, SKILL_HBH_DURATION, SKILL_HBH_DISTANCE);
			}
			
		
		}
		
		lastLastSkill = lastSkill;
		lastSkill = event.skill.id;
		lastEvent = event;
		
		return false
		/*
		retVal = getReturnValue(event);
		if(DEBUG)
			console.log("Returning " + retVal, "from C_START_SKILL");
		return retVal;
		*/
	});
	
	dispatch.hook("S_ACTION_STAGE", 9, (event) => {
		if(!enabled) return;
		if(!event.skill.gameId === cid) return;
		
		let hits = (event.skill.id - lastSkill);
		//if(DEBUG){
		//	console.log("S_ACTION_STAGE:", event.skill.id, event.stage, hits);
		//	actionStart = Date.now();
		//};
		
		if(DISABLE) return;
		
		//Cancel 7th auto attack
		if(lastSkill == SKILL_AA){
			if(hits == 6 || hits == 30 || (hits > -40 && hits < -30)){
				timer = setTimeout(function(event){
					dispatch.toClient("S_ACTION_END", 5, {
					gameId: cid,
					loc: { x: event.loc.x, y: event.loc.y, z: event.loc.z },
					w: event.w,
					templateId: model,
					skill: event.skill.id,
					type: 4,
					id: atkid[event.skill.id],
					});
				}, 150, event, 0);
			}
		}

		//return getReturnValue(event);
	});
	
	dispatch.hook("S_ACTION_END", 5, (event) => {
		if(!enabled) return;
		if(!event.skill.gameId === cid) return;
		
		//if(DEBUG)
		//	console.log("S_ACTION_END:", event.skill.id, event.type, Date.now() - actionStart, "ms");

		//return getReturnValue(event);
	});
	
	dispatch.hook("S_START_COOLTIME_SKILL", 3, (event) => {
		if(!enabled) return;

		
		event.cooldown -= GLOBAL_LATENCY;
		return true;
	});
	
	dispatch.hook("S_PLAYER_STAT_UPDATE", 13, (event) => {
		if(!enabled) return;
		aspd = (event.attackSpeed + event.attackSpeedBonus) / 100;
	});
	
	dispatch.hook("C_NOTIFY_LOCATION_IN_ACTION", 4, (event) => {
		if(!enabled) return;
		
		collisionLocX = event.loc.x;
		collisionLocY = event.loc.y;
		collisionLocZ = event.loc.z;
		setTimeout(function(event){
		dispatch.toServer('C_NOTIFY_LOCATION_IN_ACTION', 4, {
			skill: event.skill.id,
			stage: event.stage,
			loc: { x: event.loc.x, y: event.loc.y, z: event.loc.z },
			w: event.w,
			});
		}, 0, event);
		setTimeout(function(event){
		dispatch.toServer('C_NOTIFY_LOCATION_IN_ACTION', 4, {
			skill: event.skill.id,
			stage: event.stage,
			loc: { x: event.loc.x, y: event.loc.y, z: event.loc.z },
			w: event.w,
			});
		}, 100, event);
		return false;
	});
	
	dispatch.hook("C_NOTIFY_LOCATION_IN_DASH", 4, (event) => {
		if(!enabled) return;
		
		collisionLocX = event.loc.x;
		collisionLocY = event.loc.y;
		collisionLocZ = event.loc.z;
		setTimeout(function(event){
			dispatch.toServer('C_NOTIFY_LOCATION_IN_DASH', 4, {
				skill: event.skill.id,
				stage: event.stage,
				loc: { x: event.loc.x, y: event.loc.y, z: event.loc.z },
				w: event.w,
				});
		}, 0, event);
		setTimeout(function(event){
			dispatch.toServer('C_NOTIFY_LOCATION_IN_DASH', 4, {
				skill: event.skill.id,
				stage: event.stage,
				loc: { x: event.loc.x, y: event.loc.y, z: event.loc.z },
				w: event.w,
				});
		}, 100, event);
		return false;
	});
	
	function getReturnValue(event){
		if(event.skill.id >= SKILL_BH && event.skill.id <= SKILL_BH + 10)
			{return false;}
		if(event.skill.id == SKILL_CHAKRA_THRUST)
			{return false;}
		if(event.skill.id == SKILL_COS)
			{return false;}
		if(event.skill.id == SKILL_DC)
			{return false;}
		if(event.skill.id == SKILL_DECOY)
			{return false;}
		if(event.skill.id == SKILL_JP1)
			{return false;}
		if(event.skill.id == SKILL_JP2)
			{return false;}
		if(event.skill.id == SKILL_SKYFALL)
			{return false;}
		return true;
	}
}
