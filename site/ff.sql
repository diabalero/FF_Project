-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 29, 2016 at 11:41 PM
-- Server version: 5.6.13
-- PHP Version: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ff`
--
CREATE DATABASE IF NOT EXISTS `ff` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ff`;

-- --------------------------------------------------------

--
-- Table structure for table `t_buffs`
--

CREATE TABLE IF NOT EXISTS `t_buffs` (
  `buff_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` blob NOT NULL,
  PRIMARY KEY (`buff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `t_leagues`
--

CREATE TABLE IF NOT EXISTS `t_leagues` (
  `league_id` int(11) NOT NULL AUTO_INCREMENT,
  `league_type` tinyint(4) NOT NULL,
  `league_name` varchar(50) NOT NULL,
  PRIMARY KEY (`league_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `t_league_player_upgrades`
--

CREATE TABLE IF NOT EXISTS `t_league_player_upgrades` (
  `league_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  PRIMARY KEY (`league_id`,`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_owners`
--

CREATE TABLE IF NOT EXISTS `t_owners` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `t_players`
--

CREATE TABLE IF NOT EXISTS `t_players` (
  `player_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `position` varchar(4) NOT NULL,
  `teamAbbr` varchar(5) NOT NULL,
  `gsisPlayerId` varchar(50) NOT NULL COMMENT 'for future use',
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_player_stats`
--

CREATE TABLE IF NOT EXISTS `t_player_stats` (
  `player_id` int(11) NOT NULL,
  `stat_id` varchar(25) NOT NULL,
  `season` smallint(6) NOT NULL,
  `week` tinyint(4) NOT NULL,
  `value` smallint(6) NOT NULL,
  PRIMARY KEY (`player_id`,`stat_id`,`season`,`week`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_stats`
--

CREATE TABLE IF NOT EXISTS `t_stats` (
  `stat_id` tinyint(4) NOT NULL,
  `abbr` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `shortname` varchar(25) NOT NULL,
  PRIMARY KEY (`stat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `t_teams`
--

CREATE TABLE IF NOT EXISTS `t_teams` (
  `team_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `team_name` varchar(50) NOT NULL,
  `league_id` int(11) NOT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `t_team_buffs`
--

CREATE TABLE IF NOT EXISTS `t_team_buffs` (
  `team_id` int(11) NOT NULL,
  `buff_id` int(11) NOT NULL,
  `quantity` tinyint(4) NOT NULL,
  PRIMARY KEY (`team_id`,`buff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
