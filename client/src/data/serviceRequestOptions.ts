import { services } from "./services";

export const allServiceRequestOptions = Array.from(
  new Set(
    services.flatMap(service => [
      `${service.title} — General inquiry`,
      ...service.offerings.map(offering => `${service.title} — ${offering}`),
    ])
  )
);
