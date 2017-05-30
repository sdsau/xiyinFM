<?php
/**
 *
 */
class Db {

	// 当前SQL指令
	protected $queryStr = '';
	// 最后插入ID
	protected $lastInsID = null;
	// 返回或者影响记录数
	protected $numRows = 0;
	// 返回字段数
	protected $numCols = 0;
	// 事务指令数
	protected $transTimes = 0;
	// 错误信息
	protected $error = '';
	// 当前连接ID
	protected $linkID = null;
	// 当前查询ID
	protected $queryID = null;
	// 是否已经连接数据库
	protected $connected = false;
	// 数据库连接参数配置
	protected $config = array('username' => DB_USER, 'password' => DB_PASSWORD, 'hostname' => DB_HOST, 'hostport' => DB_PORT, 'database' => DB_NAME);

	public function __construct($config = '') {
		if (!empty($config))
			$this -> config = $config;
	}

	public function __destruct() {
		// 关闭连接
		$this -> close();
	}

	/**
	 +----------------------------------------------------------
	 * 初始化数据库连接
	 +----------------------------------------------------------
	 * @access protected
	 +----------------------------------------------------------
	 */
	protected function initConnect() {

		if (!$this -> connected)
			$this -> linkID = $this -> connect();
	}

	/**
	 +----------------------------------------------------------
	 * 连接数据库方法
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 */
	public function connect($config = '') {
		if (empty($config))
			$config = $this -> config;
		$this -> linkID = new mysqli($config['hostname'], $config['username'], $config['password'], $config['database'], $config['hostport']);
		if (mysqli_connect_errno())
			die('Connect Error: ' . mysqli_connect_error());
		$this -> connected = true;
		return $this -> linkID;
	}

	/**
	 +----------------------------------------------------------
	 * 关闭数据库
	 +----------------------------------------------------------
	 * @static
	 * @access public
	 +----------------------------------------------------------
	 */
	function close() {
		if (!empty($this -> queryID))
			$this -> queryID -> free_result();
		if ($this -> linkID) {
			$this -> linkID -> close();
		}
		$this -> linkID = 0;
	}

	/**
	 +----------------------------------------------------------
	 * 释放查询结果
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 */
	public function free() {
		mysqli_free_result($this -> queryID);
		$this -> queryID = 0;
	}

	/**
	 +----------------------------------------------------------
	 * 执行查询 返回数据集
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @param string $str  sql指令
	 +----------------------------------------------------------
	 * @return mixed
	 +----------------------------------------------------------
	 */
	public function query($str) {
		$this -> initConnect();
		if (!$this -> linkID)
			return false;
		$this -> queryStr = $str;
		//释放前次的查询结果
		if ($this -> queryID)
			$this -> free();
		$this -> queryID = $this -> linkID -> query($str);
		if (false === $this -> queryID) {
			$this -> error();
			return false;
		} else {
			$this -> numRows = $this -> queryID -> num_rows;
			$this -> numCols = $this -> queryID -> field_count;
			return $this -> getAll();
		}
	}

	/**
	 +----------------------------------------------------------
	 * 执行语句
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @param string $str  sql指令
	 +----------------------------------------------------------
	 * @return integer
	 +----------------------------------------------------------
	 * @throws ThinkExecption
	 +----------------------------------------------------------
	 */
	public function execute($str) {
		$this -> initConnect();
		if (!$this -> linkID)
			return false;
		$this -> queryStr = $str;
		//释放前次的查询结果
		if ($this -> queryID)
			$this -> free();

		$result = $this -> linkID -> query($str);

		if (false === $result) {
			$this -> error();
			return false;
		} else {
			$this -> numRows = $this -> linkID -> affected_rows;
			$this -> lastInsID = $this -> linkID -> insert_id;
			return $this -> numRows;
		}
	}

	/**
	 +----------------------------------------------------------
	 * 启动事务
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @return void
	 +----------------------------------------------------------
	 */
	public function startTrans() {
		$this -> initConnect();
		//数据rollback 支持
		if ($this -> transTimes == 0) {
			$this -> linkID -> autocommit(false);
		}
		$this -> transTimes++;
		return;
	}

