import { describe, expect, it } from "vitest";
import { businessFields, workspaceOptions } from "../client/src/contexts/BusinessFieldContext";
import { balanceDue, initialProjects } from "../client/src/lib/projectData";

describe("Workspace architecture", () => {
  it("exposes exactly the four prompt-defined workspaces in Solar-first order", () => {
    expect(workspaceOptions.map((workspace) => workspace.label)).toEqual(["Solar Energy", "Irrigation", "Iron Work", "Furniture"]);
    expect(workspaceOptions.map((workspace) => workspace.id)).toEqual(["solar", "irrigation", "steel", "furniture"]);
    expect(businessFields.find((workspace) => workspace.id === "solar")?.label).toBe("Solar Energy");
  });
});

describe("Project data contract", () => {
  it("does not ship demo projects in the Supabase-first application", () => {
    expect(initialProjects).toEqual([]);
  });

  it("derives a project balance from the advance and payment ledger", () => {
    const project = {
      id: "project-test",
      name: "Test project",
      companyId: "solar",
      customer: "Test customer",
      status: "Planning" as const,
      budget: 100000,
      contractValue: 100000,
      advanceReceived: 25000,
      balancePayments: [{ id: "payment-1", projectId: "project-test", amount: 15000, date: "2026-01-01", method: "Bank", note: "Test" }],
      startDate: "2026-01-01",
      targetDate: "2026-12-31",
      progress: 0,
    };
    expect(balanceDue(project)).toBe(60000);
  });
});
