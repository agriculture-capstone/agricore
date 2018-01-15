/** Possible types of input */
export type VariableType = StringConstructor | NumberConstructor;

/** Validation info for environment variables */
export interface VariableInfo {
  expectedType: VariableType;
  required: boolean;
}

/** Structure for environment variables */
export interface EnvironmentVariables {
  [key: string]: VariableInfo;
}
