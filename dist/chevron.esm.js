/**
 * Service-type constructor function
 * @private
 * @param {Function} moduleContent module to be constructed as service
 * @param {Array} dependencies Array of dependency contents
 * @returns {Function} constructed function
 */
const typeService = function (moduleContent, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = moduleContent;

    moduleContent = function () {
        //Chevron service function wrapper
        //Return function with args injected
        return serviceFn(...dependencies, ...arguments);
    };

    return moduleContent;
};

/**
 * Factory-type constructor function
 * @private
 * @param {Function} moduleContent module to be constructed as factory
 * @param {Array} dependencies Array of dependency contents
 * @returns {Object} constructed Factory
 */
const typeFactory = function (moduleContent, dependencies) {
    //Dereference array, because we dont wanna mutate the arg
    const dependenciesArr = Array.from(dependencies);
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependenciesArr.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    moduleContent = new(Function.prototype.bind.apply(moduleContent, dependenciesArr));

    return moduleContent;
};

/**
 * Chevron Class
 * @class
 */
const Chevron = class {
    /**
     * Chevron Constructor
     * @constructor
     * @returns {Chevron} Chevron instance
     */
    constructor() {
        const _this = this;

        //Instance container
        _this.$ = new Map();

        // Adds default types
        _this.extend("service", typeService);
        _this.extend("factory", typeFactory);
    }
    /**
     * Defines a new module type
     * @param {String} typeName name of the new type
     * @param {Function} constructorFunction function init modules with
     * @returns {Chevron} Chevron instance
     */
    extend(typeName, constructorFunction) {
        const _this = this;

        //stores type as set with name into instance
        _this[typeName] = (id, dependencies, fn) => _this.set(id, dependencies, fn, constructorFunction);

        return _this;
    }
    /**
     * Defines a new module
     * @param {String} moduleName name of the module
     * @param {Array} dependencies array of dependency names
     * @param {Function} content module content
     * @param {Function} constructorFunction function init the modules with
     * @returns {Chevron} Chevron instance
     *
     * Internal Module structure:
     * [ready<boolean>,content<mixed>,init<fn>]
     */
    set(moduleName, dependencies, content, constructorFunction) {
        const _this = this;
        const _module = [false, content];

        //Add init-fn
        _module.push(() => {
            const constructedDependencies = dependencies.map(dependencyName => _this.get(dependencyName));

            //Calls constructorFunction on the module
            _module[1] = constructorFunction(_module[1], constructedDependencies);
            _module[0] = true;

            return _module[1];
        });

        _this.$.set(moduleName, _module);

        return _this;
    }
    /**
     * Access and init a module
     * @param {String} moduleName name of the module to access
     * @returns {Mixed} module content
     */
    get(moduleName) {
        const _this = this;

        if (_this.$.has(moduleName)) {
            const dependency = _this.$.get(moduleName);

            return dependency[0] ? dependency[1] : dependency[2]();
        } else {
            throw new Error(`Missing '${moduleName}'`);
        }
    }
};

export default Chevron;