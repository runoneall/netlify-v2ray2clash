import { ClashConfigBuilder } from './ClashConfigBuilder.js';
import { PREDEFINED_RULE_SETS } from './config.js';

export default async (request, context) => {
    let inputString;
    if (request.method === 'GET') {
        inputString = request.url.slice(request.url.indexOf('?sub:') + 5);
    }
    if (request.method === 'POST') {
        inputString = await request.text();
    }
    let selectedRules = "%22comprehensive%22";
    let customRules = "%5B%5D";
    let pin = "false";
    if (PREDEFINED_RULE_SETS[selectedRules]) {
        selectedRules = PREDEFINED_RULE_SETS[selectedRules];
    } else {
        try {
            selectedRules = JSON.parse(decodeURIComponent(selectedRules));
        } catch (error) {
            console.error('Error parsing selectedRules:', error);
            selectedRules = PREDEFINED_RULE_SETS.minimal;
        }
    }
    try {
        customRules = JSON.parse(decodeURIComponent(customRules));
    } catch (error) {
        console.error('Error parsing customRules:', error);
        customRules = [];
    }
    let baseConfig;
    let configBuilder;
    configBuilder = new ClashConfigBuilder(inputString, selectedRules, customRules, pin, baseConfig);
    let config = await configBuilder.build();
    config = config.split('\n').filter(line => !line.includes(': \'\'')).join('\n');
    return new Response(config, {
        headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
    });
};