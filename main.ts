import { waitForDebugger } from "node:inspector";
import { MonsterEntity, MonsterKey } from "typed-adventureland";

setInterval(start, 1000 / 4); // Loops every 1/4 seconds.
setInterval(item_merge, 1000 * 10); // Check for item merging every 10 seconds

function start() {

	var debug_mode = true; // Set to true to enable debug logs
	debug_step = 0; // Reset debug step counter at the start of each loop
	if (debug_mode) debug_log();
	if (character.rip) return;

	if (character.mp < Math.max(character.max_mp - 500, 20)) {
		use_skill("use_mp");
	}
	if (character.hp < character.max_hp - 400) {
		use_skill("use_hp");
	}
	loot();

	if (is_moving(character)) return;
	if (smart.moving && smart.searching && !smart.found) return;

	
	if (debug_mode) debug_log();

	if (locate_item("hpot1") == -1 && character.gold > 10000) {
		smart_move({ to: "potions" }).then(() => { // this will find a path to the potion merchant outside the bank on map 'main'
			buy("hpot1", 100); // or hpot1  100 = quantity to buy
		}).catch((err) => {
			game_log("Failed to move to potions merchant:", err);
		});
	}
	if (debug_mode) debug_log();

	if (locate_item("mpot1") == -1 && character.gold > 10000) {
		smart_move({ to: "potions" }).then(() => { // this will find a path to the potion merchant outside the bank on map 'main'
			buy("mpot1", 100); // or mpot1  100 = quantity to buy
		}).catch((err) => {
			game_log("Failed to move to potions merchant:", err);
		});
	}
	if (debug_mode) debug_log();

	var mtype : MonsterKey = "bee";
	var bee = get_nearest_monster({ type: mtype });
	if (!bee || !is_in_range(bee)) {
		smart_move({ to: mtype }).catch((err) => {
			game_log("Failed to move to " + mtype + ":", err);
		});
		
	}
	if (debug_mode) debug_log();

	var target = get_targeted_monster();
	if (!target) {
		target = get_nearest_monster({ type: mtype });
		if (target) change_target(target);
		else {
			set_message("No Monsters");
			return;
		}
	}
	if (debug_mode) debug_log();

	if (!is_in_range(target)) {
		if (can_move_to(target.x, target.y)) {
			move(target.x, target.y);
		}
		else {
			smart_move(target);
		}
	}
	else if (can_attack(target)) {
		set_message("Attacking");
		attack(target);
	}
	if (debug_mode) debug_log();

}

function item_merge() {
	for (let i = 0; i < character.items.length; i++) {
		if (character.items[i]) {
			let item_name = character.items[i].name;
			let item_def = G.items[item_name];
			if (item_def.s) {
				let item_count = quantity(item_name);
				for (let j = i + 1; j < character.items.length; j++) {
					if (character.items[j] && character.items[j].name == item_name) {
						swap(i, j);
					}
				}
			}
		}
		
	}
	// Implementation for merging items
}

let debug_step = 0; // Step counter for debug logs
function debug_log() {
	game_log(debug_step);
	debug_step++
	// Implementation for debug logging based on the step parameter
}
