// utils/formulaParser.js
export function extractDependencies(formula) {
  const regex = /([A-Z]+\d+)/g;
  const matches = formula.match(regex);
  return matches || [];
}
