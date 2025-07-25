module.exports = function (eleventyConfig) {
    // Копируем статические файлы (CSS, JS, изображения)
    eleventyConfig.addPassthroughCopy('src/styles');
    eleventyConfig.addPassthroughCopy('src/script');
    eleventyConfig.addPassthroughCopy('src/foto');


        // Фильтр для преобразования пути в slug (чистый URL)
    eleventyConfig.addFilter("slugify", function (value) {
        return value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    });    

    return {
        dir: {
            input: 'src', // Папка с исходными файлами
            output: 'dist', // Папка для выходных файлов
        },
        templateFormats: ['njk', 'md', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',        
    };
};