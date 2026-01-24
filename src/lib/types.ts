export interface RuleViolation {
  lineNumber: string;
  lineContent: string;
  rule: string;
  suggestion: string;
}

export type Report = Record<string, RuleViolation[]>;
