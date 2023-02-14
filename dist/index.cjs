'use strict';

const pc = require('picocolors');
const fetch = require('node-fetch');
const decompress = require('decompress');

function logSuccess(...args) {
  console.log(pc.green(pc.bold(`[vite-plugin-tolgee] `)), ...args);
}
function logError(...args) {
  console.error(pc.red(pc.bold(`[vite-plugin-tolgee] `)), ...args);
}

function tolgeeApi(path, options) {
  return fetch(`${options.apiUrl}/v2${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": options.apiKey
    }
  });
}
function viteTolgee(options) {
  return {
    name: "vite-plugin-tolgee",
    buildStart: async () => {
      try {
        await fetchTolgeeTranslations(options);
      } catch (e) {
        logError("Building resources on start went wrong...");
        console.error(e);
      }
    }
  };
}
async function getLocalesZip(options) {
  const response = await tolgeeApi(`/projects/export`, options);
  return response.buffer();
}
async function fetchTolgeeTranslations(options) {
  const buffer = await getLocalesZip(options);
  await decompress(buffer, options.outputPath);
  logSuccess("Pulled translation files from Tolgee!", pc.green("\u2714"));
}

exports.viteTolgee = viteTolgee;
