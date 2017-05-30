-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2017 年 05 月 30 日 08:07
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
-- 表的结构 `channel_table`
--

CREATE TABLE IF NOT EXISTS `channel_table` (
  `channel_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '频道ID',
  `channel_type` enum('标签','歌手','榜单') NOT NULL COMMENT '频道类别',
  `channel_name` varchar(20) NOT NULL COMMENT '频道名',
  `order` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '顺序',
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`channel_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='频道信息表' AUTO_INCREMENT=27 ;
