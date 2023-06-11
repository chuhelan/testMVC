USE test;
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `userCode` varchar(15) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `RealName` varchar(20) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `sex` char(1) DEFAULT NULL,
  `session` varchar(40) DEFAULT NULL,
  `sessionDie` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`userCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
