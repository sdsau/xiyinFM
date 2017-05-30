-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2017 年 05 月 30 日 08:06
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
-- 表的结构 `channel_song_table`
--

CREATE TABLE IF NOT EXISTS `channel_song_table` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表ID',
  `song_id` int(10) unsigned NOT NULL COMMENT '歌曲ID',
  `channel_id` int(10) unsigned NOT NULL COMMENT '频道ID',
  `weight` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '权重系数',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='频道歌曲关系表' AUTO_INCREMENT=2858 ;
