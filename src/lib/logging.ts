const isProductionBuildPhase =
  process.env.NODE_ENV === "production" && process.env.NEXT_PHASE === "phase-production-build";

export const logNonCriticalError = (...args: unknown[]) => {
  if (isProductionBuildPhase) {
    return;
  }

  console.error(...args);
};
