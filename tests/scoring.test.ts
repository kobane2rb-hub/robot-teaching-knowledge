import { describe, it, expect } from "vitest";
import { calcScore, calcLevel } from "../lib/scoring";

describe("calcScore", () => {
  it("バッフィ0・MidIn無・MidOut無・合流None → 0+0+0+3=3点", () => {
    expect(calcScore({ bufferCount: 0, midIn: false, midOut: false, mergeComplex: "None" })).toBe(3);
  });

  it("バッフィ2・MidIn有・MidOut有・合流Complex → 2*2+3+2+2=11点", () => {
    expect(calcScore({ bufferCount: 2, midIn: true, midOut: true, mergeComplex: "Complex" })).toBe(11);
  });

  it("バッフィ3・MidIn無・MidOut無・合流Simple → 3*2+0+0+0=6点", () => {
    expect(calcScore({ bufferCount: 3, midIn: false, midOut: false, mergeComplex: "Simple" })).toBe(6);
  });

  it("バッフィ3・MidIn有・MidOut有・合流None → 3*2+3+2+3=14点", () => {
    expect(calcScore({ bufferCount: 3, midIn: true, midOut: true, mergeComplex: "None" })).toBe(14);
  });
});

describe("calcLevel", () => {
  it("スコア0 → Level A", () => expect(calcLevel(0)).toBe("A"));
  it("スコア6 → Level A", () => expect(calcLevel(6)).toBe("A"));
  it("スコア7 → Level B", () => expect(calcLevel(7)).toBe("B"));
  it("スコア11 → Level B", () => expect(calcLevel(11)).toBe("B"));
  it("スコア12 → Level C", () => expect(calcLevel(12)).toBe("C"));
  it("スコア20 → Level C", () => expect(calcLevel(20)).toBe("C"));
});
