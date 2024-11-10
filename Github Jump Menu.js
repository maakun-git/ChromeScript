// ==UserScript==
// @name         Github Jump Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a sidebar with links to each version in the OpenCV Changelog Wiki
// @author       you
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a sidebar container for the links
    const sidebar = document.createElement('div');
    sidebar.style.position = 'fixed';
    sidebar.style.top = '10px';
    sidebar.style.left = '10px';
    sidebar.style.width = '200px';
    sidebar.style.padding = '10px';
    sidebar.style.backgroundColor = '#f5f5f5';
    sidebar.style.border = '1px solid #ddd';
    sidebar.style.zIndex = '1000';
    sidebar.style.overflowY = 'auto';
    sidebar.style.maxHeight = '50vh';
    sidebar.style.fontSize = '14px';
    sidebar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    sidebar.style.cursor = 'move';

    // Add title to the sidebar
    const title = document.createElement('h3');
    title.textContent = 'Contents';
    title.style.margin = '0 0 10px';
    title.style.fontSize = '16px';
    title.style.color = '#333';
    sidebar.appendChild(title);

    // Add the sidebar to the document body
    document.body.appendChild(sidebar);

    // Find all headers containing version numbers and add them to the sidebar
    //document.querySelectorAll('h2').forEach(header => {
    document.querySelectorAll('#wiki-body h1, #wiki-body h2').forEach(header => {
        const link = document.createElement('a');
        link.textContent = header.textContent;
        link.href = `#${header.textContent}`;
        link.style.display = 'block';
        link.style.marginBottom = '8px';
        const defColor = link.style.color;

        // Add hover effect for links
        link.addEventListener('mouseover', () => {
            link.style.color = '#0366d6';
            link.style.textDecoration = 'underline'; }
        );
        link.addEventListener('mouseout', () => {
            link.style.color = defColor;
            link.style.textDecoration = 'none';
        }
    );

        header.setAttribute("id", header.textContent);
        sidebar.appendChild(link);
    });

    // Make the sidebar draggable
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    sidebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = sidebar.offsetLeft;
        initialTop = sidebar.offsetTop;
        sidebar.style.cursor = 'grabbing';
        e.preventDefault(); // Prevents text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            sidebar.style.left = `${initialLeft + dx}px`;
            sidebar.style.top = `${initialTop + dy}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        sidebar.style.cursor = 'move';
    });
})();
