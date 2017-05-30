<?php
include_once '../config.php';

$yyid = $_POST["id"];
$yyimid = $_POST["imid"];
$yyname_gbk = $_POST["name"];
$yyname = mb_convert_encoding($yyname_gbk,"UTF-8","GBK");

$profile['id'] = $yyid;
$profile['imid'] = $yyimid;
$profile['name'] = $yyname;

if (Login::login('duowan',$yyid,'@YY',$yyname,json_encode($profile))) {
	header("Location: /");
	/*echo "<pre>";
	print_r($_SESSION);
	echo "yyid=";
	print_r($yyid);
	echo "\n";
	print_r($yyimid);
	echo "\n";
	print_r($yyname);
	echo "\n";
	echo "</pre>"; */
} else {
	echo "系统出错了……";	
}
exit;
?>
