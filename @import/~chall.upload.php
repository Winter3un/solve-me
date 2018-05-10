<?php
	if(isset($_POST['title'],$_POST['category'],$_POST['flag'],$_POST['score'], $_POST['contents'])){

		# not logged in
		is_login() or output(['status' => 'l']);

		//is_chall_link($_POST['challenge']) or output(['status' => 'x']); # valid challenge
		is_writeup_contents($_POST['contents']) or output(['status' => 'p']); # valid contents
		$_POST['flag'] = preg_replace('/^flag\{(.*)\}$/is', '${1}', $_POST['flag']);
		$_POST['flag'] = secure_hash($_POST['flag']);
		#check exist challenge
		$p = $pdo->prepare("
			SELECT
				`no`
			FROM
				`{$db_prefix}_problem`
			WHERE
				REPLACE(LOWER(`title`), ' ', '_')=:link
			LIMIT
				1
		");
		$p->bindParam(':link', $_POST['title']);
		$p->execute();
		$prob = $p->fetch(PDO::FETCH_ASSOC);
		if($prob)output(['status' => 'e']);

		# check permisson
		if(!is_admin()){
			$p = $pdo->prepare("
				SELECT
					1
				FROM
					`{$db_prefix}_authlog`
				WHERE
					`problem_no`=:problem_no AND
					`username`=:username
				LIMIT
					1
			");
			$p->bindParam(':problem_no', $prob['no']);
			$p->bindParam(':username', $_SESSION['username']);
			$p->execute();
			$p->fetch(PDO::FETCH_ASSOC) or output(['status' => 'p']);
		}
 
		# upload chall
		$p = $pdo->prepare("
			INSERT INTO
			`{$db_prefix}_problem`
			(
				`no`,
				`category`,
				`title`,
				`contents`,
				`score`,
				`flag`,
				`author`,
				`register_time`
			)
			VALUES
			(
				NULL,
				:category,
				:title,
				:contents,
				:score,
				:flag,
				:author,
				CURRENT_TIMESTAMP
			)
		");
		$p->bindParam(':category', $_POST['category']);
		$p->bindParam(':title', $_POST['title']);
		$p->bindParam(':contents', $_POST['contents']);
		$p->bindParam(':score', $_POST['score']);
		$p->bindParam(':flag', $_POST['flag']);
		$p->bindParam(':author', $_SESSION['username']);
		$p->execute();
/*
		# get no of written writeup
		$p = $pdo->prepare("
			SELECT
				`no`
			FROM
				`{$db_prefix}_writeup`
			ORDER BY
				`no` DESC
			LIMIT
				1
		");
		$p->execute();
		$writeup = $p->fetch(PDO::FETCH_ASSOC) or output(['status' => 'x']);
 */
		# success
		output([
			'status' => 'o'/*,
			'no' => $writeup['no']*/
		]);
	}
