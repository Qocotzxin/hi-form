import { Events, HiFormFieldOptions, HiFormValidationFn } from "../types";

export function mergeOptions(
  globalOptions: HiFormFieldOptions | undefined,
  fieldOptions: HiFormFieldOptions | undefined
): HiFormFieldOptions {
  return {
    validateOn: fieldOptions?.validateOn || globalOptions?.validateOn,
    validateDirtyOnly:
      typeof fieldOptions?.validateDirtyOnly === "undefined"
        ? globalOptions?.validateDirtyOnly
        : fieldOptions.validateDirtyOnly,
    validators: mergeMaybeArray<HiFormValidationFn>(
      globalOptions?.validators,
      fieldOptions?.validators
    ),
    emitOn: mergeMaybeArray<Events>(
      globalOptions?.emitOn,
      fieldOptions?.emitOn
    ),
  };
}

export function mergeMaybeArray<T>(
  src: T[] | undefined,
  target: T[] | undefined
): T[] {
  const verifiedSrc = src || [];
  const verifiedTarget = target || [];

  return [...verifiedSrc, ...verifiedTarget];
}
