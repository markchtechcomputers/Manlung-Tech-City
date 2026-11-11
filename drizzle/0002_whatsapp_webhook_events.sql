CREATE TABLE `whatsapp_webhook_events` (
	`messageKey` varchar(64) NOT NULL,
	`processedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatsapp_webhook_events_messageKey` PRIMARY KEY(`messageKey`)
);
