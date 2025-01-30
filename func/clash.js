import { ClashConfigBuilder } from './ClashConfigBuilder.js';

export default async (request, context) => {
    const inputString = await request.text();
    let baseConfig;
    const configBuilder = new ClashConfigBuilder(inputString, "comprehensive", [], false, baseConfig);
    const config = await configBuilder.build();
    return new Response(config, {
        headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
    });
};
