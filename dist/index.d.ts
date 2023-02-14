import { Plugin } from 'vite';

interface PluginOptions {
    apiUrl: string;
    apiKey: string;
    outputPath: string;
}
/**
 * @param options
 * @returns Plugin
 */
declare function viteTolgee(options: PluginOptions): Plugin;

export { viteTolgee };
