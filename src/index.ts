import type { Plugin } from 'vite';
// import { writeFileSync, existsSync, mkdirSync } from 'fs';
import pc from 'picocolors';
import fetch from 'node-fetch';
import decompress from 'decompress';

import { logError, logSuccess } from './logger';

interface PluginOptions {
  apiUrl: string;
  apiKey: string;
  outputPath: string;
}

interface TolgeeOptions {
  apiUrl: string;
  apiKey: string;
}

function tolgeeApi(path: string, options: TolgeeOptions) {
  return fetch(`${options.apiUrl}/v2${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': options.apiKey,
    },
  });
}

/**
 * @param options
 * @returns Plugin
 */
function viteTolgee(options: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-tolgee',

    buildStart: async () => {
      try {
        await fetchTolgeeTranslations(options);
      } catch (e) {
        logError('Building resources on start went wrong...');
        console.error(e);
      }
    },
  };
}

/**
 * Get zip with locale files in namespace folder structure.
 */
async function getLocalesZip(options: TolgeeOptions) {
  const response = await tolgeeApi(`/projects/export`, options);
  return response.buffer();
}

/**
 * Get an array of locale tags.
 */
// async function getLocales(options: TolgeeOptions): Promise<string[]> {
//   const result = await tolgeeApi('/projects/languages', options);
//   const data = await result.json();

//   const languages = data._embedded?.languages;
//   if (Array.isArray(languages)) {
//     return languages.map((language) => language.tag);
//   }
//   throw new Error("Couldn't get languages");
// }

/**
 * Get a locale file for a locale tag
 */
// async function getLocale(locale: string, options: TolgeeOptions) {
//   const data = await tolgeeApi(
//     `/projects/export?languages=${locale}&zip=false`,
//     options
//   );
//   return data.text();
// }

async function fetchTolgeeTranslations(options: PluginOptions) {
  const buffer = await getLocalesZip(options);
  await decompress(buffer, options.outputPath);

  // // Get an array of locale tags
  // const locales = await getLocales(options);
  // console.log(locales);

  // // Get a locale file for every locale tag
  // for (const locale of locales) {
  //   const translations = await getLocale(locale, options);
  //   console.dir(translations, translations);
  //   if (!existsSync(options.outputPath)) {
  //     mkdirSync(options.outputPath);
  //   }
  //   writeFileSync(`${options.outputPath}/${locale}.json`, translations);
  // }
  logSuccess('Pulled translation files from Tolgee!', pc.green('✔'));
}

export { viteTolgee };
