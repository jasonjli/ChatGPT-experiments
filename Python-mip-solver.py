# Import the required modules.
from typing import List, Tuple

# Import the `cplex` module from the `cplex` package.
from cplex import Cplex

# Define a function that solves a given MIP.
def solve_mip(objective: List[Tuple[float, str]],
              constraints: List[Tuple[List[Tuple[float, str]], str, float]]) -> Tuple[float, Dict[str, float]]:
  # Create a new CPLEX instance.
  mip = Cplex()

  # Add the variables to the model.
  mip.variables.add(names=[varName for _, varName in objective],
                    types=["I" if coef != 0 else "C" for coef, _ in objective])

  # Set the objective function.
  mip.objective.set_sense(mip.objective.sense.maximize)
  mip.objective.set_linear([(varName, coef) for coef, varName in objective])

  # Add the constraints to the model.
  for i, (constraint, sense, rhs) in enumerate(constraints):
    mip.linear_constraints.add(lin_expr=[(varName, coef) for coef, varName in constraint],
                               senses=[sense],
                               rhs=[rhs],
                               names=["c" + str(i)])

  # Solve the MIP.
  mip.solve()

  # Get the objective value and the variable values.
  objValue = mip.solution.get_objective_value()
  varValues = {varName: mip.solution.get_values(varName) for _, varName in objective}

  # Return the objective value and the variable values.
  return objValue, varValues
