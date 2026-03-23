export function Loggable(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`[${target.constructor?.name ?? target.name}] ${key}() chamado`);
    return original.apply(this, args);
  };
  return descriptor;
}