const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withGradleMemory(config) {
    return withGradleProperties(config, (config) => {
        const props = config.modResults;

        const set = (key, value) => {
            const existing = props.find(p => p.type === 'property' && p.key === key);
            if (existing) {
                existing.value = value;
            } else {
                props.push({ type: 'property', key, value });
            }
        };

        set('org.gradle.jvmargs', '-Xmx3g -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8');
        set('kotlin.daemon.jvm.options', '-Xmx1536m');

        return config;
    });
};