	/**
	 +----------------------------------------------------------
	 * 用于非自动提交状态下面的查询提交
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @return boolen
	 +----------------------------------------------------------
	 * @throws ThinkExecption
	 +----------------------------------------------------------
	 */
	public function commit() {
		if ($this -> transTimes > 0) {
			$result = $this -> linkID -> commit();
			$this -> linkID -> autocommit(true);
			$this -> transTimes = 0;
			if (!$result) {
				throw_exception($this -> error());
			}
		}
		return true;
	}

	/**
	 +----------------------------------------------------------
	 * 事务回滚
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @return boolen
	 +----------------------------------------------------------
	 * @throws ThinkExecption
	 +----------------------------------------------------------
	 */
	public function rollback() {
		if ($this -> transTimes > 0) {
			$result = $this -> linkID -> rollback();
			$this -> transTimes = 0;
			if (!$result) {
				throw_exception($this -> error());
			}
		}
		return true;
	}

	/**
	 +----------------------------------------------------------
	 * 获得所有的查询数据
	 +----------------------------------------------------------
	 * @access private
	 +----------------------------------------------------------
	 * @param string $sql  sql语句
	 +----------------------------------------------------------
	 * @return array
	 +----------------------------------------------------------
	 */
	private function getAll() {
		//返回数据集
		$result = array();
		if ($this -> numRows > 0) {
			//返回数据集
			for ($i = 0; $i < $this -> numRows; $i++) {
				$result[$i] = $this -> queryID -> fetch_assoc();
			}
			$this -> queryID -> data_seek(0);
		}
		return $result;
	}

	/**
	 +----------------------------------------------------------
	 * 取得数据表的字段信息
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @throws ThinkExecption
	 +----------------------------------------------------------
	 */
	function getFields($tableName) {
		$result = $this -> query('SHOW COLUMNS FROM `' . $tableName . '`');
		$info = array();
		if ($result) {
			foreach ($result as $key => $val) {
				$info[$val['Field']] = array('name' => $val['Field'], 'type' => $val['Type'], 'notnull' => (bool)($val['Null'] === ''), // not null is empty, null is yes
				'default' => $val['Default'], 'primary' => (strtolower($val['Key']) == 'pri'), 'autoinc' => (strtolower($val['Extra']) == 'auto_increment'), );
			}
		}
		return $info;
	}

	/**
	 +----------------------------------------------------------
	 * 取得数据表的字段信息
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @throws ThinkExecption
	 +----------------------------------------------------------
	 */
	function getTables($dbName = '') {
		$sql = !empty($dbName) ? 'SHOW TABLES FROM ' . $dbName : 'SHOW TABLES ';
		$result = $this -> query($sql);
		$info = array();
		if ($result) {
			foreach ($result as $key => $val) {
				$info[$key] = current($val);
			}
		}
		return $info;
	}

	/**
	 +----------------------------------------------------------
	 * 数据库错误信息
	 * 并显示当前的SQL语句
	 +----------------------------------------------------------
	 * @static
	 * @access public
	 +----------------------------------------------------------
	 * @return string
	 +----------------------------------------------------------
	 */
	function error() {
		$this -> error = $this -> linkID -> error;
		if ('' != $this -> queryStr) {
			$this -> error .= "\n [ SQL语句 ] : " . $this -> queryStr;
		}
		return $this -> error;
	}

	/**
	 +----------------------------------------------------------
	 * SQL指令安全过滤
	 +----------------------------------------------------------
	 * @static
	 * @access public
	 +----------------------------------------------------------
	 * @param string $str  SQL指令
	 +----------------------------------------------------------
	 * @return string
	 +----------------------------------------------------------
	 */
	function escape_string($str) {
		if ($this -> linkID) {
			return $this -> linkID -> real_escape_string($str);
		} else {
			return addslashes($str);
		}
	}

	/**
	 +----------------------------------------------------------
	 * 获取最近一次查询的sql语句
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @return string
	 +----------------------------------------------------------
	 */
	public function getLastSql() {
		return $this -> queryStr;
	}

	/**
	 +----------------------------------------------------------
	 * 获取最近的错误信息
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @return string
	 +----------------------------------------------------------
	 */
	public function getError() {
		return $this -> error;
	}

	/**
	 +----------------------------------------------------------
	 * 获取最后插入ID
	 +----------------------------------------------------------
	 * @access public
	 +----------------------------------------------------------
	 * @return string
	 +----------------------------------------------------------
	 */
	public function getLastInsID() {
		return $this -> lastInsID;
	}

}
?>