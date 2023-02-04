import { Events, HiFormFieldOptions, HiFormValidationFn } from "../types";
import { returnValueOrType } from "./type-helpers";

export function mergeOptions(
  globalOptions: HiFormFieldOptions | undefined,
  fieldOptions: HiFormFieldOptions | undefined
): HiFormFieldOptions {
  const emitOn = mergeMaybeArray<Events>(
    globalOptions?.emitOn,
    fieldOptions?.emitOn
  );

  return {
    validateOn: fieldOptions?.validateOn || globalOptions?.validateOn,
    validateDirtyOnly: returnValueOrType(
      fieldOptions?.validateDirtyOnly,
      globalOptions?.validateDirtyOnly
    ),
    validators: mergeMaybeArray<HiFormValidationFn>(
      globalOptions?.validators,
      fieldOptions?.validators
    ),
    emitOn: emitOn.length ? emitOn : undefined,
    isInitiallyDirty: returnValueOrType(
      fieldOptions?.isInitiallyDirty,
      globalOptions?.isInitiallyDirty
    ),
    isInitiallyTouched: returnValueOrType(
      fieldOptions?.isInitiallyTouched,
      globalOptions?.isInitiallyTouched
    ),
    isInitiallyValid: returnValueOrType(
      fieldOptions?.isInitiallyDirty,
      globalOptions?.isInitiallyDirty
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
