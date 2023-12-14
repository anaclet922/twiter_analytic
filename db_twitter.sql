-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2023 at 10:56 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_twitter`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tweets`
--

CREATE TABLE `tbl_tweets` (
  `id` bigint(11) NOT NULL,
  `id_str` varchar(11) NOT NULL,
  `text` varchar(280) NOT NULL,
  `source` text NOT NULL,
  `truncated` tinyint(1) NOT NULL DEFAULT 0,
  `in_reply_to_status_id` bigint(11) DEFAULT NULL,
  `in_reply_to_status_id_str` varchar(11) DEFAULT NULL,
  `in_reply_to_user_id` bigint(11) DEFAULT NULL,
  `in_reply_to_user_id_str` varchar(11) DEFAULT NULL,
  `in_reply_to_screen_name` varchar(128) DEFAULT NULL,
  `user` bigint(11) NOT NULL,
  `geo` varchar(50) DEFAULT NULL,
  `coordinates` varchar(50) DEFAULT NULL,
  `place` varchar(255) DEFAULT NULL,
  `contributors` varchar(255) DEFAULT NULL,
  `retweet_count` bit(1) NOT NULL,
  `favorite_count` bit(1) NOT NULL,
  `entities` bigint(11) DEFAULT NULL,
  `favorited` tinyint(1) NOT NULL DEFAULT 0,
  `retweeted` tinyint(1) NOT NULL DEFAULT 0,
  `possibly_sensitive` tinyint(1) NOT NULL DEFAULT 0,
  `filter_level` varchar(6) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` bigint(11) NOT NULL,
  `id_str` bigint(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `screen_name` varchar(128) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `url` text DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `protected` tinyint(1) NOT NULL DEFAULT 0,
  `followers_count` int(11) NOT NULL,
  `friends_count` int(11) NOT NULL,
  `listed_count` bit(1) NOT NULL,
  `favourites_count` bit(1) NOT NULL,
  `utc_offset` varchar(30) DEFAULT NULL,
  `time_zone` varchar(30) DEFAULT NULL,
  `geo_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `statuses_count` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `contributors_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `is_translator` tinyint(1) NOT NULL DEFAULT 0,
  `is_translation_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `profile_background_color` varchar(6) NOT NULL,
  `profile_background_image_url` text NOT NULL,
  `profile_background_image_url_https` text NOT NULL,
  `profile_background_tile` tinyint(1) NOT NULL DEFAULT 0,
  `profile_image_url` text NOT NULL,
  `profile_image_url_https` text NOT NULL,
  `profile_link_color` varchar(6) NOT NULL,
  `profile_sidebar_border_color` varchar(6) NOT NULL,
  `profile_sidebar_fill_color` varchar(6) NOT NULL,
  `profile_text_color` int(11) NOT NULL,
  `profile_use_background_image` tinyint(1) NOT NULL DEFAULT 0,
  `default_profile` tinyint(1) NOT NULL DEFAULT 0,
  `default_profile_image` tinyint(1) NOT NULL DEFAULT 0,
  `following` varchar(30) DEFAULT NULL,
  `follow_request_sent` varchar(30) DEFAULT NULL,
  `notifications` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_tweets`
--
ALTER TABLE `tbl_tweets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
