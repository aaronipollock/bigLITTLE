// Metro resolves image imports and turns them into `require` calls at build
// time, but TypeScript has no idea what a .webp file is. Neither Expo nor
// React Native ships these declarations, so an `import img from "./x.webp"`
// is an unresolved-module error even though it works at runtime.
//
// `ImageRequireSource` is the type Metro actually produces: an opaque number
// that the image components resolve to a real asset.

declare module "*.webp" {
    import type { ImageRequireSource } from "react-native";
    const source: ImageRequireSource;
    export default source;
}

declare module "*.png" {
    import type { ImageRequireSource } from "react-native";
    const source: ImageRequireSource;
    export default source;
}

declare module "*.jpg" {
    import type { ImageRequireSource } from "react-native";
    const source: ImageRequireSource;
    export default source;
}

declare module "*.jpeg" {
    import type { ImageRequireSource } from "react-native";
    const source: ImageRequireSource;
    export default source;
}

declare module "*.gif" {
    import type { ImageRequireSource } from "react-native";
    const source: ImageRequireSource;
    export default source;
}
