const singletonScope = (name) => `SINGLETON_${name}`;
const prototypeScope = () => null;
const DefaultScopes = {
    SINGLETON: singletonScope,
    PROTOTYPE: prototypeScope
};
export { DefaultScopes };
//# sourceMappingURL=DefaultScopes.js.map