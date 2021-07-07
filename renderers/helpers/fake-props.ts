export function generateFakeProps(path: string[] = []): any {
  const requestedProps = new Set<string | symbol>();
  return new Proxy(
    {},
    {
      get: function (target, prop, receiver) {
        requestedProps.add(prop);
        const nestedPath = [...path, prop.toString()];
        if (prop == "hasOwnProperty") {
          return (prop: string | symbol) => {
            requestedProps.add(prop);
            return true;
          };
        }
        if (prop === "length") {
          return requestedProps.has(Symbol.iterator) &&
            requestedProps.has("entries")
            ? 1
            : 0;
        }
        if (prop === "0") {
          return pathToString(path);
        }
        if (prop === Symbol.iterator) {
          return [][Symbol.iterator];
        }
        if (prop === Symbol.toPrimitive) {
          return (hint: string) => {
            switch (hint) {
              case "number":
                return 0;
              case "string":
              default:
                return pathToString(path);
            }
          };
        }
        if (prop === "toString") {
          return () => pathToString(nestedPath);
        }
        return generateFakeProps(nestedPath);
      },
      has: function (target, prop) {
        requestedProps.add(prop);
        return true;
      },
    }
  );
}

function pathToString(path: string[]) {
  return `{${path.filter((segment) => !segment.startsWith("$$")).join(".")}}`;
}
