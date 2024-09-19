const sanitizeData = (data) => {
    const result = [];

    const flattenObject = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = prefix ? `${prefix}_${key}` : key;
            if (Array.isArray(obj[key])) {
                obj[key].forEach((item, index) => {
                    acc = { ...acc, ...flattenObject(item, `${newKey}_${index}`) };
                });
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                acc = { ...acc, ...flattenObject(obj[key], newKey) };
            } else {
                acc[newKey] = obj[key];
            }
            return acc;
        }, {});
    };

    data.forEach(item => {
        result.push(flattenObject(item));
    });

    return result;
};

export default sanitizeData;
