const isObject = (x: any) =>
  !!(x && typeof x === "object" && !Array.isArray(x));

export default function proxyMerged(sources: Record<string, any>[]): any {
  const keys: () => (string | symbol)[] = () =>
    Array.from(
      new Set(
        sources
          .reverse()
          .reduce((result, src) => result.concat(Object.keys(src)), [])
      )
    );

  const composedPropCache: Record<string, any> = {};
  const composeProp = (name: string) =>
    composedPropCache[name] ||
    (composedPropCache[name] = proxyMerged(
      sources.map((src) => isObject(src[name]) && src[name]).filter(Boolean)
    ));

  return new Proxy(Object.create(null), {
    get: (_target: any, name: string) => {
      for (const src of sources) {
        const val = src[name]; // first match
        if (typeof val !== "undefined")
          return isObject(val) ? composeProp(name) : val;
      }
    },

    set(_target: any, name: string, newVal: any) {
      for (const src of sources) {
        const oldVal = src[name];
        if (typeof oldVal !== "undefined") {
          src[name] = newVal;
          return true;
        }
      }

      // if we got here, the key was not found, so add it to the first object
      sources[0][name] = newVal;
      return true;
    },

    has: (_, sKey: string | symbol) => keys().indexOf(sKey) !== -1,

    ownKeys: keys,

    getOwnPropertyDescriptor: (_, sKey) => {
      for (const src of sources) {
        const d = Object.getOwnPropertyDescriptor(src, sKey);
        if (d) return d;
      }
    },
  });
}
