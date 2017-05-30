<?php
/**
 * 功能类的抽象类，用于统一入口
 */
abstract class App {

	abstract protected function Execute();

	public function Run() {
		$this->Execute();
	}
	
	public static function factory($type) {
		if (include_once($type . '.class.php')) {
			$classname = $type;
			return new $classname;
		} else {
			return null;
		}
	}

	public static function G($type) {
		return self::factory($type);
	}
}
