declare module "pagedjs" {
    // Types for paged.js objects and functions
    // You can add more types based on the specific functionalities you intend to use

    // Example type for a paged.js instance
    export interface PagedJSInstance {
        // Add methods and properties based on paged.js API
        // Example:
        render(): void;
        // You would need to extend this with the actual methods and properties provided by paged.js
    }

    // Example type for configuration options
    export interface PagedJSOptions {
        // Define configuration options based on paged.js API
        // Example:
        auto: boolean;
        // You would need to extend this with the actual configuration options provided by paged.js
    }

    // Example function to create a paged.js instance
    export function pagedjs(
        element: HTMLElement,
        options?: PagedJSOptions
    ): PagedJSInstance;
    export class Previewer {
        constructor(options?: PagedJSOptions);
        preview(
            content: string,
            stylesheets: string[],
            container: HTMLElement
        ): Promise<void>;
        // You would need to extend this with the actual methods and properties provided by Previewer
    }
}
