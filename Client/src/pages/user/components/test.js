import { convert } from 'html-to-text';

const htmls = [
    '<div>Hello World!</div>',
    '<div>こんにちは世界！</div>',
];
const html = '<div>Hello World</div>';
const text = convert(html);
console.log(text);