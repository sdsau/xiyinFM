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
-- 表的结构 `song_table`
--

CREATE TABLE IF NOT EXISTS `song_table` (
  `song_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '歌曲ID',
  `song_name` varchar(50) DEFAULT NULL COMMENT '歌曲名',
  `5sing_name` varchar(50) DEFAULT NULL COMMENT '5sing歌曲名',
  `artist_id` int(10) unsigned NOT NULL COMMENT '歌手ID',
  `era` year(4) DEFAULT NULL COMMENT '年代',
  `shared` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '分享次数',
  `play_link` varchar(100) NOT NULL COMMENT '播放地址',
  `original_link` varchar(100) NOT NULL COMMENT '原始链接',
  `released_date` date NOT NULL COMMENT '发行日期',
  `song_baike` text COMMENT '歌曲百科',
  `listen_times` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '收听次数',
  `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`song_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='歌曲信息表' AUTO_INCREMENT=1142 ;
