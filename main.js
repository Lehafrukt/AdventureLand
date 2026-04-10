setInterval(start, 1000/4); // Loops every 1/4 seconds.

function start(){
    // Check if we need to heal or loot before doing anything else.

	

	if(character.rip || is_moving(character)) return;
    if (character.mp < max(character.max_mp - 300, 20)) {
    use_skill("use_mp")();
    }
    if (character.hp < character.max_hp - 400) {
    use_skill("use_hp")();
    }
	loot();
    if (locate_item("hpot1") == -1){
        smart_move
    }

	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:100,max_att:120});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!is_in_range(target))
	{
		if (can_move_to(target.x, target.y)) {
            move(target.x, target.y);
        }
        else {
            smart_move(target);
        }
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
	}

}