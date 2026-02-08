"use client";

import { useForm, UseFormReturn, Path } from "react-hook-form";
import { useMemo, useSyncExternalStore, useEffect, useRef, useCallback } from "react";

// Type-safe filter value types
export type FilterFieldValue = 
  | string 
  | string[] 
  | Date 
  | { from?: Date; to?: Date } 
  | undefined;

export type FilterFieldConfig = {
  type: "search" | "singleSelect" | "multiSelect" | "singleDate" | "dateRange";
  defaultValue: FilterFieldValue;
  placeholder?: string;
  label?: string;
  className?: string;
  wrapperClass?: string;
  options?: Array<{ label: string; value: string }>;
};

export type FilterConfig = Record<string, FilterFieldConfig>;

export type FilterValues<T extends FilterConfig> = {
  [K in keyof T]: T[K]['defaultValue'];
};

export type FilterField = {
  value: FilterFieldValue;
  selected: FilterFieldValue;
  onChange: (val: FilterFieldValue) => void;
  onSelect: (val: FilterFieldValue) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  wrapperClass?: string;
  options?: Array<{ label: string; value: string }>;
  inputProps?: {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

export interface UseSharedFiltersResult<T extends FilterConfig> {
  form: UseFormReturn<FilterValues<T>>;
  values: FilterValues<T>;
  fields: Record<keyof T, FilterField>;
  setValue: (key: keyof T, value: FilterFieldValue) => void;
  reset: () => void;
}

/**
 * Generic filter store factory - works for ANY module
 * No need to create separate hooks per module
 */
function createFilterStore<T extends FilterConfig>(config: T) {
  // Extract defaults from config
  const defaults = Object.entries(config).reduce((acc, [key, cfg]) => {
    acc[key] = cfg.defaultValue;
    return acc;
  }, {} as Record<string, FilterFieldValue>);

  let state: Record<string, FilterFieldValue> = defaults;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (newState: Record<string, FilterFieldValue>) => {
      state = newState;
      listeners.forEach((l) => l());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getDefaults: () => defaults,
  };
}

// Store registry by config identity
const storeRegistry = new WeakMap<FilterConfig, ReturnType<typeof createFilterStore<FilterConfig>>>();

/**
 * Universal filter hook - use in ANY module with ANY config
 * 
 * Usage:
 * const filters = useSharedFilters(TAG_FILTER_CONFIG);
 * const filters = useSharedFilters(POST_FILTER_CONFIG);
 * const filters = useSharedFilters(CLIENT_FILTER_CONFIG);
 */
export function useSharedFilters<T extends FilterConfig>(config: T): UseSharedFiltersResult<T> {
  // Get or create store for this config
  if (!storeRegistry.has(config)) {
    storeRegistry.set(config, createFilterStore(config));
  }
  const store = storeRegistry.get(config)!;

  // Initialize RHF with proper typing
  const form = useForm<FilterValues<T>>({
    // @ts-expect-error - RHF's DefaultValues type is overly strict for our generic pattern
    defaultValues: store.getDefaults() as FilterValues<T>,
    mode: "onChange"
  });

  // Subscribe to RHF changes using its built-in subscription
  const formValues = form.watch();
  
  // Stabilize with ref to prevent infinite loops
  const prevValuesRef = useRef<string>("");

  // Sync to store when form changes (use useEffect, not useMemo for side effects)
  useEffect(() => {
    const currentJson = JSON.stringify(formValues);
    if (currentJson !== prevValuesRef.current) {
      prevValuesRef.current = currentJson;
      store.setState(formValues as Record<string, FilterFieldValue>);
    }
  }, [formValues, store]);

  // Subscribe to shared state
  const sharedValues = useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getState
  );
  
  // Stabilize shared values to prevent field regeneration
  const valuesStableRef = useRef(sharedValues);
  const valuesJson = JSON.stringify(sharedValues);
  const prevJsonRef = useRef(valuesJson);
  
  if (valuesJson !== prevJsonRef.current) {
    prevJsonRef.current = valuesJson;
    valuesStableRef.current = sharedValues;
  }
  
  const stableValues = valuesStableRef.current;

  // Auto-generate fields with stable callbacks
  const fields = useMemo(() => {
    return Object.entries(config).reduce((acc, [key, cfg]) => {
      const value = stableValues[key as keyof typeof stableValues];
      acc[key] = {
        value: cfg.type === "multiSelect" ? (value || []) : value,
        selected: cfg.type === "multiSelect" ? (value || []) : value,
        onChange: (val: FilterFieldValue) => {
          // @ts-expect-error - RHF's Path type is too strict for our generic implementation
          form.setValue(key as Path<FilterValues<T>>, val);
        },
        onSelect: (val: FilterFieldValue) => {
          // @ts-expect-error - RHF's Path type is too strict for our generic implementation
          form.setValue(key as Path<FilterValues<T>>, val);
        },
        placeholder: cfg.placeholder,
        label: cfg.label,
        className: cfg.className,
        wrapperClass: cfg.wrapperClass,
        options: cfg.options,
        inputProps: cfg.type === "search" ? {
          placeholder: cfg.placeholder || "Search...",
          value: (value as string) || "",
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            // @ts-expect-error - RHF's Path type is too strict for our generic implementation
            form.setValue(key as Path<FilterValues<T>>, e.target.value);
          },
        } : undefined,
      };
      return acc;
    }, {} as Record<string, FilterField>);
  }, [config, stableValues, form]);
  
  // Stable callbacks
  const setValue = useCallback((key: keyof T, value: FilterFieldValue) => {
    // @ts-expect-error - RHF's Path type is too strict for our generic implementation
    form.setValue(key as Path<FilterValues<T>>, value);
  }, [form]);
  
  const reset = useCallback(() => {
    form.reset(store.getDefaults() as FilterValues<T>);
  }, [form, store]);

  return {
    // @ts-expect-error - RHF's generic constraints are too strict for our pattern
    form,
    values: stableValues as FilterValues<T>,
    fields: fields as Record<keyof T, FilterField>,
    setValue,
    reset,
  };
}
