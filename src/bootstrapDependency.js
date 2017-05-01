"use strict";

const bootstrapDependency = function (_container, dependencyName) {
    if (_container.has(dependencyName)) {
        const dependency = _container.get(dependencyName);

        return dependency.r ? dependency.c : dependency.i();
    } else {
        throw new Error(`Missing '${dependencyName}'`);
    }
};

export default bootstrapDependency;