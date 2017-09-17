/**
 * Factory-type constructor function
 *
 * @private
 * @param {Function} moduleContent module to be constructed as factory
 * @param {Array<any>} dependencies Array of dependency contents
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

export default typeFactory;
