-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2017 年 05 月 30 日 08:05
-- 服务器版本: 5.5.24-log
-- PHP 版本: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `xiyinfm`
--

-- --------------------------------------------------------

--
-- 表的结构 `artist_table`
--

CREATE TABLE IF NOT EXISTS `artist_table` (
  `artist_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '歌手id',
  `artist_name` varchar(50) NOT NULL COMMENT '歌手名',
  `head_link` varchar(100) DEFAULT NULL COMMENT '头像地址',
  `homepage` varchar(100) DEFAULT NULL COMMENT '歌手主页',
  `weibo_link` varchar(100) DEFAULT NULL COMMENT '微博地址',
  `artist_type` smallint(5) unsigned DEFAULT NULL COMMENT ' 类别',
  `artist_baike` text COMMENT '歌手百科',
  PRIMARY KEY (`artist_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='歌手信息表' AUTO_INCREMENT=11 ;
