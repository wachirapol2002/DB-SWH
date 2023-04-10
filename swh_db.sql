-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2023 at 11:30 PM
-- Server version: 8.0.32
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `swh_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `username` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'ชื่อผู้ใช้งาน',
  `password` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'รหัสผ่าน',
  `permission` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'ระดับสิทธิ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางเก็บ Account';

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`username`, `password`, `permission`) VALUES
('admin', 'password', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสความคิดเห็น',
  `requirement_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสความต้องการ',
  `username` varchar(30) NOT NULL COMMENT 'ชื่อผู้ใช้งาน',
  `message` varchar(300) NOT NULL COMMENT 'ข้อความ',
  `comment_timestamp` timestamp NOT NULL COMMENT 'บันทึกเวลา'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางความคิดเห็น';

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสพนักงาน',
  `first_name` varchar(30) NOT NULL COMMENT 'ชื่อ',
  `last_name` varchar(30) NOT NULL COMMENT 'นามสกุล',
  `email` varchar(50) NOT NULL COMMENT 'อีเมล',
  `phone_number` varchar(10) NOT NULL COMMENT 'หมายเลขโทรศัพท์',
  `job` varchar(30) NOT NULL COMMENT 'ตำแหน่งงาน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางพนักงาน';

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสโครงการ',
  `requirement_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสความต้องการ',
  `team_name` varchar(30) NOT NULL COMMENT 'ชื่อทีมที่รับผิดชอบ',
  `deadline` date NOT NULL COMMENT 'กำหนดการ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางโครงการ';

-- --------------------------------------------------------

--
-- Table structure for table `project_status`
--

CREATE TABLE `project_status` (
  `project_status_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสสถานะโครงการ',
  `project_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสโครงการ',
  `status_message` varchar(30) NOT NULL COMMENT 'ข้อความสถานะ',
  `status_timestamp` timestamp NOT NULL COMMENT 'บันทึกเวลา'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางเก็บสถานะโครงการ';

-- --------------------------------------------------------

--
-- Table structure for table `requirements`
--

CREATE TABLE `requirements` (
  `requirement_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสความต้องการ',
  `username` varchar(30) NOT NULL COMMENT 'ชื่อผู้ใช้งาน',
  `projectname` varchar(30) NOT NULL COMMENT 'ชื่อโครงการ',
  `detail` varchar(5000) NOT NULL COMMENT 'รายละเอียดโครงการ',
  `budget` varchar(30) NOT NULL COMMENT 'งบประมาณ',
  `contact` varchar(30) NOT NULL COMMENT 'ช่องทางติดต่อ',
  `require_timestamp` timestamp NOT NULL COMMENT 'บันทึกเวลา',
  `requirement_status` varchar(30) NOT NULL COMMENT 'สถานะ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางความต้องการ';

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `team_name` varchar(30) NOT NULL COMMENT 'ชื่อทีม',
  `total_members` int NOT NULL COMMENT 'จำนวนสมาชิก',
  `total_projects` int NOT NULL COMMENT 'จำนวนโครงการที่รับผิดชอบ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางทีม';

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `team_members_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสสมาชิกทีม',
  `team_name` varchar(30) NOT NULL COMMENT 'ชื่อทีม',
  `employee_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสพนักงาน',
  `role` varchar(30) NOT NULL COMMENT 'บทบาทในทีม'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ตารางสมาชิกทีม';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `comments_accounts` (`username`),
  ADD KEY `comments_requirements` (`requirement_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `projects_requirements` (`requirement_id`),
  ADD KEY `projects_teams` (`team_name`);

--
-- Indexes for table `project_status`
--
ALTER TABLE `project_status`
  ADD PRIMARY KEY (`project_status_id`),
  ADD KEY `project_status` (`project_id`);

--
-- Indexes for table `requirements`
--
ALTER TABLE `requirements`
  ADD PRIMARY KEY (`requirement_id`),
  ADD KEY `requirements_username` (`username`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_name`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`team_members_id`),
  ADD KEY `team_members_teams` (`team_name`),
  ADD KEY `team_members_employees` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสความคิดเห็น';

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสพนักงาน';

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสโครงการ';

--
-- AUTO_INCREMENT for table `project_status`
--
ALTER TABLE `project_status`
  MODIFY `project_status_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสสถานะโครงการ';

--
-- AUTO_INCREMENT for table `requirements`
--
ALTER TABLE `requirements`
  MODIFY `requirement_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสความต้องการ';

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `team_members_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสสมาชิกทีม';

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_accounts` FOREIGN KEY (`username`) REFERENCES `accounts` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_requirements` FOREIGN KEY (`requirement_id`) REFERENCES `requirements` (`requirement_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_requirements` FOREIGN KEY (`requirement_id`) REFERENCES `requirements` (`requirement_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_teams` FOREIGN KEY (`team_name`) REFERENCES `teams` (`team_name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_status`
--
ALTER TABLE `project_status`
  ADD CONSTRAINT `project_status` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `requirements`
--
ALTER TABLE `requirements`
  ADD CONSTRAINT `requirements_username` FOREIGN KEY (`username`) REFERENCES `accounts` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `team_members_teams` FOREIGN KEY (`team_name`) REFERENCES `teams` (`team_name`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
