CREATE TABLE `inquiries` (
	`reference` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(180) NOT NULL,
	`phone` varchar(30) NOT NULL DEFAULT '',
	`service` varchar(160) NOT NULL,
	`message` text NOT NULL,
	`consent` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiries_reference` PRIMARY KEY(`reference`)
);
