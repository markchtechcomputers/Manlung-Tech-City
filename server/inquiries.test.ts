import { describe, expect, it, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";

const mocks = vi.hoisted(() => ({
  values: vi.fn().mockResolvedValue(undefined),
  notifyOwner: vi.fn().mockResolvedValue(true),
  available: true,
}));
vi.mock("./db", () => ({
  getDb: async () =>
    mocks.available ? { insert: () => ({ values: mocks.values }) } : null,
}));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));
import { inquirySchema, registerLeadRoutes } from "./leadRoutes";

const valid = {
  name: "Example Person",
  email: "test@example.invalid",
  phone: "+254700000000",
  service: "Cybersecurity support",
  message: "Please help me explore a security training course.",
  consent: true,
  website: "",
};
async function request(body: unknown) {
  const app = express();
  app.use(express.json());
  registerLeadRoutes(app);
  const server: Server = await new Promise(resolve => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Test listener unavailable");
  try {
    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/inquiries`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    return { status: response.status, body: await response.json() };
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close(error => (error ? reject(error) : resolve()))
    );
  }
}

describe("Manlung inquiry capture", () => {
  it("validates and trims real required inputs", () => {
    const parsed = inquirySchema.parse({
      ...valid,
      name: "  Example Person  ",
    });
    expect(parsed.name).toBe("Example Person");
  });
  it("rejects malformed email, blank names, and missing consent", () => {
    expect(inquirySchema.safeParse({ ...valid, email: "wrong" }).success).toBe(
      false
    );
    expect(inquirySchema.safeParse({ ...valid, name: "   " }).success).toBe(
      false
    );
    expect(inquirySchema.safeParse({ ...valid, consent: false }).success).toBe(
      false
    );
  });
  it("saves validated leads before returning a reference", async () => {
    const result = await request({
      ...valid,
      email: "valid-lead@example.invalid",
    });
    expect(result.status).toBe(201);
    expect(result.body.reference).toMatch(/^[a-f0-9-]{36}$/);
    expect(mocks.values).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "valid-lead@example.invalid",
        consent: true,
      })
    );
  });
  it("rejects honeypot submissions without persisting them", async () => {
    const before = mocks.values.mock.calls.length;
    const result = await request({ ...valid, website: "spam" });
    expect(result.status).toBe(400);
    expect(mocks.values.mock.calls.length).toBe(before);
  });
  it("never reports success when persistence fails", async () => {
    mocks.available = false;
    try {
      const result = await request({
        ...valid,
        email: "db-failure@example.invalid",
      });
      expect(result.status).toBe(503);
      expect(result.body.success).toBeUndefined();
    } finally {
      mocks.available = true;
    }
  });
});
