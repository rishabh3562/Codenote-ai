import React, { LazyExoticComponent } from 'react';

type LazyImportFunction = () => Promise<any>; // Function that returns a promise with the module

const lazyImport = (
  importFunc: LazyImportFunction
): LazyExoticComponent<React.ComponentType<any>> => {
  return React.lazy(async () => {
    const module = await importFunc();
    return {
      default: module.default,
      ...module, // Spread to include named exports as well
    };
  });
};
export default lazyImport;
