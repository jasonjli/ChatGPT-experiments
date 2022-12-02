// Define a type alias for a propositional variable.
type Var = string;

// Define a type alias for a propositional literal.
// A literal is either a variable or its negation.
type Lit = [Var, boolean];

// Define a type alias for a clause.
// A clause is a disjunction of literals.
type Clause = Lit[];

// Define a type alias for a formula in conjunctive normal form (CNF).
// A formula in CNF is a conjunction of clauses.
type CNFFormula = Clause[];

// Define a function that checks whether a given propositional variable assignment
// satisfies a given formula in CNF.
function isSatisfied(formula: CNFFormula, assignment: Map<Var, boolean>): boolean {
  // Check whether the assignment satisfies each clause in the formula.
  for (const clause of formula) {
    // Check whether the assignment satisfies at least one literal in the clause.
    let clauseSatisfied = false;
    for (const literal of clause) {
      const [varName, negated] = literal;
      const varValue = assignment.get(varName);
      if (varValue !== undefined && varValue === !negated) {
        // The literal is satisfied by the assignment.
        clauseSatisfied = true;
        break;
      }
    }

    // If the assignment does not satisfy any literal in the clause,
    // the formula is not satisfied by the assignment.
    if (!clauseSatisfied) return false;
  }

  // If the assignment satisfies every clause in the formula,
  // the formula is satisfied by the assignment.
  return true;
}

// Define a function that finds a satisfying assignment for a given formula in CNF,
// if one exists. If no satisfying assignment exists, the function returns null.
function findSatisfyingAssignment(formula: CNFFormula): Map<Var, boolean> | null {
  // Get the set of all propositional variables in the formula.
  const vars = new Set<Var>();
  for (const clause of formula) {
    for (const literal of clause) {
      const [varName] = literal;
      vars.add(varName);
    }
  }

  // Iterate over all possible assignments of propositional variables.
  for (let i = 0; i < (1 << vars.size); i++) {
    // Create a new assignment.
    const assignment = new Map<Var, boolean>();

    // Assign the variables in the formula according to the current iteration.
    let j = 0;
    for (const varName of vars) {
      assignment.set(varName, (i & (1 << j)) !== 0);
      j++;
    }

    // Check whether the assignment satisfies the formula.
    if (isSatisfied(formula, assignment)) {
      // If the assignment satisfies the formula, return it.
      return assignment;
    }
  }

  // If no satisfying assignment was found, return null.
  return null;
}

// Define a sample formula in CNF.
const formula: CNFFormula = [
  // (a or b
