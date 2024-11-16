// components/MarkdownRenderer.js
import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItPrism from 'markdown-it-prism';
import 'prismjs/themes/prism.css'; // Include the Prism CSS for styling
import 'prismjs/components/prism-javascript'; // Import JavaScript syntax highlighting
import 'prismjs/components/prism-python'; // Import Python syntax highlighting
import 'prismjs/components/prism-solidity';
// Add other languages as needed

interface MarkdownRendererProps {
  markdown: string; // Specify that markdown is a string
}

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const md = new MarkdownIt().use(markdownItPrism);

  // Render the Markdown content as HTML
  const renderedMarkdown = md.render(markdown);

  return <div dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />;
}
